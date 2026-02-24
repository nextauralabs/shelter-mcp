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
// Demo mode — returns illustrative sample data when no API key is configured
// ---------------------------------------------------------------------------
function demoResponse(path: string): unknown {
  if (path.startsWith('/v1/status'))
    return {
      safeToSpend: 1247.83,
      checking: 3421.56,
      savings: 12500.0,
      creditCardDebt: 1847.23,
      upcomingBills: 2174.73,
      runway: '18 days',
      healthScore: 72,
      _demo: true,
    };

  if (path.startsWith('/v1/runway'))
    return {
      days: 18,
      safeToSpend: 1247.83,
      dailyBudget: 69.32,
      nextPayday: '2026-03-06',
      _demo: true,
    };

  if (path.startsWith('/v1/forecast'))
    return {
      periods: [
        { date: '2026-02-24', projected: 3200, label: 'Today' },
        { date: '2026-03-01', projected: 2100, label: 'Rent due' },
        { date: '2026-03-06', projected: 4600, label: 'Payday' },
      ],
      _demo: true,
    };

  if (path.startsWith('/v1/alerts'))
    return {
      alerts: [
        { type: 'unusual_spending', message: 'Dining spend is 40% above your monthly average', severity: 'warning' },
        { type: 'upcoming_bill', message: 'Rent ($1,850) due in 5 days', severity: 'info' },
      ],
      _demo: true,
    };

  if (path.startsWith('/v1/opportunities'))
    return {
      opportunities: [
        { category: 'subscriptions', amount: 34.97, description: 'Three unused subscriptions detected' },
        { category: 'negotiation', amount: 25.0, description: 'Your internet bill is above market rate' },
      ],
      _demo: true,
    };

  if (path.startsWith('/v1/context'))
    return {
      summary: 'Demo user with moderate financial health. Stable income, manageable debt, some savings opportunities.',
      _demo: true,
    };

  if (path.startsWith('/v1/affordability'))
    return {
      canAfford: true,
      impact: 'moderate',
      safeToSpendAfter: 747.83,
      recommendation: 'You can afford this, but it would use 40% of your remaining safe-to-spend balance.',
      _demo: true,
    };

  if (path.startsWith('/v1/coach/daily'))
    return {
      tip: "You've spent $23 on coffee this week. Consider brewing at home 2 days a week to save ~$40/month.",
      category: 'spending',
      _demo: true,
    };

  if (path.startsWith('/v1/coach/advice'))
    return {
      advice: 'Focus on paying off your highest-interest credit card first. You could save $180/year in interest.',
      topic: 'debt',
      _demo: true,
    };

  if (path.startsWith('/v1/ask'))
    return {
      answer: 'Based on your financial data, here is a demo response. Connect your bank account for personalized insights.',
      _demo: true,
    };

  return { message: 'Unknown endpoint', _demo: true };
}
