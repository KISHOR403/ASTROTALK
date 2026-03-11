import { Link, useLocation } from 'react-router-dom';
import { Home, Star, MessageCircle, Users, CalendarDays } from 'lucide-react';

const tabs = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Horoscope', path: '/horoscope', icon: Star },
  { name: 'Book', path: '/booking', icon: CalendarDays },
  { name: 'Chat', path: '/chat', icon: MessageCircle },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/90 backdrop-blur-xl border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${isActive
                  ? 'text-accent'
                  : 'text-muted-foreground'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_hsl(42_80%_55%/0.6)]' : ''}`} />
              <span className="text-[10px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
