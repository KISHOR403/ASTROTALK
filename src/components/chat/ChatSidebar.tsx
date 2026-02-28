import { motion } from 'framer-motion';
import { MessageCircle, Moon, Star } from 'lucide-react';
import { ChatRoom } from '@/lib/chat-data';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelectRoom: (id: string) => void;
}

const ChatSidebar = ({ rooms, activeRoomId, onSelectRoom }: ChatSidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Messages
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {rooms.map((room) => (
          <motion.button
            key={room.id}
            whileHover={{ x: 4 }}
            onClick={() => onSelectRoom(room.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
              activeRoomId === room.id
                ? 'bg-primary/20 border border-primary/30'
                : 'hover:bg-muted/50'
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-cosmic flex items-center justify-center text-xl">
                {room.avatar}
              </div>
              {room.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate flex items-center gap-1">
                  {room.type === 'horoscope-bot' && <Moon className="w-3 h-3 text-accent" />}
                  {room.name}
                </span>
                {room.lastMessageTime && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatDistanceToNow(room.lastMessageTime, { addSuffix: false })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">{room.lastMessage}</p>
                {room.unread > 0 && (
                  <span className="shrink-0 ml-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                    {room.unread}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
