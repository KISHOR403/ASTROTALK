import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import StarfieldBackground from '@/components/StarfieldBackground';
import MobileBottomNav from '@/components/MobileBottomNav';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { Moon, Star, Menu, X, Wifi, WifiOff } from 'lucide-react';
import socket from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';
import {
  ChatMessage,
  ChatRoom,
  mockChatRooms,
} from '@/lib/chat-data';

const ChatPage = () => {
  const { user } = useAuth();
  const { bookingId } = useParams();

  const [rooms] = useState<ChatRoom[]>(mockChatRooms);
  const [activeRoomId, setActiveRoomId] = useState(bookingId || 'bot-daily');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Socket and History fetch
  useEffect(() => {
    if (!activeRoomId) return;

    const isBot = activeRoomId.startsWith('bot-');

    // 1. Fetch History if valid booking ID
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${activeRoomId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        // Transform backend message to frontend ChatMessage format
        if (Array.isArray(data)) {
            const transformed = data.map((m: any) => ({
              id: m._id,
              sender: m.sender._id === user?._id ? 'user' : 'astrologer',
              senderName: m.sender.name,
              text: m.text,
              timestamp: new Date(m.createdAt),
            }));
            setMessages(transformed);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (!isBot && activeRoomId.length > 10) { // simple ObjectId check
        fetchHistory();
    } else {
        setMessages([{
            id: 'welcome-msg',
            sender: 'astrologer',
            senderName: activeRoom?.name || 'Bot',
            text: 'Hello! I am here to guide you through the stars.',
            timestamp: new Date(),
            avatar: activeRoom?.avatar
        }]);
    }

    // 2. Join Room
    socket.emit('join_room', activeRoomId);

    // 3. Listen for Messages
    const rawHandler = (data: any) => {
      const msg: ChatMessage = {
        id: data._id || Date.now().toString(),
        sender: data.sender === user?._id ? 'user' : 'astrologer',
        senderName: data.sender === user?._id ? 'You' : (activeRoom?.name || 'Astrologer'),
        text: data.text,
        timestamp: new Date(data.createdAt || Date.now()),
        avatar: data.sender === user?._id ? undefined : activeRoom?.avatar
      };
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', rawHandler);

    return () => {
      socket.off('receive_message', rawHandler);
    };
  }, [activeRoomId, user?._id, activeRoom]);

  const handleSend = (text: string) => {
    if (!activeRoomId) return;

    const data = {
      roomId: activeRoomId,
      sender: user?._id,
      text
    };

    socket.emit('send_message', data);
  };

  const handleTyping = () => {
    // Could emit typing event
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StarfieldBackground />
      <Navbar />
      <section className="flex-1 flex flex-col pt-20 pb-20 lg:pb-0 overflow-hidden">
        <div className="flex-1 flex overflow-hidden container mx-auto px-0 md:px-4 pb-4">
          {/* Mobile sidebar toggle omitted for brevity as it's repetitive */}

          <div className="hidden md:block md:w-80 shrink-0 glass-card md:rounded-l-xl md:rounded-r-none border-r border-border">
            <ChatSidebar
              rooms={rooms}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
            />
          </div>

          <div className="flex-1 flex flex-col glass-card md:rounded-l-none md:rounded-r-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-cosmic flex items-center justify-center text-lg">
                  {activeRoom.avatar}
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold">{activeRoom.name}</h3>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-success" /> Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} onTyping={handleTyping} />
          </div>
        </div>
      </section>
      <MobileBottomNav />
    </div>
  );
};

export default ChatPage;
