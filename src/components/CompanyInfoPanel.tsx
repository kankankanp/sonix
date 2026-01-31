'use client';

import { Company, SECTOR_NAMES, SECTOR_COLORS } from '@/types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompanyInfoPanelProps {
  company: Company | null;
}

export function CompanyInfoPanel({ company }: CompanyInfoPanelProps) {
  if (!company) {
    return (
      <Card className="w-80 bg-white/90 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">
            企業を選択してください
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = company.change >= 0;

  return (
    <Card className="w-80 bg-white/90 backdrop-blur-sm border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900">{company.name}</CardTitle>
            <p className="text-gray-500 text-sm">{company.ticker}</p>
          </div>
          <Badge
            style={{ backgroundColor: SECTOR_COLORS[company.sector] }}
            className="text-white"
          >
            {SECTOR_NAMES[company.sector]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price and Change */}
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-gray-900">
            ¥{company.price.toLocaleString()}
          </span>
          <span className={`text-lg font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{company.change.toFixed(2)}%
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">時価総額</p>
            <p className="text-lg font-semibold text-gray-900">
              {(company.marketCap / 10000).toFixed(1)}兆円
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">PER</p>
            <p className="text-lg font-semibold text-gray-900">
              {company.per > 0 ? company.per.toFixed(1) : '-'}倍
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">出来高</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${company.volume * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {(company.volume * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">セクター</p>
            <p className="text-lg font-semibold text-gray-900">
              {SECTOR_NAMES[company.sector]}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
