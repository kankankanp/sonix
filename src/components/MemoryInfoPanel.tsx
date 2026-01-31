'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMusicStore } from '@/store/useMusicStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import { X, MapPin, Calendar, Music } from 'lucide-react';

// Dynamic import for MusicDNA to avoid SSR issues
const MusicDNA = dynamic(() => import('./MusicDNA'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] flex items-center justify-center">
      <div className="text-white/40">Loading...</div>
    </div>
  ),
});

export default function MemoryInfoPanel() {
  const { selectedMemory, setSelectedMemory } = useMusicStore();

  return (
    <AnimatePresence>
      {selectedMemory && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-4 right-4 w-80 z-20"
        >
          <Card className="bg-black/60 backdrop-blur-xl border-white/10 text-white overflow-hidden">
            <CardHeader className="pb-2 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setSelectedMemory(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <CardTitle className="text-lg pr-8">{selectedMemory.trackName}</CardTitle>
              <p className="text-white/60 text-sm">{selectedMemory.artistName}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Album Art Placeholder */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <MusicDNA memory={selectedMemory} size="large" />
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    Music DNA
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{selectedMemory.locationName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span>
                    {format(selectedMemory.listenedAt, 'yyyy年M月d日', { locale: ja })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span>人気度: {selectedMemory.popularity}%</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-xs text-white/40 uppercase tracking-wider">音楽特徴</p>
                <div className="grid grid-cols-2 gap-2">
                  <FeatureBar label="エネルギー" value={selectedMemory.features.energy} color="bg-red-500" />
                  <FeatureBar label="ダンス" value={selectedMemory.features.danceability} color="bg-green-500" />
                  <FeatureBar label="ハッピー" value={selectedMemory.features.valence} color="bg-yellow-500" />
                  <FeatureBar label="アコースティック" value={selectedMemory.features.acousticness} color="bg-blue-500" />
                </div>
                <div className="text-center text-sm text-white/60 mt-2">
                  テンポ: {Math.round(selectedMemory.features.tempo)} BPM
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FeatureBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
