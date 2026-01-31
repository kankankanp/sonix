'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusicStore } from '@/store/useMusicStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MapPin } from 'lucide-react';
import { getColorFromFeatures } from '@/data/mockData';

export default function MemoryList() {
  const { memories, currentTime, selectedMemory, setSelectedMemory } = useMusicStore();

  // Filter and sort memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter(m => m.listenedAt <= currentTime)
      .sort((a, b) => b.listenedAt.getTime() - a.listenedAt.getTime());
  }, [memories, currentTime]);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-white/80 text-sm font-medium">音楽の思い出</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-2 space-y-1">
          {filteredMemories.map((memory, index) => (
            <motion.button
              key={memory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedMemory(memory)}
              className={`w-full p-2 rounded-lg text-left transition-colors ${
                selectedMemory?.id === memory.id
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Color indicator */}
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${getColorFromFeatures(memory.features)}, ${getColorFromFeatures(memory.features)}88)`,
                  }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {memory.trackName}
                  </p>
                  <p className="text-white/50 text-xs truncate">
                    {memory.artistName}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-white/40 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{memory.locationName}</span>
                  </div>
                </div>

                <div className="text-white/40 text-xs text-right flex-shrink-0">
                  {format(memory.listenedAt, 'M/d', { locale: ja })}
                </div>
              </div>
            </motion.button>
          ))}

          {filteredMemories.length === 0 && (
            <div className="text-center text-white/40 py-8 text-sm">
              この期間に聴いた曲はありません
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
