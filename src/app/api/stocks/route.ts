import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { TechSubcategory } from '@/types/company';

const yahooFinance = new YahooFinance();

// Japanese stock tickers (Tokyo Stock Exchange)
const DEFAULT_TICKERS = [
  // Technology - SaaS/Cloud
  '4478.T',  // freee
  '4443.T',  // Sansan
  '3994.T',  // Money Forward
  '4776.T',  // Cybozu
  '4475.T',  // HENNGE
  '4482.T',  // WealthPark (ウィルズ)
  '4431.T',  // スマレジ
  '4449.T',  // ギフティ

  // Technology - Gaming
  '7974.T',  // Nintendo
  '6758.T',  // Sony (gaming)
  '9766.T',  // Konami
  '9684.T',  // Square Enix
  '9697.T',  // Capcom
  '7832.T',  // Bandai Namco
  '3635.T',  // コーエーテクモ
  '2432.T',  // DeNA
  '3765.T',  // ガンホー
  '3668.T',  // コロプラ

  // Technology - E-commerce/Internet
  '4755.T',  // Rakuten
  '4689.T',  // Z Holdings (Yahoo Japan)
  '4385.T',  // Mercari
  '3092.T',  // ZOZO
  '2371.T',  // カカクコム
  '4751.T',  // CyberAgent
  '3938.T',  // LINE (if available)
  '2413.T',  // エムスリー

  // Technology - Semiconductor
  '8035.T',  // Tokyo Electron
  '6723.T',  // Renesas
  '6857.T',  // Advantest
  '7735.T',  // SCREEN
  '6146.T',  // ディスコ
  '6963.T',  // ローム
  '6981.T',  // 村田製作所
  '6762.T',  // TDK

  // Technology - IT Services
  '9613.T',  // NTT Data
  '6701.T',  // NEC
  '6702.T',  // Fujitsu
  '9719.T',  // SCSK
  '4307.T',  // 野村総合研究所
  '2327.T',  // 日鉄ソリューションズ
  '4768.T',  // 大塚商会

  // Technology - Software
  '4684.T',  // オービック
  '9749.T',  // 富士ソフト
  '3626.T',  // TIS
  '4726.T',  // ソフトバンク・テクノロジー

  // Technology - Hardware
  '6861.T',  // Keyence
  '6594.T',  // 日本電産
  '6954.T',  // ファナック
  '7752.T',  // リコー
  '6503.T',  // 三菱電機

  // Technology - Misc (SoftBank Group)
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

// Sector and subcategory mapping for Japanese stocks
interface TickerInfo {
  sector: string;
  techSubcategory?: TechSubcategory;
}

const TICKER_INFO_MAP: Record<string, TickerInfo> = {
  // SaaS/Cloud
  '4478.T': { sector: 'technology', techSubcategory: 'saas' },
  '4443.T': { sector: 'technology', techSubcategory: 'saas' },
  '3994.T': { sector: 'technology', techSubcategory: 'saas' },
  '4776.T': { sector: 'technology', techSubcategory: 'saas' },
  '4475.T': { sector: 'technology', techSubcategory: 'saas' },
  '4482.T': { sector: 'technology', techSubcategory: 'saas' },
  '4431.T': { sector: 'technology', techSubcategory: 'saas' },
  '4449.T': { sector: 'technology', techSubcategory: 'saas' },

  // Gaming
  '7974.T': { sector: 'technology', techSubcategory: 'gaming' },
  '6758.T': { sector: 'technology', techSubcategory: 'gaming' },
  '9766.T': { sector: 'technology', techSubcategory: 'gaming' },
  '9684.T': { sector: 'technology', techSubcategory: 'gaming' },
  '9697.T': { sector: 'technology', techSubcategory: 'gaming' },
  '7832.T': { sector: 'technology', techSubcategory: 'gaming' },
  '3635.T': { sector: 'technology', techSubcategory: 'gaming' },
  '2432.T': { sector: 'technology', techSubcategory: 'gaming' },
  '3765.T': { sector: 'technology', techSubcategory: 'gaming' },
  '3668.T': { sector: 'technology', techSubcategory: 'gaming' },

  // E-commerce/Internet
  '4755.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '4689.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '4385.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '3092.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '2371.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '4751.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '3938.T': { sector: 'technology', techSubcategory: 'ecommerce' },
  '2413.T': { sector: 'technology', techSubcategory: 'ecommerce' },

  // Semiconductor
  '8035.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '6723.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '6857.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '7735.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '6146.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '6963.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '6981.T': { sector: 'technology', techSubcategory: 'semiconductor' },
  '6762.T': { sector: 'technology', techSubcategory: 'semiconductor' },

  // IT Services
  '9613.T': { sector: 'technology', techSubcategory: 'itServices' },
  '6701.T': { sector: 'technology', techSubcategory: 'itServices' },
  '6702.T': { sector: 'technology', techSubcategory: 'itServices' },
  '9719.T': { sector: 'technology', techSubcategory: 'itServices' },
  '4307.T': { sector: 'technology', techSubcategory: 'itServices' },
  '2327.T': { sector: 'technology', techSubcategory: 'itServices' },
  '4768.T': { sector: 'technology', techSubcategory: 'itServices' },

  // Software
  '4684.T': { sector: 'technology', techSubcategory: 'software' },
  '9749.T': { sector: 'technology', techSubcategory: 'software' },
  '3626.T': { sector: 'technology', techSubcategory: 'software' },
  '4726.T': { sector: 'technology', techSubcategory: 'software' },

  // Hardware
  '6861.T': { sector: 'technology', techSubcategory: 'hardware' },
  '6594.T': { sector: 'technology', techSubcategory: 'hardware' },
  '6954.T': { sector: 'technology', techSubcategory: 'hardware' },
  '7752.T': { sector: 'technology', techSubcategory: 'hardware' },
  '6503.T': { sector: 'technology', techSubcategory: 'hardware' },

  // SoftBank Group - Investment/Conglomerate
  '9984.T': { sector: 'technology', techSubcategory: 'itServices' },

  // Finance
  '8306.T': { sector: 'finance' },
  '8316.T': { sector: 'finance' },
  '8411.T': { sector: 'finance' },
  '8766.T': { sector: 'finance' },

  // Healthcare
  '4502.T': { sector: 'healthcare' },
  '4503.T': { sector: 'healthcare' },
  '4568.T': { sector: 'healthcare' },

  // Consumer
  '9983.T': { sector: 'consumer' },
  '4901.T': { sector: 'consumer' },
  '2802.T': { sector: 'consumer' },

  // Industrial
  '7203.T': { sector: 'industrial' },
  '6902.T': { sector: 'industrial' },
  '6501.T': { sector: 'industrial' },
  '7267.T': { sector: 'industrial' },

  // Energy
  '5020.T': { sector: 'energy' },
  '9501.T': { sector: 'energy' },

  // Telecom
  '9432.T': { sector: 'telecom' },
  '9433.T': { sector: 'telecom' },
  '9434.T': { sector: 'telecom' },

  // Real Estate
  '8801.T': { sector: 'realEstate' },
  '8802.T': { sector: 'realEstate' },

  // Materials
  '4063.T': { sector: 'materials' },
  '5401.T': { sector: 'materials' },

  // Utilities
  '9502.T': { sector: 'utilities' },
  '9503.T': { sector: 'utilities' },
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

    const companies = quotesArray
      .filter(quote => quote && quote.symbol) // Filter out null/undefined quotes
      .map((quote) => {
        const ticker = quote.symbol!;
        const tickerInfo = TICKER_INFO_MAP[ticker] || { sector: 'technology' };

        // Calculate volume as a normalized value (0-1)
        const volumeRatio = quote.regularMarketVolume && quote.averageDailyVolume3Month
          ? Math.min(quote.regularMarketVolume / quote.averageDailyVolume3Month, 2) / 2
          : 0.5;

        return {
          id: ticker,
          ticker: ticker.replace('.T', ''),
          name: quote.shortName || quote.longName || ticker,
          sector: tickerInfo.sector,
          techSubcategory: tickerInfo.techSubcategory,
          marketCap: quote.marketCap ? Math.round(quote.marketCap / 100000000) : 0,
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
