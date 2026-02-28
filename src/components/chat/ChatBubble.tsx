import { motion } from 'framer-motion';
import { Moon, Star } from 'lucide-react';
import { ChatMessage } from '@/lib/chat-data';
import { format } from 'date-fns';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const isAstrologer = message.sender === 'astrologer';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-1">
          {isBot ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Moon className="w-4 h-4 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-cosmic flex items-center justify-center text-sm">
              {message.avatar || '🧙'}
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[75%] space-y-1`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 px-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              {message.senderName}
            </span>
            {isBot && <Star className="w-3 h-3 text-accent" />}
          </div>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : isAstrologer
              ? 'bg-accent/20 border border-accent/30 text-foreground rounded-bl-sm'
              : 'bg-muted/80 border border-primary/20 text-foreground rounded-bl-sm'
          }`}
        >
          {/* Render bold markdown simply */}
          {message.text.split('**').map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className={isAstrologer ? 'text-accent' : isBot ? 'text-primary' : ''}>
                {part}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
        <span className={`text-[10px] text-muted-foreground px-1 ${isUser ? 'text-right block' : ''}`}>
          {format(message.timestamp, 'h:mm a')}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
