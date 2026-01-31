'use client';

import { SaaSCompany, SAAS_CATEGORY_NAMES, SAAS_CATEGORY_COLORS } from '@/types/saas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SaaSInfoPanelProps {
  company: SaaSCompany | null;
}

export function SaaSInfoPanel({ company }: SaaSInfoPanelProps) {
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

  return (
    <Card className="w-80 bg-white/90 backdrop-blur-sm border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900">{company.name}</CardTitle>
            <p className="text-gray-500 text-sm">{company.subcategory}</p>
          </div>
          <Badge
            style={{ backgroundColor: SAAS_CATEGORY_COLORS[company.category] }}
            className="text-white"
          >
            {SAAS_CATEGORY_NAMES[company.category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600">{company.description}</p>

        {/* Valuation and Growth */}
        <div className="flex items-end gap-3">
          {company.valuation && (
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {(company.valuation / 100).toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm ml-1">億円</span>
            </div>
          )}
          {company.growth && (
            <span className={`text-lg font-medium ${company.growth > 20 ? 'text-green-600' : 'text-gray-600'}`}>
              +{company.growth}% 成長
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          {company.revenue && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">売上</p>
              <p className="text-lg font-semibold text-gray-900">
                {(company.revenue / 100).toLocaleString()}億円
              </p>
            </div>
          )}
          {company.employees && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">従業員</p>
              <p className="text-lg font-semibold text-gray-900">
                {company.employees.toLocaleString()}人
              </p>
            </div>
          )}
          {company.founded && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">設立</p>
              <p className="text-lg font-semibold text-gray-900">
                {company.founded}年
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">上場</p>
            <p className="text-lg font-semibold text-gray-900">
              {company.isPublic ? (
                <span className="text-blue-600">{company.ticker || 'Yes'}</span>
              ) : (
                <span className="text-gray-400">非上場</span>
              )}
            </p>
          </div>
        </div>

        {/* Website link */}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-blue-600 hover:underline"
          >
            ウェブサイトを見る →
          </a>
        )}
      </CardContent>
    </Card>
  );
}
