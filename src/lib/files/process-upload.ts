import { prisma } from "@/lib/db";
import { extractTextFromFile } from "./extract-text";
import { summarizeExtractedText } from "./summarize-file";

export async function processUploadedFile(fileId: string): Promise<void> {
  const record = await prisma.planningFileUpload.findUnique({
    where: { id: fileId },
  });

  if (!record || !record.filePath) return;

  try {
    await prisma.planningFileUpload.update({
      where: { id: fileId },
      data: { status: "extracting" },
    });

    const text = await extractTextFromFile(record.filePath, record.mimeType);

    if (!text.trim()) {
      await prisma.planningFileUpload.update({
        where: { id: fileId },
        data: { status: "error" },
      });
      return;
    }

    await prisma.planningFileUpload.update({
      where: { id: fileId },
      data: { status: "summarizing" },
    });

    const { zh, en } = await summarizeExtractedText(text, record.fileName);

    await prisma.planningFileUpload.update({
      where: { id: fileId },
      data: { summary: zh, summaryEn: en, status: "ready" },
    });
  } catch (error) {
    console.error(`[processUploadedFile] Failed for ${fileId}:`, error);
    await prisma.planningFileUpload.update({
      where: { id: fileId },
      data: { status: "error" },
    }).catch(() => {});
  }
}
