export type MessageSender = 'user' | 'astrologer' | 'bot';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  senderName: string;
  text: string;
  timestamp: Date;
  avatar?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'consultation' | 'horoscope-bot';
  lastMessage?: string;
  lastMessageTime?: Date;
  unread: number;
  online: boolean;
  avatar: string;
}

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'bot-daily',
    name: 'Cosmic Bot ✨',
    type: 'horoscope-bot',
    lastMessage: 'Your daily horoscope is ready!',
    lastMessageTime: new Date(),
    unread: 2,
    online: true,
    avatar: '🌙',
  },
  {
    id: 'consult-1',
    name: 'Pandit Rajesh',
    type: 'consultation',
    lastMessage: 'Let me check your Rahu-Ketu axis...',
    lastMessageTime: new Date(Date.now() - 3600000),
    unread: 0,
    online: true,
    avatar: '🧙',
  },
  {
    id: 'consult-2',
    name: 'Dr. Meera Sharma',
    type: 'consultation',
    lastMessage: 'Your Saturn transit looks promising.',
    lastMessageTime: new Date(Date.now() - 86400000),
    unread: 1,
    online: false,
    avatar: '👩‍🔬',
  },
  {
    id: 'consult-3',
    name: 'Acharya Vikram',
    type: 'consultation',
    lastMessage: 'Start a conversation...',
    lastMessageTime: new Date(Date.now() - 172800000),
    unread: 0,
    online: true,
    avatar: '🕉️',
  },
  {
    id: 'consult-4',
    name: 'Jyotishi Priya Nair',
    type: 'consultation',
    lastMessage: 'Start a conversation...',
    lastMessageTime: new Date(Date.now() - 259200000),
    unread: 0,
    online: true,
    avatar: '🔮',
  },
  {
    id: 'consult-5',
    name: 'Guru Dev Mishra',
    type: 'consultation',
    lastMessage: 'Start a conversation...',
    lastMessageTime: new Date(Date.now() - 345600000),
    unread: 0,
    online: false,
    avatar: '✋',
  },
  {
    id: 'consult-6',
    name: 'Dr. Ananya Iyer',
    type: 'consultation',
    lastMessage: 'Start a conversation...',
    lastMessageTime: new Date(Date.now() - 432000000),
    unread: 0,
    online: true,
    avatar: '⚕️',
  },
];

const botMessages = [
  "🌟 **Daily Horoscope — Pisces** 🌟\nToday the Moon transits your 5th house, bringing creative energy. A great day for artistic pursuits and self-expression. Avoid financial risks in the evening.",
  "🪐 **Birth Chart Insight**\nYour Jupiter in the 9th house indicates strong spiritual inclinations and luck in higher education. This placement blesses you with wisdom and philosophical depth.",
  "💫 **Compatibility Update**\nBased on your Moon signs, your Guna Milan score is 28/36 — an excellent match! Emotional harmony is strong, though communication styles may differ.",
  "🔮 **Weekly Forecast**\nVenus enters your 7th house this week. Expect improved relationships and possible romantic developments. Thursday and Friday are particularly auspicious.",
  "⭐ **Nakshatra Alert**\nMoon enters Rohini Nakshatra today — a favorable time for new beginnings, creative projects, and financial decisions. Make the most of this energy!",
];

export const getRandomBotMessage = (): string => {
  return botMessages[Math.floor(Math.random() * botMessages.length)];
};

export const mockInitialMessages: Record<string, ChatMessage[]> = {
  'bot-daily': [
    {
      id: '1',
      sender: 'bot',
      senderName: 'Cosmic Bot',
      text: "🌙 Welcome to your personal astrology assistant! I'll send you daily horoscopes, birth chart insights, and compatibility updates.",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '2',
      sender: 'bot',
      senderName: 'Cosmic Bot',
      text: botMessages[0],
      timestamp: new Date(Date.now() - 3600000),
    },
  ],
  'consult-1': [
    {
      id: '1',
      sender: 'astrologer',
      senderName: 'Pandit Rajesh',
      text: "Namaste! I've reviewed your birth chart. Your Mahadasha period is quite interesting.",
      timestamp: new Date(Date.now() - 7200000),
      avatar: '🧙',
    },
    {
      id: '2',
      sender: 'user',
      senderName: 'You',
      text: "Thank you, Panditji. Can you tell me about my career prospects?",
      timestamp: new Date(Date.now() - 6800000),
    },
    {
      id: '3',
      sender: 'astrologer',
      senderName: 'Pandit Rajesh',
      text: "Your 10th house lord is strong. Let me check your Rahu-Ketu axis — it indicates a shift in career direction around mid-2026.",
      timestamp: new Date(Date.now() - 3600000),
      avatar: '🧙',
    },
  ],
  'consult-2': [
    {
      id: '1',
      sender: 'astrologer',
      senderName: 'Dr. Meera Sharma',
      text: "Hello! I've been analyzing your Saturn transit. It looks promising for professional growth.",
      timestamp: new Date(Date.now() - 86400000),
      avatar: '👩‍🔬',
    },
  ],
};

export const EMOJI_LIST = ['😊', '🙏', '✨', '🌟', '💫', '🔮', '🌙', '⭐', '💜', '🪐', '☀️', '🌈', '❤️', '👍', '🙌', '🎯'];
