import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenancePriority, MaintenanceRequest, Reservation, Vehicle, VehicleStatus } from '../types';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Truck,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { AdminFareUpdater } from './AdminFareUpdater';

interface AdminDashboardProps {
  onOpenFareUpdater?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const {
    language,
    vehicles,
    updateVehicleStatus,
    addVehicle,
    reservations,
    updateBookingStatus,
    modifyReservation,
    cancelBooking,
    maintenanceRequests,
    addMaintenanceRequest,
    updateMaintenanceStatus,
    adminContact,
    supportTickets,
    replySupportTicket,
  } = useApp();

  const isHindi = language === 'hi';

  const [activeAdminTab, setActiveAdminTab] = useState<'reservations' | 'fleet' | 'maintenance' | 'fares' | 'support'>(
    'reservations'
  );

  // Reservation edit modal state
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [resEditStatus, setResEditStatus] = useState<Reservation['bookingStatus']>('confirmed');
  const [resEditTime, setResEditTime] = useState<string>('');
  const [resEditDate, setResEditDate] = useState<string>('');
  const [resEditNotes, setResEditNotes] = useState<string>('');

  // New Maintenance modal state
  const [showAddMaintenance, setShowAddMaintenance] = useState<boolean>(false);
  const [maintVehicleId, setMaintVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [maintIssue, setMaintIssue] = useState<string>('');
  const [maintCategory, setMaintCategory] = useState<MaintenanceRequest['category']>('routine');
  const [maintPriority, setMaintPriority] = useState<MaintenancePriority>('medium');
  const [maintCost, setMaintCost] = useState<number>(1500);
  const [maintGarage, setMaintGarage] = useState<string>('Munna Auto Garage, Siwan');
  const [maintNotes, setMaintNotes] = useState<string>('');

  // Add vehicle modal
  const [showAddVehicle, setShowAddVehicle] = useState<boolean>(false);
  const [newVehName, setNewVehName] = useState('');
  const [newVehType, setNewVehType] = useState<Vehicle['type']>('car');
  const [newVehPlate, setNewVehPlate] = useState('BR-29-');
  const [newVehSeats, setNewVehSeats] = useState(4);
  const [newVehDriver, setNewVehDriver] = useState('');
  const [newVehPhone, setNewVehPhone] = useState('+91 ');
  const [newVehFuel, setNewVehFuel] = useState<Vehicle['fuelType']>('CNG');

  // Support ticket reply
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics
  const activeBookingsCount = reservations.filter(
    (r) => r.bookingStatus === 'confirmed' || r.bookingStatus === 'active'
  ).length;
  const availableVehiclesCount = vehicles.filter((v) => v.status === 'available').length;
  const maintenanceCount = maintenanceRequests.filter((m) => m.status !== 'resolved').length;
  const totalRevenue = reservations
    .filter((r) => r.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handleOpenEditRes = (res: Reservation) => {
    setEditingReservation(res);
    setResEditStatus(res.bookingStatus);
    setResEditDate(res.pickupDate);
    setResEditTime(res.pickupTime);
    setResEditNotes(res.notes || '');
  };

  const handleSaveResEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;

    modifyReservation(editingReservation.id, {
      bookingStatus: resEditStatus,
      pickupDate: resEditDate,
      pickupTime: resEditTime,
      notes: resEditNotes,
    });

    setEditingReservation(null);
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVeh = vehicles.find((v) => v.id === maintVehicleId);
    if (!targetVeh || !maintIssue.trim()) return;

    addMaintenanceRequest({
      vehicleId: targetVeh.id,
      vehicleName: targetVeh.name,
      plateNumber: targetVeh.plateNumber,
      issue: maintIssue,
      category: maintCategory,
      priority: maintPriority,
      status: 'pending',
      estimatedCost: maintCost,
      technicianName: maintGarage,
      notes: maintNotes,
    });

    setShowAddMaintenance(false);
    setMaintIssue('');
    setMaintNotes('');
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehName.trim()) return;

    addVehicle({
      name: newVehName,
      type: newVehType,
      plateNumber: newVehPlate,
      seats: newVehSeats,
      luggageCapacity: 3,
      hasAC: true,
      fuelType: newVehFuel,
      baseRate: 350,
      ratePerKm: 14,
      status: 'available',
      driverName: newVehDriver || 'Assigned Driver',
      driverPhone: newVehPhone || '+91 97984 75673',
      rating: 4.8,
      currentLocation: 'Hasanpura Depot',
      mileage: '20 km/l',
      features: ['Air Conditioned', 'Clean Interior', 'GPS Tracked'],
    });

    setShowAddVehicle(false);
    setNewVehName('');
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    replySupportTicket(ticketId, replyText);
    setReplyTicketId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Operations Banner */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md border border-neutral-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                Operations Control Center
              </span>
              <span className="text-xs text-neutral-400">Siwan & Hasanpura Fleet Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              {isHindi ? 'व्यवस्थापक नियंत्रण केंद्र (Admin Portal)' : 'Fleet Administrator Dashboard'}
            </h1>
          </div>

          {/* Prominent Admin Contact Details Pill */}
          <div className="bg-neutral-800/80 p-3 rounded-xl border border-neutral-700 text-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-neutral-400 text-[10px]">Head Admin Contact</div>
              <div className="font-bold text-white text-sm">{adminContact.name}</div>
              <div className="text-emerald-400 font-mono text-xs">
                {adminContact.primaryPhone} | {adminContact.email}
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800 text-xs">
          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60">
            <span className="text-neutral-400 block font-medium">
              {isHindi ? 'सक्रिय बुकिंग (Active)' : 'Active Bookings'}
            </span>
            <span className="text-2xl font-black text-blue-400 mt-0.5 block">{activeBookingsCount}</span>
            <span className="text-[10px] text-neutral-400">Scheduled for transport</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60">
            <span className="text-neutral-400 block font-medium">
              {isHindi ? 'उपलब्ध गाड़ियां (Fleet)' : 'Available Fleet'}
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-0.5 block">
              {availableVehiclesCount} / {vehicles.length}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Ready for dispatch</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60">
            <span className="text-neutral-400 block font-medium">
              {isHindi ? 'मेंटेनेंस रिक्वेस्ट (Maintenance)' : 'Active Maintenance'}
            </span>
            <span className="text-2xl font-black text-amber-400 mt-0.5 block">{maintenanceCount}</span>
            <span className="text-[10px] text-amber-400 font-medium">In garage or pending</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60">
            <span className="text-neutral-400 block font-medium">
              {isHindi ? 'कुल संग्रह (Revenue)' : 'Total Revenue'}
            </span>
            <span className="text-2xl font-black text-purple-400 mt-0.5 block">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-neutral-400">Paid rides collected</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAdminTab('reservations')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'reservations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{isHindi ? 'सक्रिय बुकिंग्स (' + reservations.length + ')' : 'Bookings (' + reservations.length + ')'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('fleet')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'fleet'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isHindi ? 'फ्लीट व उपलब्धता (' + vehicles.length + ')' : 'Fleet Availability (' + vehicles.length + ')'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('maintenance')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'maintenance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{isHindi ? 'मेंटेनेंस रिक्वेस्ट्स (' + maintenanceCount + ')' : 'Maintenance Requests (' + maintenanceCount + ')'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('fares')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'fares'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>⚙️ {isHindi ? 'भाड़ा अपडेट (Rates)' : 'Fare Rate Editor'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('support')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'support'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isHindi ? 'सपोर्ट टिकट (' + supportTickets.length + ')' : 'Customer Support (' + supportTickets.length + ')'}</span>
        </button>
      </div>

      {/* TAB 1: RESERVATIONS TRACKING & MODIFICATION */}
      {activeAdminTab === 'reservations' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {isHindi ? 'सक्रिय व पूर्व बुकिंग प्रबंधन' : 'Reservations Dispatch & Tracking'}
              </h2>
              <p className="text-xs text-neutral-500">
                {isHindi
                  ? 'बुकिंग स्थिति बदलें, समय बदलें, ड्राइवर रीअसाइन करें या रद्द करें।'
                  : 'Track live rides, modify trip schedule, reassign fleet vehicles, or process cancellations.'}
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder={isHindi ? 'खोजें (नाम, आईडी, शहर)...' : 'Search by ID, customer, city...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-bold">
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Passenger</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Vehicle & Driver</th>
                  <th className="p-3">Schedule</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reservations
                  .filter((r) => {
                    if (!searchTerm) return true;
                    const q = searchTerm.toLowerCase();
                    return (
                      r.id.toLowerCase().includes(q) ||
                      r.customerName.toLowerCase().includes(q) ||
                      r.pickupLocation.toLowerCase().includes(q) ||
                      r.dropoffLocation.toLowerCase().includes(q)
                    );
                  })
                  .map((res) => {
                    return (
                      <tr key={res.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-700">{res.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-neutral-900">{res.customerName}</div>
                          <div className="text-[11px] text-neutral-500">{res.customerPhone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-neutral-800">
                            {res.pickupLocation} → {res.dropoffLocation}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {res.isRoundTrip ? 'Round Trip' : 'One Way'}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-neutral-800">{res.vehicleName}</div>
                          <div className="text-[10px] text-neutral-500 uppercase">{res.vehicleType}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-neutral-900">{res.pickupDate}</div>
                          <div className="text-[11px] text-neutral-500">{res.pickupTime}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-neutral-900">₹{res.totalAmount}</div>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              res.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.paymentStatus === 'refunded'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {res.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              res.bookingStatus === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : res.bookingStatus === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.bookingStatus === 'completed'
                                ? 'bg-neutral-100 text-neutral-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {res.bookingStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenEditRes(res)}
                            className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-[11px] transition-colors"
                          >
                            Modify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FLEET & VEHICLE AVAILABILITY */}
      {activeAdminTab === 'fleet' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {isHindi ? 'गाड़ियों की रीयल-टाइम उपलब्धता प्रबंधन' : 'Fleet Availability & Vehicle Manager'}
              </h2>
              <p className="text-xs text-neutral-500">
                {isHindi
                  ? 'गाड़ी की स्थिति (उपलब्ध, बुक, मेंटेनेंस, ऑन-ट्रिप) तुरंत बदलें।'
                  : 'Toggle vehicle availability statuses in real-time or add new fleet vehicles.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddVehicle(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? 'नया वाहन जोड़ें' : 'Add Fleet Vehicle'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => {
              return (
                <div
                  key={v.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 transition-all space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 text-sm">{v.name}</div>
                      <div className="font-mono text-neutral-500 text-[11px]">{v.plateNumber}</div>
                    </div>
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                      {v.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-neutral-600">
                    <div>
                      Seats: <strong>{v.seats}</strong>
                    </div>
                    <div>
                      Fuel: <strong>{v.fuelType}</strong>
                    </div>
                    <div>
                      Driver: <strong>{v.driverName}</strong>
                    </div>
                    <div>
                      Phone: <strong>{v.driverPhone}</strong>
                    </div>
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="pt-2 border-t border-neutral-200">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                      Set Real-Time Status:
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['available', 'booked', 'maintenance', 'on-trip'] as VehicleStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateVehicleStatus(v.id, st)}
                          className={`py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                            v.status === st
                              ? st === 'available'
                                ? 'bg-emerald-600 text-white'
                                : st === 'booked'
                                ? 'bg-blue-600 text-white'
                                : st === 'maintenance'
                                ? 'bg-amber-600 text-white'
                                : 'bg-purple-600 text-white'
                              : 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300'
                          }`}
                        >
                          {st === 'maintenance' ? 'Maint' : st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE REQUESTS MONITOR */}
      {activeAdminTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {isHindi ? 'रीयल-टाइम मेंटेनेंस अनुरोध मॉनिटर' : 'Real-time Maintenance & Fleet Health'}
              </h2>
              <p className="text-xs text-neutral-500">
                {isHindi
                  ? 'सर्विसिंग, टायर पंचर, ब्रेक या बैटरी संबंधी खराबी को दर्ज व ट्रैक करें।'
                  : 'Log and monitor repairs, garage estimates, and put vehicles into maintenance.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddMaintenance(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? 'मेंटेनेंस दर्ज करें' : 'Log Maintenance'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {maintenanceRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {req.id}
                    </span>
                    <span className="font-bold text-neutral-900 text-sm">
                      {req.vehicleName} ({req.plateNumber})
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded-full ${
                        req.priority === 'critical' || req.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.priority} priority
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['pending', 'in-progress', 'resolved'] as MaintenanceRequest['status'][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateMaintenanceStatus(req.id, st)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-colors ${
                          req.status === st
                            ? st === 'resolved'
                              ? 'bg-emerald-600 text-white'
                              : st === 'in-progress'
                              ? 'bg-blue-600 text-white'
                              : 'bg-amber-600 text-white'
                            : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-neutral-800 font-medium">{req.issue}</div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 flex-wrap gap-2">
                  <span>
                    Garage: <strong className="text-neutral-800">{req.technicianName}</strong>
                  </span>
                  <span>
                    Est. Cost: <strong className="text-neutral-800">₹{req.estimatedCost}</strong>
                  </span>
                  <span>Reported: {req.reportedAt}</span>
                  {req.resolvedAt && (
                    <span className="text-emerald-700 font-bold">Resolved: {req.resolvedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ROUTE FARE UPDATER */}
      {activeAdminTab === 'fares' && <AdminFareUpdater />}

      {/* TAB 5: SUPPORT TICKETS */}
      {activeAdminTab === 'support' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h2 className="text-base font-bold text-neutral-900">
              {isHindi ? 'ग्राहक सहायता पूछताछ व ईमेल जवाब' : 'Customer Support Inquiries & Automated Email Responder'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isHindi
                ? 'ग्राहकों के सवालों के जवाब दें — स्वचालित रूप से पुष्टि ईमेल तैयार होता है।'
                : 'Review tickets submitted via the customer contact form and reply with automated email notices.'}
            </p>
          </div>

          <div className="space-y-4">
            {supportTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {tkt.id}
                    </span>
                    <span className="font-bold text-neutral-900">{tkt.name}</span>
                    <span className="text-neutral-500">({tkt.email})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      tkt.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>

                <div className="font-semibold text-neutral-800">
                  {tkt.subject} ({tkt.category})
                </div>
                <div className="text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200/80">
                  "{tkt.message}"
                </div>

                {tkt.replyMessage ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1">
                    <div className="font-bold text-[11px] text-blue-800 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Admin Reply Dispatched to Customer:</span>
                    </div>
                    <p className="text-xs">{tkt.replyMessage}</p>
                  </div>
                ) : (
                  <div className="pt-2">
                    {replyTicketId === tkt.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type resolution message..."
                          className="w-full border border-neutral-300 rounded-lg p-2 text-xs outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendTicketReply(tkt.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                          >
                            Send Email & Resolve
                          </button>
                          <button
                            onClick={() => setReplyTicketId(null)}
                            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyTicketId(tkt.id);
                          setReplyText(
                            `Hello ${tkt.name}, we have reviewed your request regarding ${tkt.subject}. Our dispatch manager has resolved this issue.`
                          );
                        }}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        Reply & Send Email
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Contact Details Card (prominently required by user prompt) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-blue-600" />
          <span>{isHindi ? 'व्यवस्थापक संपर्क विवरण (Admin Official Contact)' : 'Fleet Administrator Contact & HQ'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-neutral-500 font-medium">Head Administrator:</span>
            <div className="font-bold text-neutral-900 text-sm">{adminContact.name}</div>
            <div className="text-neutral-600">{adminContact.role}</div>
            <div className="pt-2 text-blue-700 font-bold">
              Call: <a href={`tel:${adminContact.primaryPhone.replace(/\s+/g, '')}`}>{adminContact.primaryPhone}</a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-neutral-500 font-medium">Direct WhatsApp & Email:</span>
            <div className="font-bold text-emerald-700 text-sm">
              WhatsApp: {adminContact.whatsappNumber}
            </div>
            <div className="text-neutral-700">Email: {adminContact.email}</div>
            <div className="pt-2 text-neutral-500">{adminContact.operatingHours}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="text-neutral-500 font-medium">Headquarters Address:</span>
            <div className="font-bold text-neutral-900">{adminContact.officeAddress}</div>
            <div className="text-neutral-600">{adminContact.cityState}</div>
            <div className="pt-2 text-red-600 font-bold">{adminContact.emergencyHelpline}</div>
          </div>
        </div>
      </div>

      {/* MODAL: EDIT RESERVATION */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">
                Modify Reservation #{editingReservation.id}
              </h3>
              <button onClick={() => setEditingReservation(null)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-700" />
              </button>
            </div>

            <form onSubmit={handleSaveResEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Status</label>
                <select
                  value={resEditStatus}
                  onChange={(e) => setResEditStatus(e.target.value as Reservation['bookingStatus'])}
                  className="w-full border border-neutral-300 rounded-lg p-2 font-semibold"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active (On Trip)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={resEditDate}
                    onChange={(e) => setResEditDate(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    value={resEditTime}
                    onChange={(e) => setResEditTime(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Admin Dispatch Notes</label>
                <textarea
                  rows={3}
                  value={resEditNotes}
                  onChange={(e) => setResEditNotes(e.target.value)}
                  placeholder="e.g. Driver Ramesh assigned, pickup at Hasanpura petrol pump."
                  className="w-full border border-neutral-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    cancelBooking(editingReservation.id, 'Admin cancellation via dispatch');
                    setEditingReservation(null);
                  }}
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100"
                >
                  Cancel Booking & Refund
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReservation(null)}
                    className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG MAINTENANCE */}
      {showAddMaintenance && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Log Vehicle Maintenance Request</h3>
              <button onClick={() => setShowAddMaintenance(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-700" />
              </button>
            </div>

            <form onSubmit={handleCreateMaintenance} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Vehicle</label>
                <select
                  value={maintVehicleId}
                  onChange={(e) => setMaintVehicleId(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plateNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Reported Issue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Front brake pads squeak, AC gas refill..."
                  value={maintIssue}
                  onChange={(e) => setMaintIssue(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Category</label>
                  <select
                    value={maintCategory}
                    onChange={(e) => setMaintCategory(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  >
                    <option value="routine">Routine Service</option>
                    <option value="brakes">Brakes</option>
                    <option value="tyre">Tyre</option>
                    <option value="battery">Battery / EV</option>
                    <option value="engine">Engine</option>
                    <option value="bodywork">Bodywork</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Priority</label>
                  <select
                    value={maintPriority}
                    onChange={(e) => setMaintPriority(e.target.value as MaintenancePriority)}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={maintCost}
                    onChange={(e) => setMaintCost(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Garage / Mechanic</label>
                  <input
                    type="text"
                    value={maintGarage}
                    onChange={(e) => setMaintGarage(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMaintenance(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg"
                >
                  Log Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FLEET VEHICLE */}
      {showAddVehicle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Add New Fleet Vehicle</h3>
              <button onClick={() => setShowAddVehicle(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-700" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-semibold mb-1">Vehicle Name / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maruti Ertiga ZXi"
                  value={newVehName}
                  onChange={(e) => setNewVehName(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Category</label>
                  <select
                    value={newVehType}
                    onChange={(e) => setNewVehType(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                  >
                    <option value="car">Car (Sedan/Hatchback)</option>
                    <option value="suv">SUV (7-Seater)</option>
                    <option value="auto">Auto-Rickshaw</option>
                    <option value="erickshaw">E-Rickshaw</option>
                    <option value="bus">Mini Bus / Traveller</option>
                    <option value="bike">Bike / Scooter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Plate Number</label>
                  <input
                    type="text"
                    required
                    value={newVehPlate}
                    onChange={(e) => setNewVehPlate(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Passenger Seats</label>
                  <input
                    type="number"
                    value={newVehSeats}
                    onChange={(e) => setNewVehSeats(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Fuel Type</label>
                  <select
                    value={newVehFuel}
                    onChange={(e) => setNewVehFuel(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  >
                    <option value="CNG">CNG</option>
                    <option value="EV">Electric (EV)</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    placeholder="Driver full name"
                    value={newVehDriver}
                    onChange={(e) => setNewVehDriver(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-semibold mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={newVehPhone}
                    onChange={(e) => setNewVehPhone(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
