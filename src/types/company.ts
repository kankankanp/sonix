export interface Company {
  id: string;
  ticker: string;           // ティッカーシンボル
  name: string;             // 企業名
  sector: Sector;           // セクター
  marketCap: number;        // 時価総額（億円）
  price: number;            // 現在株価
  change: number;           // 騰落率（%）
  volume: number;           // 出来高（相対値 0-1）
  per: number;              // PER
  logo?: string;            // ロゴURL（オプション）
}

export type Sector =
  | 'technology'      // テクノロジー
  | 'finance'         // 金融
  | 'healthcare'      // ヘルスケア
  | 'consumer'        // 消費財
  | 'industrial'      // 産業
  | 'energy'          // エネルギー
  | 'materials'       // 素材
  | 'telecom'         // 通信
  | 'utilities'       // 公益
  | 'realEstate';     // 不動産

export const SECTOR_COLORS: Record<Sector, string> = {
  technology: '#6366f1',    // インディゴ
  finance: '#22c55e',       // グリーン
  healthcare: '#ec4899',    // ピンク
  consumer: '#f59e0b',      // アンバー
  industrial: '#64748b',    // スレート
  energy: '#ef4444',        // レッド
  materials: '#8b5cf6',     // バイオレット
  telecom: '#06b6d4',       // シアン
  utilities: '#84cc16',     // ライム
  realEstate: '#f97316',    // オレンジ
};

export const SECTOR_NAMES: Record<Sector, string> = {
  technology: 'テクノロジー',
  finance: '金融',
  healthcare: 'ヘルスケア',
  consumer: '消費財',
  industrial: '産業',
  energy: 'エネルギー',
  materials: '素材',
  telecom: '通信',
  utilities: '公益',
  realEstate: '不動産',
};

// セクターごとの3D空間での位置（クラスター中心）
export const SECTOR_POSITIONS: Record<Sector, [number, number, number]> = {
  technology: [0, 2, 0],
  finance: [3, 0, 1],
  healthcare: [-3, 1, 0],
  consumer: [1, -2, 2],
  industrial: [-2, -1, -2],
  energy: [2, 1, -3],
  materials: [-1, 3, -1],
  telecom: [3, -2, -1],
  utilities: [-3, -2, 1],
  realEstate: [0, 0, 3],
};
