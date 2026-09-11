import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Headphones,
  Lock,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
  Zap,
} from 'lucide-react';

interface QuickActionsBarProps {
  onOpenNotifications: () => void;
  onOpenPolicies: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onOpenNotifications,
  onOpenPolicies,
}) => {
  const {
    language,
    currentView,
    setCurrentView,
    vehicles,
    reservations,
    adminContact,
    user,
    unreadNotificationsCount,
  } = useApp();

  const isHindi = language === 'hi';

  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const activeBookingsCount = reservations.filter(
    (r) => r.bookingStatus === 'confirmed' || r.bookingStatus === 'active'
  ).length;

  const quickActionTabs = [
    {
      id: 'book',
      label: isHindi ? 'वाहन बुक करें' : 'Book Vehicle',
      subtext: isHindi ? 'किराया व रीयल-टाइम कार' : 'Live Fares & Vehicles',
      icon: Car,
      badge: `${availableCount} Available`,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'calendar',
      label: isHindi ? 'फ्लीट कैलेंडर' : 'Fleet Calendar',
      subtext: isHindi ? 'शेड्यूल व बुकिंग टकराव' : 'Schedule & Conflicts',
      icon: Calendar,
      badge: isHindi ? 'लाइव' : 'Live Sync',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'bookings',
      label: isHindi ? 'मेरी बुकिंग्स' : 'My Reservations',
      subtext: isHindi ? 'रसीदें, अलर्ट व रद्दीकरण' : 'Invoices & Reminders',
      icon: Compass,
      badge: activeBookingsCount > 0 ? `${activeBookingsCount} Active` : undefined,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'admin',
      label: isHindi ? 'एडमिन पोर्टल' : 'Admin Operations',
      subtext: isHindi ? 'उपलब्धता, मेंटेनेंस व भाड़ा' : 'Fleet & Maintenance',
      icon: Wrench,
      badge: 'Admin Hub',
      badgeColor: 'bg-purple-700 text-white',
    },
    {
      id: 'support',
      label: isHindi ? '24/7 सहायता' : 'Support & Dispatch',
      subtext: isHindi ? 'ऑटोमेटेड ईमेल व संपर्क' : 'Inquiries & WhatsApp',
      icon: Headphones,
      badge: 'Helpdesk',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'profile',
      label: isHindi ? 'प्रोफ़ाइल व MFA' : 'Profile & MFA',
      subtext: isHindi ? 'सुरक्षा व आपातकालीन संपर्क' : 'Security & Settings',
      icon: User,
      badge: user?.mfaEnabled ? 'MFA Active' : 'Setup PIN',
      badgeColor: user?.mfaEnabled ? 'bg-emerald-700 text-white' : 'bg-neutral-600 text-white',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Value / Trust Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {isHindi
                  ? 'हसनपुरा, सीवान, छपरा व पटना के लिए आधिकारिक फ्लीट'
                  : 'Official Local Vehicle Fleet for Hasanpura, Siwan, Chapra & Patna'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {isHindi ? (
                <>
                  विश्वसनीय लोकल वाहन बुकिंग{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">
                    रीयल-टाइम उपलब्धता
                  </span>{' '}
                  के साथ
                </>
              ) : (
                <>
                  Fast Local Fleet Booking with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">
                    Guaranteed Availability
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isHindi
                ? 'हसनपुरा स्टैंड और सीवान जंक्शन से सुरक्षित यात्रा। 256-बिट सुरक्षित भुगतान, 2 घंटे पहले तक 100% निःशुल्क रद्दीकरण, और 2-स्टेप MFA खाता सुरक्षा।'
                : 'Direct door-to-door verified cabs, SUVs & commercial travelers. Transparent distance-based pricing, bank-grade secure checkout, and instant automated email confirmations.'}
            </p>
          </div>

          {/* Quick Stats & Admin Direct Call Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-left">
              <div className="text-xs text-blue-200 font-bold uppercase tracking-wider">
                Fleet Dispatcher Hotline
              </div>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                {adminContact.name}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <a
                  href={`tel:${adminContact.primaryPhone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call: {adminContact.primaryPhone}</span>
                </a>
                <a
                  href={`https://wa.me/${adminContact.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Booking Fee</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>256-Bit SSL</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free Cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Quick Actions Navigation Container */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-md">
        <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
              {isHindi ? 'त्वरित कार्य मेनू (Quick Actions)' : 'Quick Operations & Navigation'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <button
              onClick={onOpenPolicies}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              {isHindi ? 'रद्दीकरण व कुकी नीतियां' : 'Cancellation & Payment Policies'}
            </button>
            <span>•</span>
            <button
              onClick={onOpenNotifications}
              className="text-slate-700 hover:text-blue-600 font-semibold flex items-center gap-1"
            >
              <span>{isHindi ? 'रिमाइंडर अलर्ट' : 'Trip Alerts'}</span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {quickActionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                id={`quick-action-${tab.id}`}
                onClick={() => setCurrentView(tab.id as any)}
                className={`relative group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 ring-2 ring-blue-600/30'
                    : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-blue-600 shadow-sm border border-slate-200 group-hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {tab.badge && (
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                        isActive ? 'bg-white text-blue-900' : tab.badgeColor
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div
                    className={`font-black text-sm sm:text-base leading-snug ${
                      isActive ? 'text-white' : 'text-slate-900 group-hover:text-blue-700'
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={`text-xs mt-0.5 truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {tab.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
