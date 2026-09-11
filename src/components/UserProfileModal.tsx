import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    language,
    user,
    updateProfile,
    toggleMfa,
    sendPushNotification,
    requestBrowserNotifications,
  } = useApp();

  const isHindi = language === 'hi';

  const [name, setName] = useState(user?.name || 'Ratna deep');
  const [phone, setPhone] = useState(user?.phone || '+91 97984 75673');
  const [email, setEmail] = useState(user?.email || 'aakaashcommunication@gmail.com');

  // Emergency contact
  const [emName, setEmName] = useState(user?.emergencyContact.name || 'Manoj Kumar');
  const [emPhone, setEmPhone] = useState(user?.emergencyContact.phone || '+91 94312 00998');
  const [emRelation, setEmRelation] = useState(user?.emergencyContact.relation || 'Brother');

  // Saved addresses
  const [addresses, setAddresses] = useState(user?.savedAddresses || []);
  const [newAddrLabel, setNewAddrLabel] = useState('Office');
  const [newAddrVal, setNewAddrVal] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      email,
      emergencyContact: {
        name: emName,
        phone: emPhone,
        relation: emRelation,
      },
      savedAddresses: addresses,
    });

    setSavedSuccess(true);
    sendPushNotification('Profile Updated', 'Your profile details and emergency contacts were saved.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddAddress = () => {
    if (!newAddrVal.trim()) return;
    const next = [...addresses, { id: 'addr-' + Date.now(), label: newAddrLabel, address: newAddrVal.trim() }];
    setAddresses(next);
    setNewAddrVal('');
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleEnablePush = async () => {
    const granted = await requestBrowserNotifications();
    if (granted) {
      sendPushNotification('Push Notifications Active', 'You will now receive upcoming trip reminders 2 hours before pickup!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                {isHindi ? 'उपयोगकर्ता प्रोफ़ाइल व सुरक्षा' : 'User Profile & Security Settings'}
              </h1>
              <p className="text-xs text-neutral-500">
                {isHindi
                  ? 'व्यक्तिगत विवरण, आपातकालीन संपर्क, सहेजे गए पते और MFA प्रमाणीकरण।'
                  : 'Manage your verified rider account, emergency contacts, saved addresses, and MFA.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                user?.mfaEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{user?.mfaEnabled ? 'MFA 2-Step Active' : 'MFA Disabled'}</span>
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-6 text-xs">
          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Security & Multi-Factor Authentication (MFA) */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? 'मल्टी-फैक्टर प्रमाणीकरण (MFA Safety)' : 'Multi-Factor Authentication (MFA)'}</span>
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Protects your vehicle reservations and payment credentials with 2-step verification code.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleMfa(!user?.mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  user?.mfaEnabled
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {user?.mfaEnabled ? 'Disable MFA' : 'Enable MFA (Recommended)'}
              </button>
            </div>
          </div>

          {/* Section 3: Push Notifications For Reminders */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>{isHindi ? 'आगामी यात्रा पुश नोटिफिकेशन' : 'Trip Reminder Push Notifications'}</span>
              </h3>
              <p className="text-[11px] text-blue-900 mt-0.5">
                Receive browser push alerts for driver arrival and trip reminder notifications 2 hours prior to departure.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnablePush}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Test / Enable Browser Push
            </button>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span>{isHindi ? 'आपातकालीन संपर्क (Emergency SOS Contact)' : 'Emergency Contact'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={emName}
                  onChange={(e) => setEmName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={emPhone}
                  onChange={(e) => setEmPhone(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Relationship</label>
                <input
                  type="text"
                  value={emRelation}
                  onChange={(e) => setEmRelation(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Saved Addresses */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'सहेजे गए पते (Saved Locations)' : 'Saved Pickup & Drop Locations'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-neutral-800 text-[11px] block">{a.label}</span>
                    <span className="text-neutral-600 text-xs">{a.address}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(a.id)}
                    className="text-neutral-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Label (e.g. Siwan Junction Station)"
                value={newAddrLabel}
                onChange={(e) => setNewAddrLabel(e.target.value)}
                className="w-1/3 border border-neutral-300 rounded-xl p-2 text-xs"
              />
              <input
                type="text"
                placeholder="Full address or landmark"
                value={newAddrVal}
                onChange={(e) => setNewAddrVal(e.target.value)}
                className="flex-1 border border-neutral-300 rounded-xl p-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <button
              id="save-profile-btn"
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              {isHindi ? 'प्रोफ़ाइल विवरण सहेजें' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
