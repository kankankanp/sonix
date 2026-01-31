import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Japanese stock tickers (Tokyo Stock Exchange)
const DEFAULT_TICKERS = [
  // Technology
  '7974.T',  // Nintendo
  '6758.T',  // Sony
  '6861.T',  // Keyence
  '4755.T',  // Rakuten
  '9984.T',  // SoftBank Group
  // Finance
  '8306.T',  // MUFG
  '8316.T',  // SMFG
  '8411.T',  // Mizuho
  '8766.T',  // Tokio Marine
  // Healthcare
  '4502.T',  // Takeda
  '4503.T',  // Astellas
  '4568.T',  // Daiichi Sankyo
  // Consumer
  '9983.T',  // Fast Retailing
  '4901.T',  // Fujifilm
  '2802.T',  // Ajinomoto
  // Industrial
  '7203.T',  // Toyota
  '6902.T',  // Denso
  '6501.T',  // Hitachi
  '7267.T',  // Honda
  // Energy
  '5020.T',  // ENEOS
  '9501.T',  // TEPCO
  // Telecom
  '9432.T',  // NTT
  '9433.T',  // KDDI
  '9434.T',  // SoftBank Corp
  // Real Estate
  '8801.T',  // Mitsui Fudosan
  '8802.T',  // Mitsubishi Estate
  // Materials
  '4063.T',  // Shin-Etsu Chemical
  '5401.T',  // Nippon Steel
  // Utilities
  '9502.T',  // Chubu Electric
  '9503.T',  // Kansai Electric
];

// Sector mapping for Japanese stocks
const TICKER_SECTOR_MAP: Record<string, string> = {
  '7974.T': 'technology',
  '6758.T': 'technology',
  '6861.T': 'technology',
  '4755.T': 'technology',
  '9984.T': 'technology',
  '8306.T': 'finance',
  '8316.T': 'finance',
  '8411.T': 'finance',
  '8766.T': 'finance',
  '4502.T': 'healthcare',
  '4503.T': 'healthcare',
  '4568.T': 'healthcare',
  '9983.T': 'consumer',
  '4901.T': 'consumer',
  '2802.T': 'consumer',
  '7203.T': 'industrial',
  '6902.T': 'industrial',
  '6501.T': 'industrial',
  '7267.T': 'industrial',
  '5020.T': 'energy',
  '9501.T': 'energy',
  '9432.T': 'telecom',
  '9433.T': 'telecom',
  '9434.T': 'telecom',
  '8801.T': 'realEstate',
  '8802.T': 'realEstate',
  '4063.T': 'materials',
  '5401.T': 'materials',
  '9502.T': 'utilities',
  '9503.T': 'utilities',
};

interface QuoteResult {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  marketCap?: number;
  trailingPE?: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tickersParam = searchParams.get('tickers');
  const tickers = tickersParam ? tickersParam.split(',') : DEFAULT_TICKERS;

  try {
    const quotes = await yahooFinance.quote(tickers) as QuoteResult | QuoteResult[];

    const quotesArray: QuoteResult[] = Array.isArray(quotes) ? quotes : [quotes];

    const companies = quotesArray.map((quote, index) => {
      const ticker = quote.symbol || tickers[index];
      const sector = TICKER_SECTOR_MAP[ticker] || 'technology';

      // Calculate volume as a normalized value (0-1)
      // Using averageVolume as baseline if available
      const volumeRatio = quote.regularMarketVolume && quote.averageDailyVolume3Month
        ? Math.min(quote.regularMarketVolume / quote.averageDailyVolume3Month, 2) / 2
        : 0.5;

      return {
        id: ticker,
        ticker: ticker.replace('.T', ''),
        name: quote.shortName || quote.longName || ticker,
        sector,
        marketCap: quote.marketCap ? Math.round(quote.marketCap / 100000000) : 0, // Convert to 億円
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChangePercent || 0,
        volume: volumeRatio,
        per: quote.trailingPE || 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: companies,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stock data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
