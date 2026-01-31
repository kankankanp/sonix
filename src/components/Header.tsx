'use client';

import { Globe2, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg flex items-center gap-1">
              Music Memory Globe
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h1>
            <p className="text-white/50 text-xs">あなただけの音楽の思い出マップ</p>
          </div>
        </div>
      </div>
    </header>
  );
}
