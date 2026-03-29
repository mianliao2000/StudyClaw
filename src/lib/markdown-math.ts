const COMMON_MATH_WORDS = new Set([
  "arg",
  "cos",
  "det",
  "exp",
  "inf",
  "lim",
  "ln",
  "log",
  "max",
  "min",
  "rank",
  "sin",
  "sup",
  "tan",
  "trace",
]);

function isMathBoundary(char: string | undefined) {
  if (!char) return true;
  return !/[A-Za-z0-9_$`\\]/.test(char);
}

function isPotentialMathStart(char: string) {
  return /[A-Za-z\\]/.test(char);
}

function isAllowedMathChar(char: string) {
  return /[A-Za-z0-9\\{}^_+\-*/=<>()\[\],.|:&\s]/.test(char);
}

function isCompactMathAtom(text: string) {
  const value = text.trim();
  if (!value || value.length > 32) return false;

  return (
    /^(?:[A-Za-z]|\d+(?:\.\d+)?|\\[A-Za-z]+)(?:[_^](?:\{[^{}\n]+\}|[A-Za-z0-9\\]+))*(?:\([^)\n]{0,20}\))?(?:\\%|%)?$/u.test(
      value
    ) ||
    /^O\([A-Za-z0-9]+\)$/u.test(value)
  );
}

function shouldStartBareMath(markdown: string, index: number) {
  const char = markdown[index];

  if (char === "\\") return true;
  if (!/[A-Za-z]/.test(char)) return false;

  const tokenMatch = markdown.slice(index).match(/^[A-Za-z][A-Za-z0-9]*/);
  if (!tokenMatch) return false;

  const token = tokenMatch[0];
  const afterToken = markdown
    .slice(index + token.length)
    .match(/^\s*([()[\]^_=\\])/);

  return Boolean(afterToken);
}

function looksLikeMathExpression(value: string) {
  const text = value.trim();
  if (!text || text.length > 220) return false;

  const hasLatexCommand = /\\[a-zA-Z]+/.test(text);
  const hasEquationOperator = /[=<>+\-*/^_]/.test(text);
  const hasEquationStart = /\b[A-Za-z][A-Za-z0-9]*\b\s*=\s*[-+A-Za-z0-9\\]/.test(text);
  const hasGroupedVariable = /[A-Za-z]\s*(?:\(|\[)/.test(text);
  const hasStructuredMath =
    /(?:\^\{?.+?\}?|_\{?.+?\}?|\\(?:frac|int|sum|prod|sqrt|left|right|cdot|times|partial|nabla|top|mathbf|mathrm))/u.test(
      text
    );
  const hasNamedFunction = /\b(?:sin|cos|tan|log|ln|max|min|exp|det|rank|trace)\b/i.test(text);
  const identifierCount = (text.match(/\b[A-Za-z][A-Za-z0-9]*\b/g) ?? []).length;
  const proseWordCount = (text.match(/\b[A-Za-z]{4,}\b/g) ?? []).filter(
    (word) => !COMMON_MATH_WORDS.has(word.toLowerCase())
  ).length;
  const hasCompactMathAtom = isCompactMathAtom(text);

  return (
    (hasCompactMathAtom ||
      hasLatexCommand ||
      hasStructuredMath ||
      hasNamedFunction ||
      hasGroupedVariable ||
      hasEquationStart ||
      (hasEquationOperator && identifierCount >= 2)) &&
    proseWordCount <= 4
  );
}

function normalizeBoldMarkers(markdown: string) {
  return markdown.replace(/\*\*\s*([^*\n][^*\n]*?)\s*\*\*/g, (_, content: string) => {
    const cleaned = content.trim();
    return cleaned ? `**${cleaned}**` : _;
  });
}

function repairBrokenLeftRightDelimiters(markdown: string) {
  return markdown.replace(/\\left\$/g, "\\left(").replace(/\\right\$/g, "\\right)");
}

function repairDanglingInlineLatex(markdown: string) {
  let result = "";

  for (let index = 0; index < markdown.length; index += 1) {
    if (markdown[index] === "\\" && markdown[index + 1] === "(") {
      const closeIndex = markdown.indexOf("\\)", index + 2);

      if (closeIndex !== -1) {
        result += markdown.slice(index, closeIndex + 2);
        index = closeIndex + 1;
        continue;
      }

      let cursor = index + 2;
      while (cursor < markdown.length) {
        const current = markdown[cursor];
        if ("\n\u3002\uff01\uff1f\uff1b;,. \uff0c".replace(" ", "").includes(current)) break;
        cursor += 1;
      }

      const candidate = markdown.slice(index + 2, cursor).trim();
      if (looksLikeMathExpression(candidate)) {
        result += `$${candidate}$`;
        index = cursor - 1;
        continue;
      }
    }

    result += markdown[index];
  }

  return result;
}

function unwrapNonMathInlineDollarRuns(markdown: string) {
  return markdown.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (match, inner: string) => {
    return looksLikeMathExpression(inner) ? match : inner;
  });
}

function readBareMathEnd(markdown: string, start: number) {
  let cursor = start;
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;

  while (cursor < markdown.length) {
    const current = markdown[cursor];
    const previous = cursor > start ? markdown[cursor - 1] : "";

    if (current === "\n" || current === "`" || current === "$") break;
    if (/[\u4e00-\u9fff]/u.test(current)) break;
    if (!isAllowedMathChar(current)) break;

    if (current === "(") depthParen += 1;
    if (current === ")") depthParen = Math.max(0, depthParen - 1);
    if (current === "[") depthBracket += 1;
    if (current === "]") depthBracket = Math.max(0, depthBracket - 1);
    if (current === "{") depthBrace += 1;
    if (current === "}") depthBrace = Math.max(0, depthBrace - 1);

    const isOuterPunctuation =
      depthParen === 0 &&
      depthBracket === 0 &&
      depthBrace === 0 &&
      /[,:;.!?]/.test(current) &&
      previous !== "\\";

    if (isOuterPunctuation) break;

    cursor += 1;
  }

  while (cursor > start && /\s/u.test(markdown[cursor - 1])) {
    cursor -= 1;
  }

  return cursor;
}

function wrapBareMathRuns(markdown: string) {
  let result = "";

  for (let index = 0; index < markdown.length; index += 1) {
    if (markdown.startsWith("```", index)) {
      const closeIndex = markdown.indexOf("```", index + 3);
      if (closeIndex === -1) {
        result += markdown.slice(index);
        break;
      }

      result += markdown.slice(index, closeIndex + 3);
      index = closeIndex + 2;
      continue;
    }

    if (markdown[index] === "`") {
      const closeIndex = markdown.indexOf("`", index + 1);
      if (closeIndex === -1) {
        result += markdown.slice(index);
        break;
      }

      result += markdown.slice(index, closeIndex + 1);
      index = closeIndex;
      continue;
    }

    if (markdown.startsWith("$$", index)) {
      const closeIndex = markdown.indexOf("$$", index + 2);
      if (closeIndex === -1) {
        result += markdown.slice(index);
        break;
      }

      result += markdown.slice(index, closeIndex + 2);
      index = closeIndex + 1;
      continue;
    }

    if (markdown[index] === "$") {
      const closeIndex = markdown.indexOf("$", index + 1);
      if (closeIndex === -1) {
        result += markdown.slice(index);
        break;
      }

      result += markdown.slice(index, closeIndex + 1);
      index = closeIndex;
      continue;
    }

    const current = markdown[index];
    const previous = index > 0 ? markdown[index - 1] : undefined;

    if (isPotentialMathStart(current) && isMathBoundary(previous) && shouldStartBareMath(markdown, index)) {
      const end = readBareMathEnd(markdown, index);
      const candidate = markdown.slice(index, end).trim();

      if (candidate && looksLikeMathExpression(candidate)) {
        result += `$${candidate}$`;
        index = end - 1;
        continue;
      }
    }

    result += current;
  }

  return result;
}

function wrapMathInParentheses(markdown: string) {
  let result = "";

  for (let index = 0; index < markdown.length; index += 1) {
    const char = markdown[index];
    const leftContext = markdown.slice(Math.max(0, index - 5), index);

    if (char !== "(" || leftContext === "\\left") {
      result += char;
      continue;
    }

    let depth = 1;
    let cursor = index + 1;

    while (cursor < markdown.length && depth > 0) {
      const current = markdown[cursor];
      if (current === "(") depth += 1;
      if (current === ")") depth -= 1;
      cursor += 1;
    }

    if (depth !== 0) {
      result += char;
      continue;
    }

    const inner = markdown.slice(index + 1, cursor - 1);

    if (looksLikeMathExpression(inner)) {
      result += `$${inner.trim()}$`;
      index = cursor - 1;
      continue;
    }

    result += markdown.slice(index, cursor);
    index = cursor - 1;
  }

  return result;
}

export function normalizeMarkdownMath(markdown: string) {
  let normalized = normalizeBoldMarkers(markdown);

  normalized = repairBrokenLeftRightDelimiters(normalized)
    .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, expr: string) => `\n\n$$${expr.trim()}$$\n\n`)
    .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, expr: string) => `$${expr.trim()}$`);

  normalized = repairDanglingInlineLatex(normalized);
  normalized = unwrapNonMathInlineDollarRuns(normalized);
  normalized = wrapBareMathRuns(normalized);
  normalized = wrapMathInParentheses(normalized);

  return normalized
    .replace(/\$\$\s+([\s\S]*?)\s+\$\$/g, (_, expr: string) => `$$${expr.trim()}$$`)
    .replace(/\$\s+([^$]*?)\s+\$/g, (_, expr: string) => `$${expr.trim()}$`);
}
