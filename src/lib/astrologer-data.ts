export interface Astrologer {
  id: string;
  chatRoomId: string;
  name: string;
  title: string;
  avatar: string;
  specializations: string[];
  experience: number;
  rating: number;
  totalConsultations: number;
  pricePerMinute: number;
  bio: string;
  languages: string[];
  online: boolean;
  nextAvailable?: string;
}

export const astrologers: Astrologer[] = [
  {
    id: 'ast-1',
    chatRoomId: 'consult-1',
    name: 'Pandit Rajesh',
    title: 'Vedic Astrology Master',
    avatar: '🧙',
    specializations: ['Birth Chart', 'Mahadasha', 'Career', 'Rahu-Ketu'],
    experience: 22,
    rating: 4.9,
    totalConsultations: 3420,
    pricePerMinute: 25,
    bio: 'A 3rd-generation Vedic astrologer specializing in Mahadasha analysis and planetary remedies. Expert in career and financial guidance through Jyotish.',
    languages: ['Hindi', 'English', 'Sanskrit'],
    online: true,
  },
  {
    id: 'ast-2',
    chatRoomId: 'consult-2',
    name: 'Dr. Meera Sharma',
    title: 'Nadi & KP Astrologer',
    avatar: '👩‍🔬',
    specializations: ['Nadi Astrology', 'KP System', 'Relationships', 'Health'],
    experience: 15,
    rating: 4.8,
    totalConsultations: 2150,
    pricePerMinute: 30,
    bio: 'PhD in Astro-sciences with deep expertise in Nadi and KP astrology systems. Renowned for accurate predictions on health and relationships.',
    languages: ['English', 'Tamil', 'Hindi'],
    online: false,
    nextAvailable: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'ast-3',
    chatRoomId: 'consult-3',
    name: 'Acharya Vikram',
    title: 'Remedial Astrologer',
    avatar: '🕉️',
    specializations: ['Gemstones', 'Mantras', 'Vastu', 'Spiritual Healing'],
    experience: 30,
    rating: 4.95,
    totalConsultations: 5800,
    pricePerMinute: 40,
    bio: 'Renowned for prescribing powerful Vedic remedies including gemstones, yantras, and mantras. Three decades of transforming lives through ancient wisdom.',
    languages: ['Hindi', 'English', 'Gujarati'],
    online: true,
  },
  {
    id: 'ast-4',
    chatRoomId: 'consult-4',
    name: 'Jyotishi Priya Nair',
    title: 'Compatibility Specialist',
    avatar: '🔮',
    specializations: ['Kundali Matching', 'Compatibility', 'Marriage', 'Love'],
    experience: 12,
    rating: 4.7,
    totalConsultations: 1890,
    pricePerMinute: 20,
    bio: 'Specialist in Kundali Milan and relationship astrology. Helping couples navigate love and marriage through the stars for over a decade.',
    languages: ['English', 'Malayalam', 'Hindi'],
    online: true,
  },
  {
    id: 'ast-5',
    chatRoomId: 'consult-5',
    name: 'Guru Dev Mishra',
    title: 'Palmistry & Astrology',
    avatar: '✋',
    specializations: ['Palmistry', 'Numerology', 'Face Reading', 'Birth Chart'],
    experience: 18,
    rating: 4.6,
    totalConsultations: 2700,
    pricePerMinute: 22,
    bio: 'Combining Vedic astrology with palmistry and numerology for holistic readings. Known for remarkably precise timeline predictions.',
    languages: ['Hindi', 'English'],
    online: false,
    nextAvailable: 'Today, 6:00 PM',
  },
  {
    id: 'ast-6',
    chatRoomId: 'consult-6',
    name: 'Dr. Ananya Iyer',
    title: 'Medical Astrologer',
    avatar: '⚕️',
    specializations: ['Medical Astrology', 'Health', 'Ayurveda', 'Wellness'],
    experience: 20,
    rating: 4.85,
    totalConsultations: 3100,
    pricePerMinute: 35,
    bio: 'BAMS-qualified Ayurvedic doctor turned medical astrologer. Unique blend of Jyotish and Ayurveda for holistic health guidance.',
    languages: ['English', 'Kannada', 'Hindi'],
    online: true,
  },
];
