import { SaaSCompany, SaaSCategory, SAAS_CATEGORY_POSITIONS } from '@/types/saas';

export const mockSaaSCompanies: SaaSCompany[] = [
  // CRM・営業支援
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    subcategory: 'CRM',
    description: '世界最大のCRMプラットフォーム',
    valuation: 300000,
    revenue: 50000,
    employees: 73000,
    founded: 1999,
    isPublic: true,
    ticker: 'CRM',
    growth: 11,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    subcategory: 'CRM・MA',
    description: 'インバウンドマーケティング＆CRM',
    valuation: 35000,
    revenue: 3000,
    employees: 7400,
    founded: 2006,
    isPublic: true,
    ticker: 'HUBS',
    growth: 21,
  },
  {
    id: 'sansan',
    name: 'Sansan',
    category: 'crm',
    subcategory: '名刺管理',
    description: '名刺管理サービス',
    valuation: 2000,
    revenue: 300,
    employees: 1500,
    founded: 2007,
    isPublic: true,
    ticker: '4443.T',
    growth: 15,
  },

  // マーケティング
  {
    id: 'adobe',
    name: 'Adobe',
    category: 'marketing',
    subcategory: 'クリエイティブ',
    description: 'Creative Cloud & Experience Cloud',
    valuation: 250000,
    revenue: 28000,
    employees: 29000,
    founded: 1982,
    isPublic: true,
    ticker: 'ADBE',
    growth: 10,
  },
  {
    id: 'plaid',
    name: 'プレイド',
    category: 'marketing',
    subcategory: 'CX',
    description: 'KARTE - 顧客体験プラットフォーム',
    valuation: 800,
    revenue: 100,
    employees: 400,
    founded: 2011,
    isPublic: true,
    ticker: '4165.T',
    growth: 25,
  },

  // HR Tech
  {
    id: 'workday',
    name: 'Workday',
    category: 'hrTech',
    subcategory: 'HCM',
    description: '人事・財務クラウド',
    valuation: 70000,
    revenue: 10000,
    employees: 18000,
    founded: 2005,
    isPublic: true,
    ticker: 'WDAY',
    growth: 17,
  },
  {
    id: 'smarthr',
    name: 'SmartHR',
    category: 'hrTech',
    subcategory: '労務管理',
    description: 'クラウド人事労務ソフト',
    valuation: 1700,
    revenue: 150,
    employees: 1000,
    founded: 2013,
    isPublic: false,
    growth: 40,
  },
  {
    id: 'freee-hr',
    name: 'freee人事労務',
    category: 'hrTech',
    subcategory: '労務管理',
    description: '人事労務管理ソフト',
    valuation: 3000,
    revenue: 250,
    employees: 1200,
    founded: 2012,
    isPublic: true,
    ticker: '4478.T',
    growth: 30,
  },

  // Fintech・会計
  {
    id: 'freee',
    name: 'freee',
    category: 'fintech',
    subcategory: '会計',
    description: 'クラウド会計ソフト',
    valuation: 3000,
    revenue: 250,
    employees: 1200,
    founded: 2012,
    isPublic: true,
    ticker: '4478.T',
    growth: 30,
  },
  {
    id: 'moneyforward',
    name: 'マネーフォワード',
    category: 'fintech',
    subcategory: '会計・家計簿',
    description: 'お金の見える化サービス',
    valuation: 2500,
    revenue: 300,
    employees: 2000,
    founded: 2012,
    isPublic: true,
    ticker: '3994.T',
    growth: 35,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'fintech',
    subcategory: '決済',
    description: 'オンライン決済プラットフォーム',
    valuation: 50000,
    revenue: 20000,
    employees: 8000,
    founded: 2010,
    isPublic: false,
    growth: 25,
  },

  // コミュニケーション
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    subcategory: 'チャット',
    description: 'ビジネスコミュニケーション',
    valuation: 27000,
    revenue: 2000,
    employees: 2500,
    founded: 2009,
    isPublic: false, // Salesforce acquired
    growth: 15,
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'communication',
    subcategory: 'ビデオ会議',
    description: 'ビデオコミュニケーション',
    valuation: 20000,
    revenue: 6500,
    employees: 8400,
    founded: 2011,
    isPublic: true,
    ticker: 'ZM',
    growth: 3,
  },
  {
    id: 'chatwork',
    name: 'Chatwork',
    category: 'communication',
    subcategory: 'チャット',
    description: 'ビジネスチャット',
    valuation: 300,
    revenue: 80,
    employees: 500,
    founded: 2004,
    isPublic: true,
    ticker: '4448.T',
    growth: 20,
  },

  // 生産性・プロジェクト管理
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    subcategory: 'ドキュメント',
    description: 'オールインワンワークスペース',
    valuation: 10000,
    revenue: 500,
    employees: 500,
    founded: 2013,
    isPublic: false,
    growth: 50,
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'productivity',
    subcategory: 'プロジェクト管理',
    description: 'ワークマネジメント',
    valuation: 5000,
    revenue: 900,
    employees: 2000,
    founded: 2008,
    isPublic: true,
    ticker: 'ASAN',
    growth: 12,
  },
  {
    id: 'backlog',
    name: 'Backlog',
    category: 'productivity',
    subcategory: 'プロジェクト管理',
    description: 'プロジェクト管理ツール',
    valuation: 500,
    revenue: 50,
    employees: 300,
    founded: 2004,
    isPublic: true,
    ticker: '4397.T',
    growth: 15,
  },

  // セキュリティ
  {
    id: 'crowdstrike',
    name: 'CrowdStrike',
    category: 'security',
    subcategory: 'エンドポイント',
    description: 'クラウドネイティブセキュリティ',
    valuation: 75000,
    revenue: 4500,
    employees: 8000,
    founded: 2011,
    isPublic: true,
    ticker: 'CRWD',
    growth: 33,
  },
  {
    id: 'okta',
    name: 'Okta',
    category: 'security',
    subcategory: 'ID管理',
    description: 'アイデンティティ管理',
    valuation: 15000,
    revenue: 2500,
    employees: 6000,
    founded: 2009,
    isPublic: true,
    ticker: 'OKTA',
    growth: 20,
  },
  {
    id: 'hennnge',
    name: 'HENNGE',
    category: 'security',
    subcategory: 'ID管理',
    description: 'クラウドセキュリティ',
    valuation: 400,
    revenue: 100,
    employees: 400,
    founded: 1996,
    isPublic: true,
    ticker: '4475.T',
    growth: 18,
  },

  // インフラ・開発
  {
    id: 'aws',
    name: 'AWS',
    category: 'infrastructure',
    subcategory: 'クラウド',
    description: 'Amazon Web Services',
    valuation: 500000,
    revenue: 130000,
    employees: 100000,
    founded: 2006,
    isPublic: true,
    ticker: 'AMZN',
    growth: 12,
  },
  {
    id: 'datadog',
    name: 'Datadog',
    category: 'infrastructure',
    subcategory: '監視',
    description: 'クラウド監視プラットフォーム',
    valuation: 40000,
    revenue: 3000,
    employees: 5000,
    founded: 2010,
    isPublic: true,
    ticker: 'DDOG',
    growth: 25,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'infrastructure',
    subcategory: '開発',
    description: 'ソースコード管理',
    valuation: 7500,
    revenue: 1500,
    employees: 3000,
    founded: 2008,
    isPublic: false, // Microsoft acquired
    growth: 30,
  },

  // アナリティクス
  {
    id: 'snowflake',
    name: 'Snowflake',
    category: 'analytics',
    subcategory: 'データウェアハウス',
    description: 'クラウドデータプラットフォーム',
    valuation: 50000,
    revenue: 4000,
    employees: 7000,
    founded: 2012,
    isPublic: true,
    ticker: 'SNOW',
    growth: 30,
  },
  {
    id: 'tableau',
    name: 'Tableau',
    category: 'analytics',
    subcategory: 'BI',
    description: 'データビジュアライゼーション',
    valuation: 15000,
    revenue: 2500,
    employees: 5000,
    founded: 2003,
    isPublic: false, // Salesforce acquired
    growth: 10,
  },

  // 業界特化
  {
    id: 'veeva',
    name: 'Veeva',
    category: 'vertical',
    subcategory: 'ライフサイエンス',
    description: '製薬業界向けクラウド',
    valuation: 35000,
    revenue: 3000,
    employees: 6000,
    founded: 2007,
    isPublic: true,
    ticker: 'VEEV',
    growth: 15,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'vertical',
    subcategory: 'EC',
    description: 'ECプラットフォーム',
    valuation: 90000,
    revenue: 10000,
    employees: 10000,
    founded: 2006,
    isPublic: true,
    ticker: 'SHOP',
    growth: 20,
  },
  {
    id: 'base',
    name: 'BASE',
    category: 'vertical',
    subcategory: 'EC',
    description: 'ネットショップ作成',
    valuation: 500,
    revenue: 150,
    employees: 400,
    founded: 2012,
    isPublic: true,
    ticker: '4477.T',
    growth: 15,
  },
];

// 評価額からサイズを計算
export const getValuationSize = (valuation: number | undefined): number => {
  if (!valuation) return 0.5;
  const maxVal = Math.max(...mockSaaSCompanies.map(c => c.valuation || 0));
  const minSize = 0.3;
  const maxSize = 2.5;
  const normalized = Math.sqrt(valuation / maxVal);
  return minSize + normalized * (maxSize - minSize);
};

// 成長率から色を計算
export const getGrowthColor = (growth: number | undefined): string => {
  if (!growth) return '#9ca3af';
  if (growth > 40) return '#22c55e';
  if (growth > 25) return '#86efac';
  if (growth > 15) return '#bbf7d0';
  if (growth > 5) return '#fef08a';
  if (growth > 0) return '#fca5a5';
  return '#ef4444';
};

// カテゴリ内での位置を計算
export function getSaaSCompanyPosition(
  company: SaaSCompany,
  allCompanies: SaaSCompany[]
): [number, number, number] {
  const basePosition = SAAS_CATEGORY_POSITIONS[company.category];
  const categoryCompanies = allCompanies.filter(c => c.category === company.category);
  const index = categoryCompanies.findIndex(c => c.id === company.id);

  const angle = index * 1.2;
  const radius = 0.8 + index * 0.3;
  const height = getValuationSize(company.valuation) * 0.5;

  return [
    basePosition[0] + Math.cos(angle) * radius,
    height,
    basePosition[2] + Math.sin(angle) * radius,
  ];
}
