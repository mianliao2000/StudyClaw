/**
 * Authenticated page smoke tests.
 *
 * Creates a real guest session and verifies that pages requiring auth
 * return valid HTML (not a 500 or crash). A project is created to test
 * the planning page (/projects/[id]/plan); it is auto-deleted after 24h
 * by the existing cleanup job.
 */

export async function runAuthPagesSmoke(baseUrl: string): Promise<void> {
  const errors: string[] = [];

  // ── Step 1: Guest login ──────────────────────────────────────────────────
  let cookieHeader = "";
  try {
    const guestRes = await fetch(`${baseUrl}/api/auth/guest`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
    });
    if (!guestRes.ok) throw new Error(`HTTP ${guestRes.status}`);

    const setCookie = guestRes.headers.get("set-cookie") ?? "";
    const cookieMatch = setCookie.match(
      /(__Secure-authjs\.session-token|authjs\.session-token)=([^;]+)/
    );
    if (!cookieMatch) throw new Error("Session cookie not found");
    cookieHeader = `${cookieMatch[1]}=${cookieMatch[2]}`;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Guest login (prerequisite): ${msg}`);
    throw new Error(errors.join("\n")); // can't continue without auth
  }

  async function checkPage(name: string, path: string) {
    const url = `${baseUrl}${path}`;
    try {
      const res = await fetch(url, {
        headers: { Cookie: cookieHeader },
        signal: AbortSignal.timeout(15_000),
        redirect: "follow",
      });

      if (res.status >= 500) {
        errors.push(`${name} (${path}): HTTP ${res.status}`);
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) {
        errors.push(`${name} (${path}): unexpected Content-Type "${contentType}"`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${name} (${path}): fetch error — ${msg}`);
    }
  }

  // ── Step 2: Check /dashboard ─────────────────────────────────────────────
  // Server-rendered; with a valid cookie it returns HTML directly.
  await checkPage("Dashboard", "/dashboard");

  // ── Step 3: Create a project → check /projects/[id]/plan ────────────────
  // /projects/new is a client-side launcher that immediately redirects to
  // /projects/[id]/plan, so the meaningful server check is the plan page.
  try {
    const projectRes = await fetch(`${baseUrl}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        title: "[smoke-test] Planning page check",
        topic: "smoke",
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!projectRes.ok) {
      throw new Error(`Create project HTTP ${projectRes.status}`);
    }

    const project = (await projectRes.json()) as { id: string };
    if (!project?.id) throw new Error("Project id missing from response");

    await checkPage("Planning page", `/projects/${project.id}/plan`);
    // Note: no cleanup here — project has status=planning + no chapters,
    // so the existing 24h cleanup job handles it automatically.
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Planning page (/projects/[id]/plan): ${msg}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
