import { spawn } from "child_process";
import {
  writeFileSync,
  readFileSync,
  unlinkSync,
  mkdtempSync,
  existsSync,
  rmdirSync,
} from "fs";
import path from "path";
import os from "os";

function countMatches(source: string, pattern: RegExp): number {
  const matches = source.match(pattern);
  return matches ? matches.length : 0;
}

function extractStringLiterals(source: string): string[] {
  const stringPattern = /(['"])(?:(?=(\\?))\2.)*?\1/g;
  const matches = source.match(stringPattern) ?? [];
  return matches.map((raw) => raw.slice(1, -1).replace(/\\n/g, " ").trim());
}

function hasCjk(text: string): boolean {
  return /[\u3400-\u9fff]/.test(text);
}

function hasTooManyLongTextLiterals(source: string): boolean {
  const literals = extractStringLiterals(source);
  const longLabels = literals.filter((text) => text.length >= 18);
  return longLabels.length >= 4;
}

function isDiagramCodeTooComplex(pythonCode: string): string | null {
  const lowered = pythonCode.toLowerCase();
  const literals = extractStringLiterals(pythonCode);
  const cjkLiterals = literals.filter(hasCjk);
  const hasChinese = cjkLiterals.length > 0;

  if (/\bsubplot\b|\bsubplots\b/.test(lowered)) {
    return "multi-panel figures are disabled";
  }

  if (/\bnetworkx\b|\bnx\./.test(lowered)) {
    return "networkx diagrams are disabled for readability";
  }

  const annotateCount = countMatches(lowered, /\bannotate\s*\(/g);
  const textCount =
    countMatches(lowered, /\btext\s*\(/g) +
    countMatches(lowered, /\.text\s*\(/g);
  const arrowCount = countMatches(lowered, /arrowprops|arrow\s*\(/g);
  const patchCount =
    countMatches(lowered, /fanc?yb?boxpatch|rectangle\s*\(|circle\s*\(/g);

  if (annotateCount > 5) {
    return "too many annotations";
  }

  if (textCount > 8) {
    return "too many text labels";
  }

  if (arrowCount > 6) {
    return "too many arrows";
  }

  if (patchCount > 6) {
    return "too many drawn shapes";
  }

  if (hasTooManyLongTextLiterals(pythonCode)) {
    return "labels are too long";
  }

  if (hasChinese) {
    const longChineseLabels = cjkLiterals.filter((text) => text.length >= 9);
    if (cjkLiterals.length > 6) {
      return "too many Chinese labels";
    }

    if (longChineseLabels.length >= 2) {
      return "Chinese labels are too long";
    }

    if (annotateCount > 3) {
      return "too many Chinese annotations";
    }

    if (textCount > 5) {
      return "too many Chinese text labels";
    }

    if (arrowCount > 4) {
      return "too many arrows for a Chinese visual";
    }

    if (patchCount > 4) {
      return "too many boxes for a Chinese visual";
    }
  }

  return null;
}

/**
 * Execute AI-generated Python code to produce a diagram PNG.
 * Returns the image as a Buffer, or null on any failure.
 */
export async function executePythonForDiagram(
  pythonCode: string,
  timeoutMs = 30_000,
): Promise<Buffer | null> {
  const complexityReason = isDiagramCodeTooComplex(pythonCode);
  if (complexityReason) {
    console.warn("[executePythonForDiagram] Rejected complex visual:", complexityReason);
    return null;
  }

  const tmpDir = mkdtempSync(path.join(os.tmpdir(), "studyclaw-diagram-"));
  const scriptPath = path.join(tmpDir, "diagram.py");
  const outputPath = path.join(tmpDir, "diagram.png");

  // Inject a high-resolution matplotlib preamble so AI-generated diagrams
  // render crisply even when the model forgets to tune figure settings.
  const preamble = `
OUTPUT_PATH = r"${outputPath}"
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams["figure.figsize"] = (14, 9)
plt.rcParams["figure.dpi"] = 220
plt.rcParams["savefig.dpi"] = 320
plt.rcParams["savefig.facecolor"] = "white"
plt.rcParams["savefig.bbox"] = "tight"
plt.rcParams["lines.linewidth"] = 2.2
plt.rcParams["font.size"] = 13
plt.rcParams["axes.titlesize"] = 20
plt.rcParams["axes.titleweight"] = "bold"

_original_savefig = plt.savefig
def _studyclaw_highres_savefig(*args, **kwargs):
    try:
        requested = int(kwargs.get("dpi", 0) or 0)
    except Exception:
        requested = 0
    kwargs["dpi"] = max(requested, 320)
    kwargs["bbox_inches"] = "tight"
    kwargs["facecolor"] = "white"
    return _original_savefig(*args, **kwargs)
plt.savefig = _studyclaw_highres_savefig
`;

  const fullCode = `${preamble}\n${pythonCode}`;
  writeFileSync(scriptPath, fullCode, "utf-8");

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn("python", [scriptPath], {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: timeoutMs,
      });

      let stderr = "";
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });

      child.on("error", reject);
    });

    if (!existsSync(outputPath)) {
      console.error("[executePythonForDiagram] Output file not created");
      return null;
    }

    return readFileSync(outputPath);
  } catch (error) {
    console.error("[executePythonForDiagram] Failed:", error);
    return null;
  } finally {
    try { unlinkSync(scriptPath); } catch { /* ignore */ }
    try { unlinkSync(outputPath); } catch { /* ignore */ }
    try { rmdirSync(tmpDir); } catch { /* ignore */ }
  }
}

/** Extract Python code from a fenced ```python block in AI output. */
export function extractPythonCode(response: string): string | null {
  const match = response.match(/```python\s*([\s\S]*?)```/);
  return match?.[1]?.trim() || null;
}
