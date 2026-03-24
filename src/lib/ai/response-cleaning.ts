export function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export function createThinkTagStreamSanitizer() {
  let buffer = "";
  let insideThink = false;

  const push = (chunk: string): string => {
    buffer += chunk;
    let output = "";

    while (buffer.length > 0) {
      if (insideThink) {
        const closeIndex = buffer.search(/<\/think>/i);
        if (closeIndex === -1) {
          return output;
        }
        buffer = buffer.slice(closeIndex).replace(/^<\/think>/i, "");
        insideThink = false;
        continue;
      }

      const openIndex = buffer.search(/<think>/i);
      if (openIndex === -1) {
        const safeLength = Math.max(0, buffer.length - 7);
        output += buffer.slice(0, safeLength);
        buffer = buffer.slice(safeLength);
        return output;
      }

      output += buffer.slice(0, openIndex);
      buffer = buffer.slice(openIndex).replace(/^<think>/i, "");
      insideThink = true;
    }

    return output;
  };

  const flush = (): string => {
    if (insideThink) {
      buffer = "";
      return "";
    }

    const output = buffer;
    buffer = "";
    return output;
  };

  return { push, flush };
}
