import { useEffect, useMemo, useState } from 'react';
import type { HoroscopeData, HoroscopePeriod } from '@/types/horoscope';

type CacheEntry =
  | { status: 'ready'; data: HoroscopeData; fetchedAt: number }
  | { status: 'error'; error: string; fetchedAt: number }
  | { status: 'loading'; fetchedAt: number };

const CACHE = new Map<HoroscopePeriod, CacheEntry>();
const ONE_HOUR_MS = 60 * 60 * 1000;

async function fetchHoroscope(period: HoroscopePeriod): Promise<HoroscopeData> {
  try {
    const res = await fetch(`/api/horoscope/${period}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = (await res.json()) as HoroscopeData;
    return json;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    throw new Error(`Failed to fetch horoscope: ${msg}`);
  }
}

export function useHoroscope(period: HoroscopePeriod) {
  const cacheKey = period;

  const cached = useMemo(() => CACHE.get(cacheKey), [cacheKey]);
  const [data, setData] = useState<HoroscopeData | null>(
    cached && cached.status === 'ready' ? cached.data : null
  );
  const [loading, setLoading] = useState<boolean>(
    !cached || cached.status === 'loading'
  );
  const [error, setError] = useState<string | null>(
    cached && cached.status === 'error' ? cached.error : null
  );

  useEffect(() => {
    let cancelled = false;

    const shouldRefetch = () => {
      const entry = CACHE.get(cacheKey);
      if (!entry) return true;
      const age = Date.now() - entry.fetchedAt;
      return age > ONE_HOUR_MS;
    };

    const run = async () => {
      const existing = CACHE.get(cacheKey);
      if (existing?.status === 'ready' && !shouldRefetch()) {
        setData(existing.data);
        setError(null);
        setLoading(false);
        return;
      }

      CACHE.set(cacheKey, { status: 'loading', fetchedAt: Date.now() });
      setLoading(true);
      setError(null);

      try {
        const fresh = await fetchHoroscope(cacheKey);
        if (cancelled) return;
        const entry: CacheEntry = { status: 'ready', data: fresh, fetchedAt: Date.now() };
        CACHE.set(cacheKey, entry);
        setData(fresh);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'Unknown error';
        CACHE.set(cacheKey, { status: 'error', error: msg, fetchedAt: Date.now() });
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  return { data, loading, error };
}

