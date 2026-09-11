import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation, Vehicle } from '../types';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Info,
  MapPin,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';

export const CalendarSchedule: React.FC = () => {
  const { language, reservations, vehicles, checkVehicleConflict } = useApp();
  const isHindi = language === 'hi';

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());

  // Test conflict tool state
  const [testVehicleId, setTestVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [testDate, setTestDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [testTime, setTestTime] = useState<string>('10:00');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Next / Prev month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Format month string YYYY-MM
  const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (r.bookingStatus === 'cancelled') return false;
      if (selectedVehicleFilter !== 'all' && r.vehicleId !== selectedVehicleFilter) return false;
      return true;
    });
  }, [reservations, selectedVehicleFilter]);

  // Group reservations by day of current month
  const reservationsByDay = useMemo(() => {
    const map: Record<number, Reservation[]> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      map[d] = [];
    }

    filteredReservations.forEach((r) => {
      if (r.pickupDate.startsWith(monthString)) {
        const day = parseInt(r.pickupDate.split('-')[2], 10);
        if (map[day]) {
          map[day].push(r);
        }
      }
    });

    return map;
  }, [filteredReservations, monthString, daysInMonth]);

  // Check test conflict
  const testConflict = useMemo(() => {
    if (!testVehicleId) return { hasConflict: false };
    return checkVehicleConflict(testVehicleId, testDate, testTime);
  }, [testVehicleId, testDate, testTime, checkVehicleConflict]);

  const activeDayReservations = reservationsByDay[selectedDay] || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <span>{isHindi ? 'फ्लीट शेड्यूल व कैलेंडर' : 'Fleet Calendar & Scheduling Conflicts'}</span>
            </h1>
            <p className="text-neutral-500 text-xs mt-1">
              {isHindi
                ? 'गाड़ियों की बुकिंग तिथियां, ओवरलैप अलर्ट और समय संघर्ष (scheduling conflict) की रीयल-टाइम रोकथाम।'
                : 'Real-time booking schedule view to prevent double-booking and resolve fleet conflicts.'}
            </p>
          </div>

          {/* Vehicle filter dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800 font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="all">{isHindi ? 'सभी गाड़ियां (All Fleet)' : 'All Vehicles'}</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.plateNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-neutral-900">
            {isHindi ? monthNamesHi[month] : monthNamesEn[month]} {year}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700"
            >
              {isHindi ? 'आज (Today)' : 'Today'}
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mt-4 text-center text-xs font-bold text-neutral-500 py-2 border-b border-neutral-100">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 mt-2">
          {/* Leading empty cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[85px] sm:min-h-[105px] rounded-xl bg-neutral-50/40 p-1.5" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayBookings = reservationsByDay[dayNum] || [];
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === dayNum;
            const isSelected = selectedDay === dayNum;

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className={`min-h-[85px] sm:min-h-[105px] rounded-xl p-1.5 text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                    : isToday
                    ? 'border-neutral-300 bg-amber-50/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold rounded-md px-1.5 py-0.5 ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : isSelected
                        ? 'text-blue-700 font-black'
                        : 'text-neutral-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[10px] font-bold px-1 rounded-full bg-blue-100 text-blue-800">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                {/* Mini ride pills */}
                <div className="mt-1 space-y-1 w-full overflow-hidden">
                  {dayBookings.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      className="text-[9px] truncate px-1 py-0.5 rounded font-semibold bg-blue-100 text-blue-900 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span className="truncate">
                        {b.pickupTime} {b.dropoffLocation}
                      </span>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-[9px] text-neutral-500 font-bold px-1">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Bookings Detail & Conflict Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Reservations on selected day */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span>
                {isHindi ? `दिन ${selectedDay} की बुकिंग सूची` : `Trips Scheduled for Day ${selectedDay}`}
              </span>
            </h2>
            <span className="text-xs font-semibold text-neutral-500">
              {activeDayReservations.length} {isHindi ? 'सक्रिय यात्राएं' : 'active bookings'}
            </span>
          </div>

          {activeDayReservations.length === 0 ? (
            <div className="py-10 text-center text-neutral-500 text-xs space-y-2">
              <p>{isHindi ? 'इस दिन के लिए कोई बुकिंग निर्धारित नहीं है।' : 'No rides scheduled for this date.'}</p>
              <p className="text-emerald-600 font-semibold">
                ✓ {isHindi ? 'सभी गाड़ियां इस तिथि को उपलब्ध हैं।' : 'Entire fleet is open for new bookings.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDayReservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {res.id}
                      </span>
                      <span className="font-bold text-neutral-900 text-sm">
                        {res.pickupLocation} → {res.dropoffLocation}
                      </span>
                    </div>

                    <span
                      className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                        res.bookingStatus === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : res.bookingStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {res.bookingStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-neutral-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        Time: <strong>{res.pickupTime}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{res.vehicleName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        Passenger: {res.customerName} ({res.customerPhone})
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>
                      Fare: <strong>₹{res.totalAmount.toLocaleString()}</strong> ({res.paymentStatus.toUpperCase()})
                    </span>
                    <span>Created: {res.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Real-time Schedule Conflict Validator */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'कॉन्फ्लिक्ट परीक्षक' : 'Schedule Conflict Checker'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isHindi
                ? 'बुकिंग से पहले जांचें कि क्या गाड़ी पर पहले से कोई ट्रिप तय है।'
                : 'Instantly check if any fleet vehicle has a schedule overlap before confirming.'}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-600 font-semibold mb-1">
                {isHindi ? 'गाड़ी चुनें' : 'Select Vehicle'}
              </label>
              <select
                value={testVehicleId}
                onChange={(e) => setTestVehicleId(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.plateNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">
                  {isHindi ? 'तारीख' : 'Date'}
                </label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">
                  {isHindi ? 'समय' : 'Time'}
                </label>
                <input
                  type="time"
                  value={testTime}
                  onChange={(e) => setTestTime(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            {/* Test result banner */}
            <div className="pt-2">
              {testConflict.hasConflict ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-red-700">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{isHindi ? 'कॉन्फ्लिक्ट पाया गया!' : 'Scheduling Conflict Detected!'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This vehicle is already scheduled for trip #
                    <strong>{testConflict.conflictingReservation?.id}</strong> (
                    {testConflict.conflictingReservation?.pickupLocation} →{' '}
                    {testConflict.conflictingReservation?.dropoffLocation} at{' '}
                    {testConflict.conflictingReservation?.pickupTime}). Please assign another vehicle.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'शेड्यूल उपलब्ध है' : '100% Available — No Conflicts'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Vehicle is completely free at {testTime} on {testDate}. Booking can be safely accepted!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
