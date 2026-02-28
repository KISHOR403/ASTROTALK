import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StarfieldBackground from './StarfieldBackground';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <StarfieldBackground />
      <Navbar />
      <main className="flex-1 pt-20 pb-20 lg:pb-0">
        {children}
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
