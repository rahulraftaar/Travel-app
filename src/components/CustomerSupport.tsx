import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportTicket } from '../types';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  FileCheck,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const CustomerSupportView: React.FC = () => {
  const { language, adminContact, user, reservations, submitSupportTicket } = useApp();
  const isHindi = language === 'hi';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bookingId, setBookingId] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('booking');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const newTkt = await submitSupportTicket({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bookingId: bookingId.trim() || undefined,
      category,
      subject: subject.trim() || `${category.toUpperCase()} Inquiry`,
      message: message.trim(),
    });

    setIsSubmitting(false);
    setSubmittedTicket(newTkt);
    setMessage('');
    setSubject('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Support Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10">
              <Headphones className="w-3.5 h-3.5" />
              <span>24/7 Dedicated Local Helpdesk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              {isHindi ? 'ग्राहक सहायता व व्यवस्थापक संपर्क' : 'Customer Support & Dispatch Inquiry'}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl">
              {isHindi
                ? 'हसनपुरा, सीवान व आस-पास के क्षेत्रों में हमारी लोकल फ्लीट के संबंध में किसी भी प्रश्न के लिए तुरंत संपर्क करें। प्रत्येक इंक्वायरी पर ऑटोमेटेड ईमेल व त्वरित समाधान दिया जाता है।'
                : 'Direct support for local vehicle bookings, route fare disputes, driver dispatch, and instant email confirmations.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-xs text-center">
            <span className="text-blue-200 block text-[10px] uppercase font-bold">Direct WhatsApp</span>
            <a
              href={`https://wa.me/${adminContact.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
            >
              <span>Chat: {adminContact.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Left 2 cols Form, Right 1 col Admin Contact Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Inquiry Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'सहायता पूछताछ फॉर्म' : 'Submit Support Inquiry'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isHindi
                ? 'फॉर्म भरते ही एक ऑटोमेटेड कन्फर्मेशन ईमेल आपके दिए गए ईमेल पते पर भेजी जाएगी।'
                : 'Submit your request. An automated email receipt with tracking ticket will be sent to your inbox.'}
            </p>
          </div>

          {/* Automated confirmation notice banner after submission */}
          {submittedTicket && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-2 animate-in fade-in duration-300">
              <div className="font-bold flex items-center gap-2 text-emerald-800 text-sm">
                <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Automated Confirmation Email Generated (Ticket #{submittedTicket.id})</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                We have received your inquiry regarding <strong>"{submittedTicket.subject}"</strong>. A copy
                of this automated confirmation has been sent to <strong>{submittedTicket.email}</strong>.
                Our operations team (Admin: {adminContact.name}) will follow up directly.
              </p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200 font-mono text-[11px] text-emerald-900">
                Subject: [LocalRide Helpdesk] Confirmation for Ticket #{submittedTicket.id}
                <br />
                Status: Assigned to Siwan Operations Dispatcher
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 97984 75673"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Related Booking ID (Optional)</label>
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-mono text-neutral-800"
                >
                  <option value="">None / General Inquiry</option>
                  {reservations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} ({r.pickupLocation} → {r.dropoffLocation})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-800"
                >
                  <option value="booking">Booking Date/Time Reschedule</option>
                  <option value="payment">Payment / Refund / Billing</option>
                  <option value="cancellation">Cancellation Assistance</option>
                  <option value="driver">Driver / Vehicle Feedback</option>
                  <option value="other">Outstation Fleet Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Need driver arrival 15 mins early"
                  className="w-full border border-neutral-300 rounded-xl p-2.5 font-medium text-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-600 font-semibold mb-1">Message Description</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, request, or issue in detail..."
                className="w-full border border-neutral-300 rounded-xl p-3 text-neutral-900 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              id="submit-support-ticket-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Dispatching Ticket & Generating Confirmation...</span>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>
                    {isHindi ? 'पूछताछ भेजें व ऑटोमेटेड ईमेल प्राप्त करें' : 'Submit & Receive Automated Email Confirmation'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 1 Col: ADMIN OFFICIAL CONTACT DETAILS */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              Direct Fleet Contact
            </span>
            <h2 className="text-base font-bold text-neutral-900 mt-0.5">
              {isHindi ? 'व्यवस्थापक संपर्क विवरण' : 'Admin Contact Details'}
            </h2>
            <p className="text-xs text-neutral-500">
              Official contact information of the fleet administrator.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Fleet Administrator
              </span>
              <div className="font-bold text-neutral-900 text-sm">{adminContact.name}</div>
              <div className="text-neutral-500">{adminContact.role}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Phone & Hotline
              </span>
              <div className="font-bold text-blue-700 text-sm">
                <a href={`tel:${adminContact.primaryPhone.replace(/\s+/g, '')}`}>
                  {adminContact.primaryPhone}
                </a>
              </div>
              <div className="text-neutral-500">Secondary: {adminContact.secondaryPhone}</div>
              <div className="text-red-600 font-bold pt-1">{adminContact.emergencyHelpline}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Email & WhatsApp
              </span>
              <div className="font-semibold text-neutral-900">{adminContact.email}</div>
              <div className="text-emerald-700 font-bold">WhatsApp: {adminContact.whatsappNumber}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
              <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                Office & Fleet Depot
              </span>
              <div className="font-bold text-neutral-900">{adminContact.officeAddress}</div>
              <div className="text-neutral-600">{adminContact.cityState}</div>
              <div className="text-neutral-400 text-[11px] pt-1">
                Hours: {adminContact.operatingHours}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
