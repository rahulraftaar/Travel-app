import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RouteFare, Vehicle, VehicleType } from '../types';
import {
  AlertCircle,
  ArrowLeftRight,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Fuel,
  Info,
  Luggage,
  MapPin,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';

interface FareCalculatorProps {
  onSelectVehicleToBook?: (bookingDraft: {
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
  }) => void;
  onInitiateBooking?: (bookingDraft: {
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
  }) => void;
  onNavigateToAdminUpdater?: () => void;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({
  onSelectVehicleToBook,
  onInitiateBooking,
  onNavigateToAdminUpdater,
}) => {
  const { language, routeFares, vehicles, checkVehicleConflict, adminContact } = useApp();
  const isHindi = language === 'hi';

  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    routeFares.forEach((rf) => {
      locs.add(rf.from);
      locs.add(rf.to);
    });
    return Array.from(locs).sort();
  }, [routeFares]);

  const [fromLoc, setFromLoc] = useState<string>('Hasanpura');
  const [toLoc, setToLoc] = useState<string>('Siwan');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('car');
  const [pickupDate, setPickupDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [pickupTime, setPickupTime] = useState<string>('09:30');
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [returnDate, setReturnDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [returnTime, setReturnTime] = useState<string>('18:00');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Popular Quick Routes in Region
  const popularRoutes = [
    { from: 'Hasanpura', to: 'Siwan', label: 'Hasanpura ↔ Siwan', km: 22, popular: true },
    { from: 'Hasanpura', to: 'Chapra', label: 'Hasanpura ↔ Chapra', km: 45, popular: true },
    { from: 'Hasanpura', to: 'Patna', label: 'Hasanpura ↔ Patna Airport', km: 110, popular: false },
    { from: 'Siwan', to: 'Gopalganj', label: 'Siwan ↔ Gopalganj', km: 35, popular: false },
  ];

  const handleSelectQuickRoute = (from: string, to: string) => {
    setFromLoc(from);
    setToLoc(to);
  };

  const currentRoute = useMemo(() => {
    return routeFares.find(
      (rf) =>
        (rf.from.toLowerCase() === fromLoc.toLowerCase() &&
          rf.to.toLowerCase() === toLoc.toLowerCase()) ||
        (rf.from.toLowerCase() === toLoc.toLowerCase() &&
          rf.to.toLowerCase() === fromLoc.toLowerCase())
    );
  }, [routeFares, fromLoc, toLoc]);

  const distanceKm = currentRoute?.distanceKm || 25;

  const handleSwap = () => {
    const temp = fromLoc;
    setFromLoc(toLoc);
    setToLoc(temp);
  };

  const matchingVehicles = useMemo(() => {
    return vehicles.filter((v) => v.type === selectedVehicleType);
  }, [vehicles, selectedVehicleType]);

  React.useEffect(() => {
    if (matchingVehicles.length > 0) {
      const avail = matchingVehicles.find((v) => v.status === 'available') || matchingVehicles[0];
      setSelectedVehicleId(avail.id);
    } else {
      setSelectedVehicleId('');
    }
  }, [matchingVehicles]);

  const activeVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || matchingVehicles[0];
  }, [vehicles, selectedVehicleId, matchingVehicles]);

  // Conflict detection
  const conflictCheck = useMemo(() => {
    if (!activeVehicle) return { hasConflict: false };
    return checkVehicleConflict(activeVehicle.id, pickupDate, pickupTime, 3);
  }, [activeVehicle, pickupDate, pickupTime, checkVehicleConflict]);

  // Fare calculation
  const computedFare = useMemo(() => {
    let base = 0;
    if (currentRoute) {
      base =
        selectedVehicleType === 'auto'
          ? currentRoute.autoFare
          : selectedVehicleType === 'car'
          ? currentRoute.carFare
          : selectedVehicleType === 'suv'
          ? currentRoute.suvFare
          : currentRoute.vanFare;
    } else {
      const ratePerKm =
        selectedVehicleType === 'auto'
          ? 12
          : selectedVehicleType === 'car'
          ? 16
          : selectedVehicleType === 'suv'
          ? 22
          : 32;
      base = 150 + distanceKm * ratePerKm;
    }

    if (isRoundTrip) {
      base = Math.round(base * 1.85); // 15% round-trip discount
    }

    return base;
  }, [currentRoute, selectedVehicleType, distanceKm, isRoundTrip]);

  const handleProceedBooking = () => {
    if (!activeVehicle || conflictCheck.hasConflict) return;

    const draft = {
      vehicle: activeVehicle,
      fare: computedFare,
      from: fromLoc,
      to: toLoc,
      date: pickupDate,
      time: pickupTime,
      isRoundTrip,
      returnDate: isRoundTrip ? returnDate : undefined,
      returnTime: isRoundTrip ? returnTime : undefined,
      distanceKm: isRoundTrip ? distanceKm * 2 : distanceKm,
    };

    if (onSelectVehicleToBook) {
      onSelectVehicleToBook(draft);
    } else if (onInitiateBooking) {
      onInitiateBooking(draft);
    }
  };

  return (
    <div className="space-y-6">
      {/* Route & Booking Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
                Instant Fare Calculator
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Pricing Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
              {isHindi ? 'यात्रा रूट चुनें व तत्काल किराया जांचें' : 'Select Route & Instant Fare Calculator'}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-0.5">
              {isHindi
                ? 'सीवान, हसनपुरा और पटना के बीच अपनी सुविधानुसार वाहन चुनें और तुरंत सीट आरक्षित करें।'
                : 'Enter your route details to see transparent upfront pricing with zero hidden fees.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Direct Dispatch Hotline
              </span>
              <span className="text-sm sm:text-base font-extrabold text-blue-700">
                {adminContact.primaryPhone}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Popular Route Pills */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isHindi ? 'अक्सर चुने जाने वाले रूट (Quick Fill):' : 'Popular Local Routes (One-Click Selection):'}</span>
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {popularRoutes.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectQuickRoute(r.from, r.to)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  fromLoc === r.from && toLoc === r.to
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {r.label} ({r.km} km)
              </button>
            ))}
          </div>
        </div>

        {/* Pickup & Dropoff Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* From */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'पिकअप स्थान (Pickup Location)' : 'Pickup Location'}</span>
            </label>
            <div className="relative">
              <select
                id="pickup-location-select"
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl p-3.5 text-base font-bold text-slate-900 outline-none transition-all cursor-pointer"
              >
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-5 md:pt-6">
            <button
              id="swap-route-btn"
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-2xl border-2 border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-400 text-slate-700 hover:text-blue-600 shadow-sm transition-all"
              title="Swap pickup and destination"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-red-600" />
              <span>{isHindi ? 'ड्रॉपऑफ गंतव्य (Dropoff Destination)' : 'Dropoff Destination'}</span>
            </label>
            <div className="relative">
              <select
                id="dropoff-location-select"
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl p-3.5 text-base font-bold text-slate-900 outline-none transition-all cursor-pointer"
              >
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date, Time & Trip Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'पिकअप की तारीख' : 'Departure Date'}</span>
            </label>
            <input
              id="pickup-date-input"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl p-3 text-sm sm:text-base font-bold text-slate-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'पिकअप का समय' : 'Departure Time'}</span>
            </label>
            <input
              id="pickup-time-input"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl p-3 text-sm sm:text-base font-bold text-slate-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-bold text-slate-700 block">
              {isHindi ? 'यात्रा प्रकार' : 'Trip Type'}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
                  !isRoundTrip
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'एकतरफा (One Way)' : 'One Way'}
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`py-2.5 px-4 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
                  isRoundTrip
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'आना-जाना (Round Trip -15%)' : 'Round Trip (Save 15%)'}
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Category Selector Tabs */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wider">
              {isHindi ? 'वाहन श्रेणी चुनें (Vehicle Category)' : 'Choose Vehicle Category'}
            </label>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Distance: <strong className="text-slate-900">{isRoundTrip ? distanceKm * 2 : distanceKm} km</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'car',
                title: isHindi ? 'सेडान कार' : 'Sedan Cab',
                sub: 'Swift Dzire / Etios',
                capacity: '4 Passengers • 2 Bags',
                badge: 'Most Popular',
                icon: Car,
              },
              {
                id: 'suv',
                title: isHindi ? 'एसयूवी (SUV)' : 'Premium SUV',
                sub: 'Innova Crysta / Scorpio',
                capacity: '6-7 Passengers • 4 Bags',
                badge: 'Family & Luggage',
                icon: ShieldCheck,
              },
              {
                id: 'auto',
                title: isHindi ? 'ऑटो / ई-रिक्शा' : 'Eco Auto / E-Rickshaw',
                sub: 'Local Town Trips',
                capacity: '3-4 Passengers',
                badge: 'Lowest Fare',
                icon: Zap,
              },
              {
                id: 'van',
                title: isHindi ? 'टेंपो ट्रेवलर' : 'Tempo Traveler',
                sub: 'Force Traveler Bus',
                capacity: '12-17 Passengers',
                badge: 'Group & Outstation',
                icon: Bus,
              },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedVehicleType === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`select-cat-${cat.id}`}
                  onClick={() => setSelectedVehicleType(cat.id as VehicleType)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <div className="font-extrabold text-base text-slate-900">{cat.title}</div>
                  <div className="text-xs text-slate-500 font-medium">{cat.sub}</div>
                  <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cat.capacity}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Fleet Vehicles Cards in Selected Category */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {isHindi ? 'उपलब्ध गाड़ियां व ड्राइवर (Select Vehicle)' : 'Available Fleet Vehicles & Verified Drivers'}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● {matchingVehicles.length} vehicles in fleet
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {matchingVehicles.map((v) => {
              const isSelected = selectedVehicleId === v.id;
              const isAvailable = v.status === 'available';
              const isMaintenance = v.status === 'maintenance';

              return (
                <div
                  key={v.id}
                  onClick={() => {
                    if (!isMaintenance) setSelectedVehicleId(v.id);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                      : isMaintenance
                      ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base sm:text-lg text-slate-900">
                          {v.name}
                        </span>
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {v.plateNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {v.color} • Fuel: {v.fuelType.toUpperCase()} • Depot: {v.location}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isMaintenance
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  {/* Driver Details & Rating */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {v.driverName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{v.driverName}</div>
                        <div className="text-xs text-slate-500 font-medium">📞 {v.driverPhone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-600 font-black text-xs sm:text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{v.rating}</span>
                      <span className="text-slate-400 font-normal">({v.totalTrips}+ trips)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule Conflict Warning */}
        {conflictCheck.hasConflict && (
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-sm font-bold block">
                Scheduling Conflict Detected on {activeVehicle?.name}!
              </strong>
              <p className="text-xs sm:text-sm text-red-800">
                This vehicle already has a scheduled reservation: #{conflictCheck.conflictingReservation?.id} from{' '}
                {conflictCheck.conflictingReservation?.pickupLocation} to {conflictCheck.conflictingReservation?.dropoffLocation} around this time. Please choose another vehicle or select a different departure hour.
              </p>
            </div>
          </div>
        )}

        {/* High-Impact Fare & Checkout CTA Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-slate-300 uppercase font-bold tracking-wider flex items-center justify-center sm:justify-start gap-2">
              <span>{isRoundTrip ? 'Calculated Round-Trip Total' : 'Calculated One-Way Fare'}</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">
                Tolls & Fuel Included
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline justify-center sm:justify-start gap-2">
              <span>₹{computedFare.toLocaleString('en-IN')}</span>
              <span className="text-sm text-slate-400 font-normal">
                ({isRoundTrip ? distanceKm * 2 : distanceKm} km distance)
              </span>
            </div>

            <div className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2 pt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free Cancellation Guarantee up to 2 hours before trip</span>
            </div>
          </div>

          <button
            id="proceed-to-book-btn"
            type="button"
            disabled={!activeVehicle || conflictCheck.hasConflict}
            onClick={handleProceedBooking}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg shadow-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
              !activeVehicle || conflictCheck.hasConflict
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>{isHindi ? 'सुरक्षित चेकआउट व बुकिंग करें' : 'Proceed to Secure 256-Bit Checkout'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
