'use client';

import { useState, useEffect, useCallback } from 'react';
import { Company } from '@/types/company';
import { mockCompanies } from '@/data/companyData';

// ===========================================
// Client-side Cache Configuration
// ===========================================
const CACHE_KEY = 'sonix_stock_data';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

interface CachedData {
  companies: Company[];
  timestamp: number;
  updatedAt: string;
}

function getClientCache(): CachedData | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    return data;
  } catch {
    return null;
  }
}

function setClientCache(companies: Company[], updatedAt: string): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CachedData = {
      companies,
      timestamp: Date.now(),
      updatedAt,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

function isClientCacheValid(cache: CachedData | null): boolean {
  if (!cache) return false;
  const now = Date.now();
  return now - cache.timestamp < CACHE_DURATION_MS;
}

function getCacheAgeMinutes(cache: CachedData | null): number {
  if (!cache) return 0;
  return Math.round((Date.now() - cache.timestamp) / 1000 / 60);
}

// ===========================================
// Hook Types
// ===========================================
interface StockDataResponse {
  success: boolean;
  data: Company[];
  updatedAt: string;
  error?: string;
  message?: string;
  cached?: boolean;
  stale?: boolean;
  cacheAge?: number;
}

interface UseStockDataOptions {
  useMockData?: boolean;
  refreshInterval?: number; // in milliseconds
}

type CacheSource = 'none' | 'client' | 'server' | 'fresh';

interface UseStockDataReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  cacheSource: CacheSource;
  cacheAge: number; // in minutes
  refetch: (forceRefresh?: boolean) => Promise<void>;
}

// ===========================================
// Hook Implementation
// ===========================================
export function useStockData(options: UseStockDataOptions = {}): UseStockDataReturn {
  const { useMockData = false, refreshInterval = 0 } = options;

  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [loading, setLoading] = useState(!useMockData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cacheSource, setCacheSource] = useState<CacheSource>('none');
  const [cacheAge, setCacheAge] = useState(0);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (useMockData) {
      setCompanies(mockCompanies);
      setLastUpdated(new Date());
      setLoading(false);
      setCacheSource('none');
      return;
    }

    // Check client cache first (unless force refresh)
    if (!forceRefresh) {
      const clientCache = getClientCache();
      if (isClientCacheValid(clientCache) && clientCache) {
        console.log('[Client Cache] Using cached data');
        setCompanies(clientCache.companies);
        setLastUpdated(new Date(clientCache.updatedAt));
        setCacheSource('client');
        setCacheAge(getCacheAgeMinutes(clientCache));
        setLoading(false);
        setError(null);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const url = forceRefresh ? '/api/stocks?refresh=true' : '/api/stocks';
      const response = await fetch(url, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data: StockDataResponse = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setCompanies(data.data);
        setLastUpdated(new Date(data.updatedAt));
        setError(null);

        // Update client cache
        setClientCache(data.data, data.updatedAt);

        // Set cache source
        if (data.cached) {
          setCacheSource('server');
          setCacheAge(data.cacheAge || 0);
        } else {
          setCacheSource('fresh');
          setCacheAge(0);
        }

        if (data.stale) {
          console.warn('Using stale server cache due to API error');
        }
      } else {
        // API returned error, try client cache or use mock data
        const clientCache = getClientCache();
        if (clientCache) {
          console.warn('API error, using client cache:', data.error || data.message);
          setCompanies(clientCache.companies);
          setLastUpdated(new Date(clientCache.updatedAt));
          setCacheSource('client');
          setCacheAge(getCacheAgeMinutes(clientCache));
        } else {
          console.warn('API error, using mock data:', data.error || data.message);
          setCompanies(mockCompanies);
          setLastUpdated(new Date());
          setCacheSource('none');
        }
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch stock data:', err);

      // Try client cache first
      const clientCache = getClientCache();
      if (clientCache) {
        setCompanies(clientCache.companies);
        setLastUpdated(new Date(clientCache.updatedAt));
        setCacheSource('client');
        setCacheAge(getCacheAgeMinutes(clientCache));
      } else {
        setCompanies(mockCompanies);
        setLastUpdated(new Date());
        setCacheSource('none');
      }

      if (err instanceof Error && err.name === 'AbortError') {
        setError('リクエストがタイムアウトしました');
      } else {
        setError(null); // Don't show error if we have fallback data
      }
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0 && !useMockData) {
      const interval = setInterval(() => fetchData(), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval, useMockData]);

  return {
    companies,
    loading,
    error,
    lastUpdated,
    cacheSource,
    cacheAge,
    refetch: fetchData,
  };
}
