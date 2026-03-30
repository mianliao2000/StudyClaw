import fs from "fs";
import path from "path";
import os from "os";
import { prisma } from "@/lib/db";

export async function cleanupStaleUploads(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const staleUploads = await prisma.planningFileUpload.findMany({
    where: {
      filePath: { not: null },
      project: {
        status: "planning",
        chapters: { none: {} },
        createdAt: { lt: cutoff },
      },
    },
    select: { id: true, filePath: true, projectId: true },
  });

  for (const upload of staleUploads) {
    if (upload.filePath) {
      try { fs.unlinkSync(upload.filePath); } catch { /* file may already be gone */ }
    }
  }

  const projectIds = [...new Set(staleUploads.map((u) => u.projectId))];
  for (const pid of projectIds) {
    const dir = path.join(os.tmpdir(), "studyclaw-uploads", pid);
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}
