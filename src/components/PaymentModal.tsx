import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Reservation, Vehicle } from '../types';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  Lock,
  Printer,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';

interface PaymentModalProps {
  bookingDraft: {
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
  };
  onClose: () => void;
  onSuccess: (confirmedBooking: Reservation) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  bookingDraft,
  onClose,
  onSuccess,
}) => {
  const { language, user, createBooking } = useApp();
  const isHindi = language === 'hi';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerName, setCustomerName] = useState(user?.name || 'Ratna deep');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'aakaashcommunication@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 97984 75673');
  const [pickupLandmark, setPickupLandmark] = useState('Hasanpura Market Stand');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9812');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('742');

  // UPI details
  const [upiId, setUpiId] = useState('9798475673@upi');

  // Net banking bank
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReservation, setCompletedReservation] = useState<Reservation | null>(null);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate bank 2-second processing & 3D Secure verification
    setTimeout(async () => {
      const confirmed = await createBooking({
        vehicleId: bookingDraft.vehicle.id,
        vehicleName: bookingDraft.vehicle.name,
        vehicleType: bookingDraft.vehicle.type,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        pickupLocation: `${bookingDraft.from} (${pickupLandmark})`,
        dropoffLocation: bookingDraft.to,
        pickupDate: bookingDraft.date,
        pickupTime: bookingDraft.time,
        returnDate: bookingDraft.returnDate,
        returnTime: bookingDraft.returnTime,
        isRoundTrip: bookingDraft.isRoundTrip,
        distanceKm: bookingDraft.distanceKm,
        totalAmount: bookingDraft.fare,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        paymentTxnId:
          paymentMethod === 'cash'
            ? 'CASH_ON_PICKUP'
            : `TXN_${paymentMethod.toUpperCase()}_${Math.floor(100000000 + Math.random() * 900000000)}`,
        notes: `Pickup landmark: ${pickupLandmark}. Verified secure checkout.`,
      });

      setIsProcessing(false);
      setCompletedReservation(confirmed);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      onSuccess(confirmed);
    }, 1600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative my-8">
        {!completedReservation && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step 1: Processing/Checkout Form */}
        {!completedReservation ? (
          <form onSubmit={handlePayNow} className="space-y-6 text-sm text-slate-800">
            {/* Security Header */}
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm">
                <Lock className="w-4 h-4" />
                <span>256-bit SSL Secure Checkout</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {isHindi ? 'सुरक्षित भुगतान व बुकिंग पुष्टि' : 'Secure Vehicle Booking Checkout'}
              </h2>
              <p className="text-slate-600 text-sm mt-0.5">
                Trip:{' '}
                <strong className="text-slate-900">
                  {bookingDraft.from} → {bookingDraft.to}
                </strong>{' '}
                on {bookingDraft.date} at {bookingDraft.time}
              </p>
            </div>

            {/* Ride Fare Summary Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-700 font-bold text-base block">
                  {bookingDraft.vehicle.name} ({bookingDraft.vehicle.plateNumber})
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Driver: {bookingDraft.vehicle.driverName} • {bookingDraft.distanceKm} km total
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">Total Payable</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-700">
                  ₹{bookingDraft.fare.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Passenger Contact Information */}
            <div className="space-y-3">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs block">
                1. Passenger & Pickup Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl p-3 font-bold text-sm text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs">Mobile (for SMS & Driver)</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl p-3 font-bold text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs">Email (for Confirmation PDF)</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl p-3 font-bold text-sm text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-xs">Exact Pickup Landmark</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Bus Stand, SBI ATM"
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-blue-600 rounded-xl p-3 font-medium text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs block">
                2. Select Secure Payment Gateway
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode, sub: 'GPay, PhonePe' },
                  { id: 'card', label: 'Cards', icon: CreditCard, sub: 'Debit/Credit' },
                  { id: 'netbanking', label: 'NetBanking', icon: Building, sub: 'All Banks' },
                  { id: 'cash', label: 'Pay at Ride', icon: Wallet, sub: 'Cash on Pickup' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-sm ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                      <div className="font-extrabold text-slate-900 text-sm">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* UPI Sub-form */}
              {paymentMethod === 'upi' && (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-700">Scan & Pay via any UPI App</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Instant Confirmation
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-white p-1 rounded-lg border border-neutral-300 shadow-xs flex items-center justify-center shrink-0">
                      {/* Stylized simulated QR Code */}
                      <div className="w-full h-full bg-neutral-900 p-1 flex flex-col justify-between rounded">
                        <div className="flex justify-between">
                          <div className="w-4 h-4 bg-white" />
                          <div className="w-4 h-4 bg-white" />
                        </div>
                        <div className="text-[8px] text-white text-center font-bold tracking-widest">
                          UPI QR
                        </div>
                        <div className="flex justify-between">
                          <div className="w-4 h-4 bg-white" />
                          <div className="w-4 h-4 bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <label className="text-[11px] text-neutral-600 block">Or enter your UPI ID (VPA):</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs"
                      />
                      <span className="text-[10px] text-neutral-400 block">
                        Supported: Google Pay, Paytm, PhonePe, Cred, BHIM
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Sub-form */}
              {paymentMethod === 'card' && (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                  <div>
                    <label className="block text-neutral-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full border border-neutral-300 rounded-lg p-2 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Sub-form */}
              {paymentMethod === 'netbanking' && (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <label className="block text-neutral-600 mb-1">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-semibold text-xs"
                  >
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Punjab National Bank (PNB)</option>
                    <option>Central Bank of India</option>
                    <option>Bank of Baroda</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Cash Sub-form */}
              {paymentMethod === 'cash' && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-amber-600" />
                    <span>Pay Cash Directly to Driver</span>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-800">
                    You can pay the full amount of ₹{bookingDraft.fare} in cash directly to{' '}
                    <strong>{bookingDraft.vehicle.driverName}</strong> upon boarding at Hasanpura.
                  </p>
                </div>
              )}
            </div>

            {/* Cancellation & Refund Guarantee Note */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cancellation Policy:</strong> Free 100% refund if cancelled up to 2 hours
                prior to pickup. Instant automated email receipt will be sent to {customerEmail}.
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="confirm-pay-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment with Bank Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay ₹{bookingDraft.fare.toLocaleString('en-IN')} & Confirm Reservation
                  </span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Completed Booking Ticket & Confirmation */
          <div className="space-y-6 text-sm text-slate-800">
            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isHindi ? 'बुकिंग सफलतापूर्वक संपन्न हुई!' : 'Vehicle Booking Confirmed!'}
              </h2>
              <p className="text-slate-500 text-sm">
                Reservation ID:{' '}
                <strong className="font-mono text-blue-700 text-base">{completedReservation.id}</strong>
              </p>
            </div>

            {/* Automated Email Confirmation Simulation Card */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl space-y-2 text-sm">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-base">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Automated Email Confirmation Dispatched</span>
              </div>
              <p className="text-emerald-800 text-xs sm:text-sm leading-relaxed">
                An official electronic receipt with booking itinerary and driver contact details has
                been automatically dispatched to <strong>{completedReservation.customerEmail}</strong>{' '}
                and mobile SMS alerts to <strong>{completedReservation.customerPhone}</strong>.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Journey Route
                  </span>
                  <div className="font-black text-slate-900 text-base sm:text-lg">
                    {completedReservation.pickupLocation} → {completedReservation.dropoffLocation}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Total Fare
                  </span>
                  <div className="font-black text-blue-700 text-xl sm:text-2xl">
                    ₹{completedReservation.totalAmount}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Date & Time:</span>
                  <strong className="text-slate-900 text-sm">
                    {completedReservation.pickupDate} at {completedReservation.pickupTime}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Vehicle:</span>
                  <strong className="text-slate-900 text-sm">{completedReservation.vehicleName}</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Payment Method:</span>
                  <strong className="text-slate-900 text-sm uppercase">
                    {completedReservation.paymentMethod} (
                    {completedReservation.paymentStatus.toUpperCase()})
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Transaction Ref:</span>
                  <span className="font-mono text-xs text-slate-700 font-bold">
                    {completedReservation.paymentTxnId}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Assigned Driver:</span>
                  <strong className="text-slate-900 text-sm">
                    {bookingDraft.vehicle.driverName} ({bookingDraft.vehicle.driverPhone})
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Trip Type:</span>
                  <strong className="text-slate-900 text-sm">
                    {completedReservation.isRoundTrip ? 'Round Trip' : 'One Way'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3.5 px-4 rounded-xl border-2 border-slate-300 font-extrabold text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer text-sm"
              >
                <span>View My Bookings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
