/**
 * How the MCP tools reach Shelter's Agent API.
 *
 * The stdio server uses `createEnvClient()`, which reads one user's API key from the
 * environment. A hosted server passes its own client per request, so one process can
 * serve many users without a key in its environment.
 */
export interface ShelterApiClient {
  get<T = unknown>(path: string, params?: Record<string, string>): Promise<T>;
  post<T = unknown>(path: string, body: unknown): Promise<T>;
}

const DEFAULT_API_URL = 'https://api.shelter.money/agent';

export function createEnvClient(env: NodeJS.ProcessEnv = process.env): ShelterApiClient {
  const apiKey = env.SHELTER_API_KEY ?? '';
  const baseUrl = (env.SHELTER_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');
  const headers = { 'X-Shelter-Key': apiKey, 'Content-Type': 'application/json' };

  return {
    async get<T>(path: string, params?: Record<string, string>): Promise<T> {
      if (!apiKey) return suppressedResponse(path) as T;

      const url = new URL(`${baseUrl}${path}`);
      for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Shelter API ${res.status}: ${body || res.statusText}`);
      }
      return res.json() as Promise<T>;
    },

    async post<T>(path: string, body: unknown): Promise<T> {
      if (!apiKey) return suppressedResponse(path) as T;

      const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Shelter API ${res.status}: ${text || res.statusText}`);
      }
      return res.json() as Promise<T>;
    },
  };
}

// ---------------------------------------------------------------------------
// Unauthenticated mode — financial values fail closed. Sample values must
// never be mistaken for a real user's authoritative financial state.
// ---------------------------------------------------------------------------
function suppressedResponse(path: string): unknown {
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
