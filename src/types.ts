export type VehicleType = 'car' | 'auto' | 'erickshaw' | 'bus' | 'suv' | 'bike';

export type VehicleStatus = 'available' | 'booked' | 'maintenance' | 'on-trip';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  plateNumber: string;
  seats: number;
  luggageCapacity: number;
  hasAC: boolean;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'CNG';
  baseRate: number;
  ratePerKm: number;
  status: VehicleStatus;
  driverName: string;
  driverPhone: string;
  rating: number;
  currentLocation: string;
  mileage: string;
  features: string[];
}

export interface RouteFare {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  carFare: number;
  autoFare: number;
  erickshawFare: number;
  busFare: number;
  suvFare: number;
  bikeFare: number;
  lastUpdated: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type BookingStatus = 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate?: string;
  returnTime?: string;
  isRoundTrip: boolean;
  distanceKm: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTxnId?: string;
  bookingStatus: BookingStatus;
  createdAt: string;
  notes?: string;
  reminderSent?: boolean;
  cancelledAt?: string;
  refundAmount?: number;
  cancellationReason?: string;
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus = 'pending' | 'in-progress' | 'resolved';

export interface MaintenanceRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  issue: string;
  category: 'engine' | 'tyre' | 'brakes' | 'battery' | 'bodywork' | 'routine';
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reportedAt: string;
  resolvedAt?: string;
  estimatedCost: number;
  technicianName?: string;
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  mfaEnabled: boolean;
  savedAddresses: { id: string; label: string; address: string }[];
  emergencyContact: { name: string; phone: string; relation: string };
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingId?: string;
  category: 'booking' | 'payment' | 'cancellation' | 'driver' | 'other';
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  replyMessage?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'trip_reminder' | 'booking_confirm' | 'payment' | 'maintenance' | 'admin';
  timestamp: string;
  read: boolean;
  bookingId?: string;
}

export interface AdminContactInfo {
  name: string;
  role: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  supportEmail: string;
  officeAddress: string;
  cityState: string;
  operatingHours: string;
  emergencyHelpline: string;
}
