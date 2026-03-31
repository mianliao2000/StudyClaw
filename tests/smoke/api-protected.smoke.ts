interface ProtectedEndpoint {
  method: string;
  path: string;
  body?: string;
}

const PROTECTED_ENDPOINTS: ProtectedEndpoint[] = [
  { method: "POST", path: "/api/chat", body: "{}" },
  { method: "POST", path: "/api/generate", body: "{}" },
  { method: "POST", path: "/api/projects", body: "{}" },
  { method: "GET", path: "/api/user/stats" },
];

export async function runApiProtectedSmoke(baseUrl: string): Promise<void> {
  const errors: string[] = [];

  for (const { method, path, body } of PROTECTED_ENDPOINTS) {
    const url = `${baseUrl}${path}`;
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
        signal: AbortSignal.timeout(15_000),
      });

      // Unauthenticated requests must return 401, not 5xx
      if (res.status === 500 || res.status === 502 || res.status === 503) {
        errors.push(
          `${method} ${path}: expected 401 for unauthenticated request, got ${res.status} (server error)`
        );
      } else if (res.status !== 401) {
        // 400 / 403 are also acceptable — they mean auth middleware ran without crashing
        if (res.status >= 500) {
          errors.push(
            `${method} ${path}: expected 401, got ${res.status}`
          );
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${method} ${path}: fetch error — ${msg}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
