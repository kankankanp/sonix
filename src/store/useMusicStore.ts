import { create } from 'zustand';
import { MusicMemory } from '@/types';
import { mockMusicMemories } from '@/data/mockData';

interface MusicStore {
  memories: MusicMemory[];
  selectedMemory: MusicMemory | null;
  timeRange: [Date, Date];
  currentTime: Date;
  isPlaying: boolean;

  // Actions
  setSelectedMemory: (memory: MusicMemory | null) => void;
  setCurrentTime: (time: Date) => void;
  setIsPlaying: (playing: boolean) => void;
  getFilteredMemories: () => MusicMemory[];
}

// Calculate time range from mock data
const dates = mockMusicMemories.map(m => m.listenedAt.getTime());
const minDate = new Date(Math.min(...dates));
const maxDate = new Date(Math.max(...dates));

export const useMusicStore = create<MusicStore>((set, get) => ({
  memories: mockMusicMemories,
  selectedMemory: null,
  timeRange: [minDate, maxDate],
  currentTime: maxDate,
  isPlaying: false,

  setSelectedMemory: (memory) => set({ selectedMemory: memory }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  getFilteredMemories: () => {
    const { memories, currentTime } = get();
    return memories.filter(m => m.listenedAt <= currentTime);
  },
}));
