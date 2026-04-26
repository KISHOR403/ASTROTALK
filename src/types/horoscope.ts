export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly';

export interface HoroscopeEntry {
  overall: string;
  love: string;
  career: string;
  health: string;
  lucky_number: number;
  lucky_color: string;
  lucky_day: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tip: string;
  sign: string;
  dates: string;
  element: string;
}

export interface HoroscopeData {
  date: string; // YYYY-MM-DD
  period: HoroscopePeriod;
  signs: Record<string, HoroscopeEntry>; // key: sign lowercased (e.g. "aries")
}

