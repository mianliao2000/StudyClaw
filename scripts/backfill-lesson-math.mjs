import process from "node:process";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { normalizeMarkdownMath } from "../src/lib/markdown-math.ts";

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const SHOW_HELP = args.has("--help") || args.has("-h");
const WRITE = args.has("--write");
const CONSERVATIVE = args.has("--conservative");
const idsArg = rawArgs.find((arg) => arg.startsWith("--ids="));
const selectedIds = new Set(
  (idsArg?.slice("--ids=".length).split(",") ?? []).map((value) => value.trim()).filter(Boolean)
);

const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

function printHelp() {
  console.log("Usage: node ./scripts/backfill-lesson-math.mjs [--write] [--conservative] [--ids=id1,id2]");
  console.log("");
  console.log("Options:");
  console.log("  --write         Persist normalized lessonContent.body changes to the database");
  console.log("  --conservative  Apply only high-confidence spacing and stray-$ fixes");
  console.log("  --ids=...       Restrict processing to a comma-separated list of lessonContent ids");
  console.log("  --help          Show this help message");
  console.log("");
  console.log("Default mode is a dry run that previews what would change.");
}

function previewSnippet(text) {
  return text.replace(/\s+/g, " ").trim().slice(0, 120);
}

function isCompactMathAtom(text) {
  const value = text.trim();
  if (!value || value.length > 32) return false;

  return (
    /^(?:[A-Za-z]|\d+(?:\.\d+)?|\\[A-Za-z]+)(?:[_^](?:\{[^{}\n]+\}|[A-Za-z0-9\\]+))*(?:\([^)\n]{0,20}\))?(?:\\%|%)?$/u.test(
      value
    ) ||
    /^O\([A-Za-z0-9]+\)$/u.test(value)
  );
}

function looksLikeMathExpression(value) {
  const text = value.trim();
  if (!text || text.length > 220) return false;

  const hasCompactMathAtom = isCompactMathAtom(text);
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
    (word) => !new Set(["arg", "cos", "det", "exp", "inf", "lim", "ln", "log", "max", "min", "rank", "sin", "sup", "tan", "trace"]).has(word.toLowerCase())
  ).length;

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

function conservativeNormalize(markdown) {
  return markdown
    .replace(/([^\s$([{\-])(\$[^$\n]+\$)/gu, (match, before, inlineMath) => {
      const inner = inlineMath.slice(1, -1);
      return looksLikeMathExpression(inner) ? `${before} ${inlineMath}` : match;
    })
    .replace(/(\$[^$\n]+\$)([A-Za-z\u4e00-\u9fff])/gu, (match, inlineMath, after) => {
      const inner = inlineMath.slice(1, -1);
      return looksLikeMathExpression(inner) ? `${inlineMath} ${after}` : match;
    })
    .replace(/(^|\n)-(\$[^$\n]+\$)([A-Za-z\u4e00-\u9fff])/gu, (match, prefix, inlineMath, after) => {
      const inner = inlineMath.slice(1, -1);
      return looksLikeMathExpression(inner) ? `${prefix}- ${inlineMath} ${after}` : match;
    })
    .replace(/\$(\d+(?:\.\d+)?)(?=[\u4e00-\u9fff，。,.!?\s"')\]])/gu, "$1");
}

async function main() {
  if (SHOW_HELP) {
    printHelp();
    return;
  }

  const lessonContents = await prisma.lessonContent.findMany({
    select: {
      id: true,
      contentType: true,
      lang: true,
      body: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const transform = CONSERVATIVE ? conservativeNormalize : normalizeMarkdownMath;
  const scope = selectedIds.size > 0
    ? lessonContents.filter((item) => selectedIds.has(item.id))
    : lessonContents;

  const candidates = lessonContents
    .filter((item) => (selectedIds.size > 0 ? selectedIds.has(item.id) : true))
    .filter((item) => item.body.trim().length > 0)
    .map((item) => {
      const normalizedBody = transform(item.body);
      return {
        ...item,
        normalizedBody,
        changed: normalizedBody !== item.body,
      };
    });

  const changed = candidates.filter((item) => item.changed);

  console.log(`Scanned ${lessonContents.length} lessonContent rows.`);
  console.log(`Rows in scope: ${scope.length}.`);
  console.log(`Non-empty bodies: ${candidates.length}.`);
  console.log(`Rows needing normalization: ${changed.length}.`);

  if (changed.length === 0) {
    console.log("No backfill changes are needed.");
    return;
  }

  console.log("");
  console.log("Preview:");
  for (const item of changed.slice(0, 5)) {
    console.log(`- ${item.id} [${item.contentType}/${item.lang}]`);
    console.log(`  before: ${previewSnippet(item.body)}`);
    console.log(`  after:  ${previewSnippet(item.normalizedBody)}`);
  }

  if (!WRITE) {
    console.log("");
    console.log("Dry run only. Re-run with --write to persist these updates.");
    return;
  }

  const batchSize = 50;
  let updatedCount = 0;

  for (let index = 0; index < changed.length; index += batchSize) {
    const batch = changed.slice(index, index + batchSize);
    await prisma.$transaction(
      batch.map((item) =>
        prisma.lessonContent.update({
          where: { id: item.id },
          data: { body: item.normalizedBody },
        })
      )
    );
    updatedCount += batch.length;
    console.log(`Updated ${updatedCount}/${changed.length} rows...`);
  }

  console.log("");
  console.log(`Backfill complete. Updated ${updatedCount} lessonContent rows.`);
}

main()
  .catch((error) => {
    console.error("Lesson math backfill failed:");
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
