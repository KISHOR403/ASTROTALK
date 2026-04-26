import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Horoscope from "./pages/Horoscope";
import BirthChart from "./pages/BirthChart";
import Booking from "./pages/Booking";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import AstrologerDashboard from "./pages/AstrologerDashboard";
import AstrologerOnboarding from "./pages/AstrologerOnboarding";
import Availability from "./pages/astrologer/Availability";
import Bookings from "./pages/astrologer/Bookings";
import Earnings from "./pages/astrologer/Earnings";
import EditProfile from "./pages/astrologer/EditProfile";
import NotificationSettings from "./pages/astrologer/NotificationSettings";
import BookingPage from "./pages/BookingPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/horoscope" element={<Horoscope />} />
        <Route path="/birth-chart" element={<BirthChart />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Routes */}
        {/* Client Routes */}
        <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:bookingId" element={<Chat />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/book/:astrologerId" element={<BookingPage />} />
        </Route>

        {/* Astrologer Onboarding (Pending) */}
        <Route element={<ProtectedRoute allowedRoles={['astrologer']} allowedStatus={['pending']} />}>
          <Route path="/astrologer/onboarding" element={<AstrologerOnboarding />} />
        </Route>

        {/* Approved Astrologer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['astrologer', 'admin']} allowedStatus={['approved', 'active']} />}>
          <Route path="/astrologer/dashboard" element={<AstrologerDashboard />} />
          <Route path="/astrologer/availability" element={<Availability />} />
          <Route path="/astrologer/bookings" element={<Bookings />} />
          <Route path="/astrologer/earnings" element={<Earnings />} />
          <Route path="/astrologer/edit-profile" element={<EditProfile />} />
          <Route path="/astrologer/notifications" element={<NotificationSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
