import type { PageServerLoad } from './$types';

// API base for codes by game
const API_BASE = 'https://hoyo-codes.seria.moe/codes';

const VALID_GAMES = new Set(['genshin', 'hkrpg', 'nap']);

// Simple in-memory cache with TTL and SWR behavior
// Note: module-level state persists for the lifetime of the server process
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const SOFT_TTL_MS = 60 * 1000; // send browser cache headers for 60s

type CacheEntry = { timestamp: number; codes: unknown[]; error: string | null };
const cache = new Map<string, CacheEntry>();
let refreshing = new Set<string>();

async function fetchCodes(fetchFn: typeof fetch, game: string): Promise<CacheEntry> {
  const apiUrl = `${API_BASE}?game=${encodeURIComponent(game)}`;
  const res = await fetchFn(apiUrl, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    return { timestamp: Date.now(), codes: [], error: `Failed to fetch codes (status ${res.status})` };
  }
  const data = await res.json();
  const codesRaw = Array.isArray(data)
    ? data
    : Array.isArray(data?.codes)
      ? data.codes
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
          ? data.items
          : [];
  return { timestamp: Date.now(), codes: codesRaw, error: null };
}

export const load: PageServerLoad = async ({ url, fetch, setHeaders }) => {
  const gameParam = url.searchParams.get('game')?.toLowerCase() ?? 'hkrpg';
  const game = VALID_GAMES.has(gameParam) ? gameParam : 'hkrpg';

  const now = Date.now();
  const cached = cache.get(game);

  // Fresh cache: return immediately
  if (cached && now - cached.timestamp < TTL_MS) {
    // Browser cache hint (short)
    setHeaders({ 'cache-control': `public, max-age=${Math.floor(SOFT_TTL_MS / 1000)}, stale-while-revalidate=300` });
    return { game, codes: cached.codes, error: cached.error };
  }

  // Stale-while-revalidate: if we have stale data, serve it and refresh in background
  if (cached && !refreshing.has(game)) {
    refreshing.add(game);
    // Fire-and-forget background refresh
    fetchCodes(fetch, game)
      .then((entry) => cache.set(game, entry))
      .catch(() => {})
      .finally(() => refreshing.delete(game));
    setHeaders({ 'cache-control': `public, max-age=${Math.floor(SOFT_TTL_MS / 1000)}, stale-while-revalidate=300` });
    return { game, codes: cached.codes, error: cached.error };
  }

  // No cache or already refreshing; do a blocking fetch
  try {
    const entry = await fetchCodes(fetch, game);
    cache.set(game, entry);
    setHeaders({ 'cache-control': `public, max-age=${Math.floor(SOFT_TTL_MS / 1000)}, stale-while-revalidate=300` });
    return { game, codes: entry.codes, error: entry.error };
  } catch (err) {
    // On error, fall back to cached data if exists
    if (cached) {
      setHeaders({ 'cache-control': `public, max-age=${Math.floor(SOFT_TTL_MS / 1000)}, stale-while-revalidate=300` });
      return { game, codes: cached.codes, error: cached.error ?? (err instanceof Error ? err.message : 'Unknown error') };
    }
    return {
      game,
      error: err instanceof Error ? err.message : 'Unknown error',
      codes: [] as unknown[]
    };
  }
};
