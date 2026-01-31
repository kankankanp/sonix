// SaaS業界カオスマップ用の型定義

export type SaaSCategory =
  | 'crm'           // CRM・営業支援
  | 'marketing'     // マーケティング
  | 'hrTech'        // HR Tech・人事
  | 'fintech'       // Fintech・会計
  | 'communication' // コミュニケーション
  | 'productivity'  // 生産性・プロジェクト管理
  | 'security'      // セキュリティ
  | 'infrastructure'// インフラ・開発
  | 'analytics'     // アナリティクス・BI
  | 'vertical'      // 業界特化型

export interface SaaSCompany {
  id: string;
  name: string;
  category: SaaSCategory;
  subcategory: string;       // より詳細なカテゴリ
  description: string;       // 簡単な説明
  valuation?: number;        // 評価額（億円）
  revenue?: number;          // 売上（億円）
  employees?: number;        // 従業員数
  founded?: number;          // 設立年
  isPublic: boolean;         // 上場しているか
  ticker?: string;           // 上場している場合のティッカー
  logo?: string;             // ロゴURL
  website?: string;          // ウェブサイト
  growth?: number;           // 成長率（%）
}

export const SAAS_CATEGORY_COLORS: Record<SaaSCategory, string> = {
  crm: '#3b82f6',           // Blue
  marketing: '#ec4899',      // Pink
  hrTech: '#8b5cf6',         // Purple
  fintech: '#22c55e',        // Green
  communication: '#06b6d4',  // Cyan
  productivity: '#f59e0b',   // Amber
  security: '#ef4444',       // Red
  infrastructure: '#64748b', // Slate
  analytics: '#6366f1',      // Indigo
  vertical: '#f97316',       // Orange
};

export const SAAS_CATEGORY_NAMES: Record<SaaSCategory, string> = {
  crm: 'CRM・営業支援',
  marketing: 'マーケティング',
  hrTech: 'HR Tech',
  fintech: 'Fintech・会計',
  communication: 'コミュニケーション',
  productivity: '生産性・PM',
  security: 'セキュリティ',
  infrastructure: 'インフラ・開発',
  analytics: 'アナリティクス',
  vertical: '業界特化',
};

// カテゴリごとの3D空間での位置
export const SAAS_CATEGORY_POSITIONS: Record<SaaSCategory, [number, number, number]> = {
  crm: [-4, 0, -2],
  marketing: [-2, 0, -4],
  hrTech: [0, 0, -4],
  fintech: [2, 0, -4],
  communication: [4, 0, -2],
  productivity: [4, 0, 2],
  security: [2, 0, 4],
  infrastructure: [0, 0, 4],
  analytics: [-2, 0, 4],
  vertical: [-4, 0, 2],
};
