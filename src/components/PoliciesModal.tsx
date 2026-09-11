import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  FileText,
  Lock,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';

interface PoliciesModalProps {
  isOpen?: boolean;
  onClose: () => void;
  initialTab?: 'cookies' | 'terms' | 'cancellation' | 'payments';
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen = true,
  onClose,
  initialTab = 'cancellation',
}) => {
  const { language, cookieConsent, acceptCookies } = useApp();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'cookies' | 'terms' | 'cancellation' | 'payments'>(
    initialTab
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative my-8 text-xs text-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="pb-4 border-b border-neutral-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Legal, Privacy & Compliance
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
            {isHindi ? 'नीतियां व कानूनी नियम' : 'Policies & Terms of Service'}
          </h2>
        </div>

        {/* Policy Tabs */}
        <div className="flex items-center gap-1.5 mt-4 border-b border-neutral-200 pb-2 overflow-x-auto">
          {[
            { id: 'cancellation', label: isHindi ? 'रद्दीकरण नीति' : 'Cancellation & Refunds', icon: RotateCcw },
            { id: 'payments', label: isHindi ? 'सुरक्षित भुगतान' : 'Secure Payments', icon: Lock },
            { id: 'terms', label: isHindi ? 'डेटा संग्रह व शर्तें' : 'Terms & Data Collection', icon: FileText },
            { id: 'cookies', label: isHindi ? 'कुकी नीति' : 'Cookie Policy', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Cancellation & Refund Policy */}
        {activeTab === 'cancellation' && (
          <div className="mt-5 space-y-4 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 font-medium">
              <strong className="text-blue-900 block font-bold mb-1">
                Transparent Fleet Ride Cancellation Policy:
              </strong>
              We understand plans change. Our cancellation structure is designed to be fair to both riders and local vehicle operators.
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-emerald-800 text-sm block">
                  1. Free Cancellation (100% Full Refund):
                </span>
                <p className="mt-1 text-neutral-600">
                  Any booking cancelled <strong>more than 2 hours prior</strong> to the scheduled pickup time receives a 100% full refund with zero cancellation charges.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-amber-800 text-sm block">
                  2. Late Cancellation (Within 2 Hours of Pickup):
                </span>
                <p className="mt-1 text-neutral-600">
                  If cancelled within 2 hours of departure, an 85% refund is credited. A nominal 15% charge is deducted to compensate the assigned driver for fuel and depot scheduling.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-red-800 text-sm block">
                  3. Driver No-Show or Delay Guarantee:
                </span>
                <p className="mt-1 text-neutral-600">
                  If a LocalRide driver arrives more than 15 minutes late without prior dispatch notification, customer is eligible for a full 100% refund plus a 10% credit discount on their next journey.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-800 text-sm block">
                  4. Refund Processing Window:
                </span>
                <p className="mt-1 text-neutral-600">
                  Refunds processed via UPI or Net Banking are instant (0-2 business hours). Card refunds reflect within 2-4 banking business days under standard RBI/NPCI guidelines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Secure Payment Processing */}
        {activeTab === 'payments' && (
          <div className="mt-5 space-y-4 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
              <strong className="text-emerald-900 block font-bold mb-1">
                Bank-Grade 256-bit Encrypted Payments:
              </strong>
              All online payments on LocalRide are handled over TLS 1.3 encrypted pipelines backed by PCI-DSS Level 1 compliant gateway protocols.
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  • Zero Card Storage:
                </span>
                <p className="mt-1 text-neutral-600">
                  We never store your full 16-digit debit/credit card numbers or CVV codes on our servers. All card transactions use RBI-mandated tokenization with 3D Secure OTP authentication.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  • Unified Payments Interface (UPI) Protection:
                </span>
                <p className="mt-1 text-neutral-600">
                  UPI payments via Google Pay, PhonePe, and Paytm are processed directly via NPCI virtual private payment addresses without exposing bank credentials.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  • Automated Digital Invoices:
                </span>
                <p className="mt-1 text-neutral-600">
                  Every transaction generates an instant digital invoice containing unique Transaction Reference (TXN), breakdown of GST, route distance, and driver dispatch information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Terms & Conditions of Data Collection */}
        {activeTab === 'terms' && (
          <div className="mt-5 space-y-4 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium">
              <strong className="text-neutral-900 block font-bold mb-1">
                Terms of Data Collection & Privacy Commitment:
              </strong>
              We respect your privacy and collect only the strictly required data to execute safe vehicle dispatch and communicate booking updates.
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  1. Information We Collect:
                </span>
                <ul className="mt-1 list-disc list-inside text-neutral-600 space-y-1">
                  <li>Passenger Contact: Name, mobile number, and email address for dispatch alerts.</li>
                  <li>Trip Itinerary: Pickup address, dropoff destination, date, and schedule.</li>
                  <li>Emergency Contact: Name and number for rider safety alerts.</li>
                  <li>Fleet Telemetry: GPS coordinates for driver ETA and trip route optimization.</li>
                </ul>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  2. Use of Information:
                </span>
                <p className="mt-1 text-neutral-600">
                  Data is solely used to confirm reservations, provide driver contact, process payments, and dispatch upcoming ride reminder notifications. We never sell customer records to third-party advertisers.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  3. Multi-Factor Authentication (MFA) Security:
                </span>
                <p className="mt-1 text-neutral-600">
                  User accounts are protected by multi-factor authentication to prevent unauthorized modifications to booked itineraries or stored payment profiles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cookie Policy */}
        {activeTab === 'cookies' && (
          <div className="mt-5 space-y-4 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium">
              <strong className="text-neutral-900 block font-bold mb-1">
                Cookie Usage & Local Storage Policy:
              </strong>
              LocalRide uses necessary cookies and browser local storage to maintain your logged-in session, remember route fare updates, and store offline booking prototypes.
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  • Essential Cookies & Local Storage:
                </span>
                <p className="mt-1 text-neutral-600">
                  Required for user authentication sessions, active MFA token state, route fare updates, and real-time vehicle booking status.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-900 text-sm block">
                  • Preference Cookies:
                </span>
                <p className="mt-1 text-neutral-600">
                  Saves your language selection (English vs. हिंदी) and preferred pickup locations (e.g. Hasanpura Market).
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between p-3 bg-blue-50/60 rounded-xl border border-blue-200">
              <div className="text-blue-900 font-semibold text-xs">
                Cookie Consent Status:{' '}
                <strong className={cookieConsent ? 'text-emerald-700' : 'text-amber-700'}>
                  {cookieConsent ? 'Accepted & Active' : 'Default Prototype Session'}
                </strong>
              </div>
              {!cookieConsent && (
                <button
                  type="button"
                  onClick={acceptCookies}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Accept All Cookies
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs transition-colors"
          >
            Close Policy Guide
          </button>
        </div>
      </div>
    </div>
  );
};
