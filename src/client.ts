const API_KEY = process.env.SHELTER_API_KEY ?? '';
const BASE_URL = (process.env.SHELTER_API_URL ?? 'https://api.shelter.money/agent').replace(
  /\/$/,
  ''
);

export function isDemo(): boolean {
  return !API_KEY;
}

function headers(): Record<string, string> {
  return {
    'X-Shelter-Key': API_KEY,
    'Content-Type': 'application/json',
  };
}

export async function apiGet<T = unknown>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  if (isDemo()) return demoResponse(path) as T;

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), { headers: headers() });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Shelter API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  if (isDemo()) return demoResponse(path) as T;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Shelter API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Unauthenticated mode — financial values fail closed. Sample values must
// never be mistaken for a real user's authoritative financial state.
// ---------------------------------------------------------------------------
function demoResponse(path: string): unknown {
  return {
    authority: {
      status: 'suppressed',
      reasonCodes: ['MISSING_SHELTER_API_KEY'],
      currency: null,
      asOf: '1970-01-01T00:00:00.000Z',
      manifestId: 'unavailable',
      formulaVersion: 'unavailable',
    },
    data: null,
    message: `Financial data for ${path} is unavailable until a Shelter API key is configured.`,
    _demo: true,
  };
}
