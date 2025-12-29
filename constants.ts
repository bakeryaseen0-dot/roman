
import { PlayerId, Territory, Player } from './types';

// Added missing 'level' property to each player definition to match Player interface requirements
export const INITIAL_PLAYERS: Record<PlayerId, Player> = {
  [PlayerId.USER]: {
    id: PlayerId.USER,
    name: 'المحارب الشجاع',
    color: '#dc2626', // Red
    score: 0,
    avatar: 'https://picsum.photos/seed/warrior/100/100',
    level: 1
  },
  [PlayerId.BOT_1]: {
    id: PlayerId.BOT_1,
    name: 'القائد خالد',
    color: '#2563eb', // Blue
    score: 0,
    avatar: 'https://picsum.photos/seed/commander/100/100',
    level: 1
  },
  [PlayerId.BOT_2]: {
    id: PlayerId.BOT_2,
    name: 'الداهية عثمان',
    color: '#16a34a', // Green
    score: 0,
    avatar: 'https://picsum.photos/seed/sage/100/100',
    level: 1
  }
};

// Simplified World Map Territories
export const WORLD_TERRITORIES: Territory[] = [
  { id: 'na', name: 'أمريكا الشمالية', ownerId: null, points: 500, path: 'M50,30 L150,30 L140,120 L40,110 Z' },
  { id: 'sa', name: 'أمريكا الجنوبية', ownerId: null, points: 300, path: 'M110,130 L160,130 L150,220 L100,210 Z' },
  { id: 'eu', name: 'أوروبا', ownerId: null, points: 400, path: 'M180,40 L260,40 L250,90 L170,90 Z' },
  { id: 'af', name: 'أفريقيا', ownerId: null, points: 350, path: 'M180,110 L260,110 L250,230 L170,200 Z' },
  { id: 'me', name: 'الشرق الأوسط', ownerId: null, points: 600, path: 'M270,90 L330,90 L340,140 L265,140 Z' },
  { id: 'as', name: 'آسيا', ownerId: null, points: 700, path: 'M340,30 L480,30 L470,160 L350,160 Z' },
  { id: 'au', name: 'أستراليا', ownerId: null, points: 250, path: 'M380,180 L460,180 L450,240 L370,230 Z' },
];

export const CATEGORIES = [
  'تاريخ',
  'جغرافيا',
  'علوم',
  'إسلاميات',
  'رياضة',
  'ثقافة عامة',
  'أدب'
];
