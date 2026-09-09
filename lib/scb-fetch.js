function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseBody(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function isScbTable(data) {
  return Array.isArray(data?.data);
}

export async function fetchScbTable(url, query, { retries = 3 } = {}) {
  let lastStatus = 502;
  let lastBody = { error: "SCB-anropet misslyckades" };

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          response: { format: "json" },
        }),
      });

      const text = await response.text();
      const data = parseBody(text);
      lastStatus = response.status;
      lastBody = data ?? { error: "SCB returnerade ett ogiltigt svar" };

      const retryable = response.status === 429 || response.status >= 500 || !data;
      if (response.ok && isScbTable(data)) {
        return { status: response.status, data };
      }
      if (retryable && attempt < retries - 1) {
        await sleep(400 * 2 ** attempt);
        continue;
      }
      return { status: response.status || 502, data: lastBody };
    } catch (error) {
      lastStatus = 502;
      lastBody = { error: error.message || "SCB-anropet misslyckades" };
      if (attempt < retries - 1) {
        await sleep(400 * 2 ** attempt);
      }
    }
  }

  return { status: lastStatus, data: lastBody };
}
