import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Calendar,
  Car,
  Compass,
  FileText,
  Globe,
  Headphones,
  KeyRound,
  LogIn,
  LogOut,
  Menu,
  PhoneCall,
  ShieldCheck,
  User,
  Wrench,
  X,
} from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenMfa?: () => void;
  onOpenNotifications?: () => void;
  onOpenPolicies?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenMfa,
  onOpenNotifications,
  onOpenPolicies,
  onOpenProfile,
}) => {
  const {
    language,
    setLanguage,
    currentView,
    setCurrentView,
    user,
    isAdmin,
    setIsAdmin,
    logout,
    unreadNotificationsCount,
    adminContact,
    setIsMfaPromptOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedView = activeTab || currentView;
  const handleSelectView = (v: string) => {
    if (setActiveTab) {
      setActiveTab(v);
    } else {
      setCurrentView(v as any);
    }
    setMobileMenuOpen(false);
  };

  const t = {
    brand: language === 'hi' ? 'लोकल राइड' : 'LocalRide',
    tagline:
      language === 'hi'
        ? 'हसनपुरा • सीवान • छपरा • पटना'
        : 'Hasanpura • Siwan • Chapra • Patna',
    bookTab: language === 'hi' ? 'वाहन बुकिंग' : 'Book Vehicle',
    calendarTab: language === 'hi' ? 'फ्लीट कैलेंडर' : 'Fleet Calendar',
    myBookingsTab: language === 'hi' ? 'मेरी बुकिंग' : 'My Rides',
    adminTab: language === 'hi' ? 'एडमिन पोर्टल' : 'Admin Hub',
    supportTab: language === 'hi' ? '24/7 सहायता' : 'Support',
    policies: language === 'hi' ? 'नीतियां' : 'Policies',
  };

  const navItems = [
    { id: 'book', label: t.bookTab, icon: Car },
    { id: 'calendar', label: t.calendarTab, icon: Calendar },
    { id: 'bookings', label: t.myBookingsTab, icon: Compass },
    { id: 'admin', label: t.adminTab, icon: Wrench, badge: 'Fleet Ops' },
    { id: 'support', label: t.supportTab, icon: Headphones },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top emergency announcement bar */}
      <div className="bg-slate-900 text-slate-100 text-xs sm:text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {language === 'hi' ? 'रीयल-टाइम फ्लीट सेवा सक्रिय' : 'Live Fleet Fleet Active'}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              {language === 'hi'
                ? 'हसनपुरा व सीवान क्षेत्र में सबसे विश्वसनीय लोकल यात्रा नेटवर्क'
                : 'Most Reliable Local & Outstation Taxi & Commercial Fleet'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <a
              href={`tel:${adminContact.primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
              title="Call Fleet Admin"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Admin: {adminContact.primaryPhone}</span>
            </a>

            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'हिंदी में देखें' : 'Switch to English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectView('book')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:bg-blue-700 transition-all">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  {t.brand}
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                    Fleet
                  </span>
                </span>
                <span className="text-xs sm:text-sm block text-slate-500 font-semibold">
                  {t.tagline}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelectView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white text-blue-900' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              id="header-notification-btn"
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none cursor-pointer"
              title="Notifications & Upcoming Trip Reminders"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User profile / MFA button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  id="user-profile-btn"
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    else handleSelectView('profile');
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-sm font-bold text-slate-800 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-extrabold text-slate-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {user.mfaEnabled ? 'MFA Active' : 'Profile'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-mfa-btn"
                onClick={() => {
                  if (onOpenMfa) onOpenMfa();
                  else setIsMfaPromptOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold shadow-sm transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === 'hi' ? 'लॉगिन / MFA' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-white text-blue-900' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                handleSelectView('profile');
              }}
              className="text-sm font-bold text-slate-700 hover:text-blue-600 flex items-center gap-2 p-2"
            >
              <User className="w-4 h-4" />
              <span>User Profile & Security</span>
            </button>

            {onOpenPolicies && (
              <button
                onClick={() => {
                  onOpenPolicies();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-blue-600 p-2"
              >
                Policies & Terms
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
