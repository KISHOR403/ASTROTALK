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
    name: 'AstroBot — Cosmic Guide',
    type: 'horoscope-bot',
    lastMessage: 'Your daily horoscope is ready!',
    lastMessageTime: new Date(),
    unread: 2,
    online: true,
    avatar: '🌙',
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
      senderName: 'AstroBot',
      text: "Namaste! 🙏 I'm your AstroBot — ask me about your zodiac sign, horoscope, compatibility, planetary positions, or anything cosmic!",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '2',
      sender: 'bot',
      senderName: 'AstroBot',
      text: botMessages[0],
      timestamp: new Date(Date.now() - 3600000),
    },
  ],
};

export const EMOJI_LIST = ['😊', '🙏', '✨', '🌟', '💫', '🔮', '🌙', '⭐', '💜', '🪐', '☀️', '🌈', '❤️', '👍', '🙌', '🎯'];
