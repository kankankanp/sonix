'use client';

import { useState, useEffect, useCallback } from 'react';
import { Company } from '@/types/company';
import { mockCompanies } from '@/data/companyData';

interface StockDataResponse {
  success: boolean;
  data: Company[];
  updatedAt: string;
  error?: string;
  message?: string;
}

interface UseStockDataOptions {
  useMockData?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useStockData(options: UseStockDataOptions = {}) {
  const { useMockData = false, refreshInterval = 0 } = options;

  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [loading, setLoading] = useState(!useMockData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (useMockData) {
      setCompanies(mockCompanies);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/stocks', {
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
      } else {
        // API returned error, use mock data as fallback
        console.warn('API returned error, using mock data:', data.error || data.message);
        setCompanies(mockCompanies);
        setLastUpdated(new Date());
        setError(null); // Don't show error to user, just use mock data
      }
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      // Fall back to mock data on error
      setCompanies(mockCompanies);
      setLastUpdated(new Date());

      if (err instanceof Error && err.name === 'AbortError') {
        setError('リクエストがタイムアウトしました。モックデータを表示中。');
      } else {
        setError(null); // Don't show error, just use mock data silently
      }
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0 && !useMockData) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval, useMockData]);

  return {
    companies,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
  };
}
