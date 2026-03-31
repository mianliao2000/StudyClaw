export async function runPageSmoke(baseUrl: string): Promise<void> {
  const pages = [
    { path: "/", name: "Homepage" },
    { path: "/login", name: "Login page" },
    { path: "/about", name: "About page" },
    { path: "/examples/ai-agent-development", name: "Example course page" },
  ];

  const errors: string[] = [];

  for (const { path, name } of pages) {
    const url = `${baseUrl}${path}`;
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(15_000),
        redirect: "follow",
      });

      if (res.status >= 500) {
        errors.push(`${name} (${url}): HTTP ${res.status}`);
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) {
        errors.push(
          `${name} (${url}): unexpected Content-Type "${contentType}"`
        );
        continue;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${name} (${url}): fetch error — ${msg}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
