'use client';

import { useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { useMusicStore } from '@/store/useMusicStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function TimelineSlider() {
  const { timeRange, currentTime, setCurrentTime, memories } = useMusicStore();

  const [minDate, maxDate] = timeRange;

  // Convert dates to numeric values for slider
  const minValue = minDate.getTime();
  const maxValue = maxDate.getTime();
  const currentValue = currentTime.getTime();

  // Count memories up to current time
  const visibleCount = useMemo(() => {
    return memories.filter(m => m.listenedAt <= currentTime).length;
  }, [memories, currentTime]);

  const handleSliderChange = (value: number[]) => {
    setCurrentTime(new Date(value[0]));
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-sm">タイムライン</span>
        <span className="text-white text-sm font-medium">
          {visibleCount} / {memories.length} 曲
        </span>
      </div>

      <Slider
        value={[currentValue]}
        min={minValue}
        max={maxValue}
        step={86400000} // 1 day in ms
        onValueChange={handleSliderChange}
        className="mb-3"
      />

      <div className="flex justify-between text-xs text-white/40">
        <span>{format(minDate, 'yyyy年M月', { locale: ja })}</span>
        <span className="text-white/80 font-medium">
          {format(currentTime, 'yyyy年M月d日', { locale: ja })}
        </span>
        <span>{format(maxDate, 'yyyy年M月', { locale: ja })}</span>
      </div>
    </div>
  );
}
