import fs from "fs";

const MAX_TEXT_LENGTH = 50_000;

export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
): Promise<string> {
  switch (mimeType) {
    case "application/pdf":
      return extractPdf(filePath);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocx(filePath);
    case "text/plain":
    case "text/markdown":
    case "text/csv":
      return extractPlainText(filePath);
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

async function extractPdf(filePath: string): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  return truncate(result.text);
}

async function extractDocx(filePath: string): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ path: filePath });
  return truncate(result.value);
}

function extractPlainText(filePath: string): string {
  const text = fs.readFileSync(filePath, "utf-8");
  return truncate(text);
}

function truncate(text: string): string {
  if (text.length <= MAX_TEXT_LENGTH) return text;
  return text.slice(0, MAX_TEXT_LENGTH) + `\n\n[...truncated, original: ${text.length} characters]`;
}
