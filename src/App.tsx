import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { QuickActionsBar } from './components/QuickActionsBar';
import { FareCalculator } from './components/FareCalculator';
import { CalendarSchedule } from './components/CalendarSchedule';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { MfaModal } from './components/MfaModal';
import { UserProfileView } from './components/UserProfileModal';
import { CustomerSupportView } from './components/CustomerSupport';
import { MyBookingsView } from './components/MyBookingsView';
import { PoliciesModal } from './components/PoliciesModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CookieBanner } from './components/CookieBanner';
import { Vehicle, Reservation } from './types';
import {
  Calendar,
  Car,
  CheckCircle2,
  FileText,
  Headphones,
  Lock,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';

function MainApp() {
  const {
    language,
    currentView,
    setCurrentView,
    isMfaPromptOpen,
    setIsMfaPromptOpen,
    adminContact,
    notifications,
  } = useApp();

  const isHindi = language === 'hi';

  // Modal States
  const [activePaymentDraft, setActivePaymentDraft] = useState<{
    vehicle: Vehicle;
    fare: number;
    from: string;
    to: string;
    date: string;
    time: string;
    isRoundTrip: boolean;
    returnDate?: string;
    returnTime?: string;
    distanceKm: number;
  } | null>(null);

  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [policiesTab, setPoliciesTab] = useState<
    'cookies' | 'terms' | 'cancellation' | 'payments'
  >('cancellation');
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const handleOpenPolicies = (tab: 'cookies' | 'terms' | 'cancellation' | 'payments') => {
    setPoliciesTab(tab);
    setIsPoliciesOpen(true);
  };

  const handleBookVehicle = (draft: {
    vehicle: Vehicle;
    fare: number;
    from: string;
    to: string;
    date: string;
    time: string;
    isRoundTrip: boolean;
    returnDate?: string;
    returnTime?: string;
    distanceKm: number;
  }) => {
    setActivePaymentDraft(draft);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenProfile={() => setCurrentView('profile')}
        onOpenPolicies={() => handleOpenPolicies('cancellation')}
        onOpenMfa={() => setIsMfaPromptOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Quick actions prominently above everything */}
        <QuickActionsBar
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          onOpenPolicies={() => handleOpenPolicies('cancellation')}
        />

        {/* Dynamic View Panel */}
        <div className="transition-all duration-200">
          {currentView === 'book' && (
            <FareCalculator onSelectVehicleToBook={handleBookVehicle} />
          )}

          {currentView === 'calendar' && (
            <CalendarSchedule />
          )}

          {currentView === 'bookings' && (
            <MyBookingsView onNavigateToBooking={() => setCurrentView('book')} />
          )}

          {currentView === 'support' && (
            <CustomerSupportView />
          )}

          {currentView === 'profile' && (
            <UserProfileView />
          )}

          {currentView === 'admin' && (
            <AdminDashboard />
          )}
        </div>
      </main>

      {/* Footer with Legal Policies, Admin Contact & Security Badges */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-12 px-4 sm:px-6 lg:px-8 text-sm text-slate-600">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: About & Fleet Region */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  LR
                </div>
                <span className="font-black text-slate-900 text-lg">
                  LocalRide Fleet
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isHindi
                  ? 'हसनपुरा, सीवान, छपरा व पटना के लिए विश्वसनीय स्थानीय वाहन बुकिंग सेवा। रीयल-टाइम उपलब्धता, सुरक्षित भुगतान और समर्पित प्रशासनिक सहायता।'
                  : 'Premier local vehicle booking network across Hasanpura, Siwan, Gopalganj, Chapra & Patna. Verified fleet, 256-bit secure checkout, and proactive fleet management.'}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted & Bank Secured</span>
              </div>
            </div>

            {/* Col 2: Policies & Compliance */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                {isHindi ? 'नीतियां व नियम' : 'Policies & Transparency'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => handleOpenPolicies('cancellation')}
                    className="hover:text-blue-600 transition-colors text-left flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>{isHindi ? 'रद्दीकरण व रिफंड नीति' : 'Cancellation & Refund Policy'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenPolicies('payments')}
                    className="hover:text-blue-600 transition-colors text-left flex items-center gap-2 font-medium"
                  >
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>{isHindi ? 'सुरक्षित भुगतान प्रक्रिया' : 'Secure Payment Processing'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenPolicies('terms')}
                    className="hover:text-blue-600 transition-colors text-left flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{isHindi ? 'डेटा संग्रह व नियम' : 'Terms & Data Collection'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenPolicies('cookies')}
                    className="hover:text-blue-600 transition-colors text-left flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>{isHindi ? 'कुकी नीति व प्राथमिकताएं' : 'Cookie Policy & Consent'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Admin & Dispatch Contact Details */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                {isHindi ? 'व्यवस्थापक संपर्क (Admin Details)' : 'Fleet Administrator & Contact'}
              </h4>
              <div className="space-y-1.5 text-sm">
                <p className="font-black text-slate-900 text-base">{adminContact.name}</p>
                <p className="text-slate-500 font-semibold">{adminContact.role}</p>
                <p className="text-blue-700 font-extrabold flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${adminContact.primaryPhone.replace(/\s+/g, '')}`}>
                    {adminContact.primaryPhone}
                  </a>
                </p>
                <p className="text-emerald-700 font-bold">
                  💬 WhatsApp: {adminContact.whatsappNumber}
                </p>
                <p className="text-slate-500 text-xs pt-1">
                  📍 {adminContact.officeAddress}, {adminContact.cityState}
                </p>
              </div>
            </div>

            {/* Col 4: Quick Navigation */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                {isHindi ? 'त्वरित लिंक' : 'Quick Operations'}
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                <button
                  onClick={() => setCurrentView('book')}
                  className="text-left hover:text-blue-600 transition-colors font-semibold"
                >
                  • {isHindi ? 'किराया कैलकुलेटर व बुकिंग' : 'Fare Calculator & Booking'}
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className="text-left hover:text-blue-600 transition-colors font-semibold"
                >
                  • {isHindi ? 'फ्लीट कैलेंडर व शेड्यूल' : 'Fleet Calendar & Conflicts'}
                </button>
                <button
                  onClick={() => setCurrentView('bookings')}
                  className="text-left hover:text-blue-600 transition-colors font-semibold"
                >
                  • {isHindi ? 'मेरी रसीदें व यात्राएं' : 'My Bookings & Invoices'}
                </button>
                <button
                  onClick={() => setCurrentView('support')}
                  className="text-left hover:text-blue-600 transition-colors font-semibold"
                >
                  • {isHindi ? '24/7 ग्राहक सहायता' : 'Customer Support Desk'}
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-left hover:text-blue-600 transition-colors font-extrabold text-blue-700"
                >
                  • {isHindi ? 'व्यवस्थापक डैशबोर्ड' : 'Admin Operations Center'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LocalRide Hasanpura/Siwan. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleOpenPolicies('cancellation')}
                className="hover:underline font-medium"
              >
                Cancellation Policy
              </button>
              <button
                onClick={() => handleOpenPolicies('payments')}
                className="hover:underline font-medium"
              >
                Payment Security
              </button>
              <button
                onClick={() => handleOpenPolicies('terms')}
                className="hover:underline font-medium"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleOpenPolicies('cookies')}
                className="hover:underline font-medium"
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {activePaymentDraft && (
        <PaymentModal
          bookingDraft={activePaymentDraft}
          onClose={() => setActivePaymentDraft(null)}
          onSuccess={(confirmedRes: Reservation) => {
            setCurrentView('bookings');
          }}
        />
      )}

      {/* MFA Security Modal */}
      {isMfaPromptOpen && (
        <MfaModal onClose={() => setIsMfaPromptOpen(false)} />
      )}

      {/* Legal Policies Modal (Cookies, Terms, Cancellation, Payments) */}
      {isPoliciesOpen && (
        <PoliciesModal
          isOpen={isPoliciesOpen}
          initialTab={policiesTab}
          onClose={() => setIsPoliciesOpen(false)}
        />
      )}

      {/* Notification Drawer (Upcoming Trip Reminders) */}
      {isNotificationDrawerOpen && (
        <NotificationDrawer
          isOpen={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
        />
      )}

      {/* Cookie Banner & Consent */}
      <CookieBanner onOpenPolicies={() => handleOpenPolicies('cookies')} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
