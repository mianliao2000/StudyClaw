export async function runApiAuthSmoke(baseUrl: string): Promise<void> {
  const errors: string[] = [];

  // Test 1: POST /api/auth/guest should return { success: true } and set a session cookie
  try {
    const res = await fetch(`${baseUrl}/api/auth/guest`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status !== 200) {
      errors.push(`POST /api/auth/guest: expected 200, got ${res.status}`);
    } else {
      const body = (await res.json().catch(() => null)) as Record<
        string,
        unknown
      > | null;
      if (!body?.success) {
        errors.push(
          `POST /api/auth/guest: expected { success: true }, got ${JSON.stringify(body)}`
        );
      }

      // Verify session cookie is set (both secure and non-secure variants)
      const setCookie = res.headers.get("set-cookie") ?? "";
      if (!setCookie.includes("authjs.session-token")) {
        errors.push(
          `POST /api/auth/guest: session cookie not found in Set-Cookie header`
        );
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`POST /api/auth/guest: fetch error — ${msg}`);
  }

  // Test 2: POST /api/auth/guest/restore without a cookie should not crash (200 or 401, not 500)
  try {
    const res = await fetch(`${baseUrl}/api/auth/guest/restore`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status >= 500) {
      errors.push(
        `POST /api/auth/guest/restore: expected non-5xx, got ${res.status}`
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`POST /api/auth/guest/restore: fetch error — ${msg}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
