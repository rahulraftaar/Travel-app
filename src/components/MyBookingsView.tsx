import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation } from '../types';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Info,
  MapPin,
  Printer,
  RotateCcw,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react';

interface MyBookingsViewProps {
  onNavigateToBooking: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ onNavigateToBooking }) => {
  const { language, reservations, cancelBooking, sendPushNotification } = useApp();
  const isHindi = language === 'hi';

  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedReceiptRes, setSelectedReceiptRes] = useState<Reservation | null>(null);

  // Cancellation modal
  const [cancelModalRes, setCancelModalRes] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState('Change in schedule');

  const filtered = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.bookingStatus === filter;
  });

  const handleConfirmCancel = () => {
    if (!cancelModalRes) return;
    const res = cancelBooking(cancelModalRes.id, cancelReason);
    alert(res.message);
    setCancelModalRes(null);
  };

  const handleTriggerPushReminder = (res: Reservation) => {
    sendPushNotification(
      `Trip Reminder: ${res.pickupLocation} → ${res.dropoffLocation}`,
      `Your upcoming ride is scheduled for ${res.pickupDate} at ${res.pickupTime}. Driver: ${res.vehicleName}. Please be at the pickup point.`,
      'trip_reminder',
      res.id
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              {isHindi ? 'मेरी गाड़ियों की बुकिंग' : 'My Vehicle Reservations'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {isHindi
                ? 'अपनी सक्रिय यात्राओं की स्थिति देखें, रसीद डाउनलोड करें, समय पूर्व रिमाइंडर प्राप्त करें या रद्दीकरण करें।'
                : 'Manage your active rides, download invoices, trigger trip reminders, or cancel with instant refund.'}
            </p>
          </div>

          <button
            onClick={onNavigateToBooking}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            + {isHindi ? 'नई यात्रा बुक करें' : 'Book New Ride'}
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs">
          {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all uppercase text-[11px] ${
                filter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st} ({reservations.filter((r) => (st === 'all' ? true : r.bookingStatus === st)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500 text-xs space-y-3">
          <p className="text-sm font-semibold text-neutral-700">
            {isHindi ? 'इस श्रेणी में कोई बुकिंग नहीं मिली।' : 'No vehicle reservations found.'}
          </p>
          <button
            onClick={onNavigateToBooking}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
          >
            {isHindi ? 'रूट का भाड़ा देखें व बुक करें' : 'Check Fares & Book Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((res) => {
            const isConfirmed = res.bookingStatus === 'confirmed';
            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-4 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-xs">
                      {res.id}
                    </span>
                    <h2 className="text-base font-extrabold text-neutral-900">
                      {res.pickupLocation} → {res.dropoffLocation}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        res.bookingStatus === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : res.bookingStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.bookingStatus === 'completed'
                          ? 'bg-neutral-200 text-neutral-700'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {res.bookingStatus}
                    </span>
                    <span className="text-sm font-black text-neutral-900">
                      ₹{res.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-neutral-600">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Pickup Date & Time:</span>
                    <strong className="text-neutral-900">
                      {res.pickupDate} at {res.pickupTime}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Vehicle Assigned:</span>
                    <strong className="text-neutral-900">{res.vehicleName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Payment Status:</span>
                    <span className="font-bold text-emerald-700 uppercase">
                      {res.paymentStatus} ({res.paymentMethod})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Passenger:</span>
                    <strong className="text-neutral-900">{res.customerName}</strong>
                  </div>
                </div>

                {res.notes && (
                  <div className="p-2.5 bg-neutral-50 rounded-xl text-[11px] text-neutral-600 border border-neutral-150">
                    <strong className="text-neutral-800">Dispatch Notes:</strong> {res.notes}
                  </div>
                )}

                {/* Cancellation notice if cancelled */}
                {res.bookingStatus === 'cancelled' && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 text-[11px] space-y-1">
                    <div className="font-bold">Cancelled on: {res.cancelledAt}</div>
                    <div>Reason: {res.cancellationReason}</div>
                    {res.refundAmount !== undefined && (
                      <div className="text-emerald-700 font-bold">
                        Refund of ₹{res.refundAmount} initiated back to your {res.paymentMethod.toUpperCase()} account.
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {/* Push reminder button */}
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => handleTriggerPushReminder(res)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                        title="Simulate push notification reminder for upcoming ride"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'रिमाइंडर टेस्ट करें' : 'Send Push Reminder'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedReceiptRes(res)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-[11px] transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'रसीद देखें' : 'View Invoice'}</span>
                    </button>
                  </div>

                  {isConfirmed && (
                    <button
                      type="button"
                      onClick={() => setCancelModalRes(res)}
                      className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 font-bold text-[11px] transition-colors"
                    >
                      {isHindi ? 'यात्रा रद्द करें (Cancel)' : 'Cancel Ride'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancelModalRes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-xs">
            <h3 className="text-base font-black text-neutral-900">
              Cancel Reservation #{cancelModalRes.id}?
            </h3>
            <p className="text-neutral-500 mt-1">
              Route: <strong>{cancelModalRes.pickupLocation} → {cancelModalRes.dropoffLocation}</strong> on{' '}
              {cancelModalRes.pickupDate}
            </p>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
              <strong className="block mb-0.5">Refund Policy Calculation:</strong>
              Cancellations &gt;2 hours before pickup receive 100% full refund. Within 2 hours receives 85% refund (15% driver fuel allocation).
            </div>

            <div className="mt-3">
              <label className="block text-neutral-600 font-semibold mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
              >
                <option>Change in schedule / travel plans</option>
                <option>Booked by mistake</option>
                <option>Alternative transport arranged</option>
                <option>Personal / Medical emergency</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelModalRes(null)}
                className="px-4 py-2 border border-neutral-300 rounded-xl font-semibold text-neutral-700"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT / INVOICE MODAL */}
      {selectedReceiptRes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative text-xs">
            <button
              onClick={() => setSelectedReceiptRes(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-neutral-200 pb-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                Official E-Receipt & Tax Invoice
              </span>
              <h3 className="text-xl font-black text-neutral-900 mt-1">LocalRide Fleet Services</h3>
              <p className="text-[11px] text-neutral-500">
                Main Market Road, Hasanpura, Siwan, Bihar - 841236
              </p>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Booking Reference:</span>
                <span className="font-mono font-bold text-blue-700">{selectedReceiptRes.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="font-mono text-neutral-800">{selectedReceiptRes.paymentTxnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer Name:</span>
                <strong className="text-neutral-900">{selectedReceiptRes.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Pickup Location:</span>
                <span className="text-neutral-900 font-medium">{selectedReceiptRes.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dropoff Destination:</span>
                <span className="text-neutral-900 font-medium">{selectedReceiptRes.dropoffLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Schedule:</span>
                <span className="text-neutral-900 font-bold">
                  {selectedReceiptRes.pickupDate} at {selectedReceiptRes.pickupTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Vehicle & Category:</span>
                <span className="text-neutral-900 font-medium">
                  {selectedReceiptRes.vehicleName} ({selectedReceiptRes.vehicleType.toUpperCase()})
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 font-bold text-sm">
                <span>Total Amount Paid:</span>
                <span className="text-blue-700">₹{selectedReceiptRes.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedReceiptRes(null)}
                className="px-4 py-2 border border-neutral-300 rounded-xl font-semibold text-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
