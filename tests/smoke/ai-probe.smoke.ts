/**
 * AI Probe Smoke Test
 *
 * Tests that all three AI-powered features can actually reach the configured
 * AI model and return a response. This test:
 *
 *   1. Creates a real guest session
 *   2. Creates a project (gets planning threadId)
 *   3. Tests PLANNING CHAT  (对话框)      → verifies stream starts
 *   4. Confirms the project with a minimal plan
 *   5. Tests CONTENT GENERATION (正文生成) → verifies body is returned
 *   6. Tests AI TUTOR (AI助手)            → verifies stream starts
 *   7. Deletes the test project (cleanup)
 *
 * This test writes to the production database. The test project is deleted
 * at the end; if the test crashes mid-way, the planning project is
 * auto-deleted after 24 hours by the existing cleanup job.
 *
 * Run manually:
 *   PRODUCTION_URL=https://... pnpm test:ai-probe
 */

type Chapter = {
  subchapters: Array<{
    contents: Array<{ id: string; contentType: string }>;
  }>;
};

type ConfirmedProject = {
  chapters: Chapter[];
};

const MINIMAL_PLAN = {
  title: "[AI Probe Test - delete me]",
  titleEn: "[AI Probe Test - delete me]",
  topic: "probe",
  topicEn: "probe",
  description: "Automated health check project",
  descriptionEn: "Automated health check project",
  goals: ["Verify AI connectivity"],
  goalsEn: ["Verify AI connectivity"],
  chapters: [
    {
      title: "Test Chapter",
      titleEn: "Test Chapter",
      subchapters: [
        {
          title: "Test Section A",
          titleEn: "Test Section A",
          learningObjective: "Verify AI content generation works end-to-end.",
          learningObjectiveEn:
            "Verify AI content generation works end-to-end.",
        },
        {
          title: "Test Section B",
          titleEn: "Test Section B",
          learningObjective: "Verify AI tutor works end-to-end.",
          learningObjectiveEn: "Verify AI tutor works end-to-end.",
        },
        {
          title: "Test Section C",
          titleEn: "Test Section C",
          learningObjective: "Padding to satisfy minimum subchapter count.",
          learningObjectiveEn: "Padding to satisfy minimum subchapter count.",
        },
      ],
    },
  ],
};

async function readFirstChunk(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");
  try {
    const { value, done } = await reader.read();
    if (done || !value || value.length === 0) {
      throw new Error("Stream was empty");
    }
    return new TextDecoder().decode(value);
  } finally {
    reader.cancel().catch(() => {});
  }
}

export async function runAiProbeSmoke(baseUrl: string): Promise<void> {
  const errors: string[] = [];
  let projectId: string | null = null;
  let cookieHeader = "";

  // ── Step 1: Guest login ──────────────────────────────────────────────────
  try {
    const guestRes = await fetch(`${baseUrl}/api/auth/guest`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
    });
    if (!guestRes.ok) {
      throw new Error(`HTTP ${guestRes.status}`);
    }

    const setCookie = guestRes.headers.get("set-cookie") ?? "";
    const cookieMatch = setCookie.match(
      /(__Secure-authjs\.session-token|authjs\.session-token)=([^;]+)/
    );
    if (!cookieMatch) {
      throw new Error("Session cookie not found in Set-Cookie header");
    }
    cookieHeader = `${cookieMatch[1]}=${cookieMatch[2]}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`[Step 1] Guest login failed: ${msg}`);
    throw new Error(errors.join("\n")); // can't continue without auth
  }

  // ── Step 2: Create project ───────────────────────────────────────────────
  let planningThreadId: string | null = null;
  try {
    const projectRes = await fetch(`${baseUrl}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        title: "[AI Probe Test - delete me]",
        topic: "probe",
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!projectRes.ok) {
      throw new Error(`HTTP ${projectRes.status}`);
    }

    const project = (await projectRes.json()) as {
      id: string;
      chatThreads: Array<{ id: string; mode: string }>;
    };
    projectId = project.id;
    planningThreadId =
      project.chatThreads?.find((t) => t.mode === "planning")?.id ?? null;

    if (!planningThreadId) {
      throw new Error("Planning thread ID not in POST /api/projects response");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`[Step 2] Create project failed: ${msg}`);
    throw new Error(errors.join("\n"));
  }

  // ── Step 3: Test PLANNING CHAT (对话框) ──────────────────────────────────
  try {
    const chatRes = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        threadId: planningThreadId,
        message: "hi",
        mode: "planning",
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (chatRes.status >= 400) {
      const body = await chatRes.text().catch(() => "");
      throw new Error(`HTTP ${chatRes.status} — ${body}`);
    }

    const chunk = await readFirstChunk(chatRes);
    if (!chunk) throw new Error("Planning chat returned empty stream");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`[Step 3] Planning chat (对话框) AI probe failed: ${msg}`);
    // Continue to next steps even if this fails
  }

  // ── Step 4: Confirm project with minimal plan ────────────────────────────
  let contentId: string | null = null;
  try {
    const confirmRes = await fetch(`${baseUrl}/api/projects`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ projectId, plan: MINIMAL_PLAN }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!confirmRes.ok) {
      throw new Error(`HTTP ${confirmRes.status}`);
    }

    const confirmed = (await confirmRes.json()) as ConfirmedProject;
    contentId =
      confirmed.chapters?.[0]?.subchapters?.[0]?.contents?.find(
        (c) => c.contentType === "main"
      )?.id ?? null;

    if (!contentId) {
      throw new Error("Main content ID not found in confirmed project response");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`[Step 4] Project confirm failed: ${msg}`);
    // Continue to cleanup
  }

  // ── Step 5: Test CONTENT GENERATION (正文生成) ───────────────────────────
  if (contentId) {
    try {
      const generateRes = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({ contentId, lang: "en" }),
        signal: AbortSignal.timeout(90_000), // generation can take up to 90s
      });

      if (generateRes.status >= 400) {
        const body = await generateRes.text().catch(() => "");
        throw new Error(`HTTP ${generateRes.status} — ${body}`);
      }

      const data = (await generateRes.json()) as {
        body?: string;
        bodyEn?: string;
        error?: string;
      };
      if (data.error) throw new Error(data.error);
      if (!data.body && !data.bodyEn) {
        throw new Error("Generate returned empty body and bodyEn");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[Step 5] Content generation (正文生成) AI probe failed: ${msg}`);
    }
  }

  // ── Step 6: Test AI TUTOR (AI助手) ───────────────────────────────────────
  // Use the planning threadId with mode="tutoring" — the API only requires
  // a valid threadId belonging to the current user; the thread mode is not
  // enforced, so this exercises the tutoring AI call path correctly.
  if (planningThreadId) {
    try {
      const tutoringRes = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          threadId: planningThreadId,
          message: "What is this course about?",
          mode: "tutoring",
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (tutoringRes.status >= 400) {
        const body = await tutoringRes.text().catch(() => "");
        throw new Error(`HTTP ${tutoringRes.status} — ${body}`);
      }

      const chunk = await readFirstChunk(tutoringRes);
      if (!chunk) throw new Error("Tutoring chat returned empty stream");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[Step 6] AI tutor (AI助手) probe failed: ${msg}`);
    }
  }

  // ── Cleanup: Delete the test project ────────────────────────────────────
  if (projectId) {
    try {
      await fetch(`${baseUrl}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Cookie: cookieHeader },
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      // Non-fatal: the cleanup job will handle it after 24h
      console.warn(`  WARN  Could not delete test project ${projectId}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
