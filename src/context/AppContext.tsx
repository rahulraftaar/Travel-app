import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AdminContactInfo,
  MaintenanceRequest,
  NotificationItem,
  Reservation,
  RouteFare,
  SupportTicket,
  UserProfile,
  Vehicle,
} from '../types';
import {
  ADMIN_CONTACT,
  INITIAL_MAINTENANCE,
  INITIAL_RESERVATIONS,
  INITIAL_ROUTE_FARES,
  INITIAL_USER,
  INITIAL_VEHICLES,
} from '../data/initialData';

interface AppContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  adminContact: AdminContactInfo;

  // Navigation View
  currentView: 'book' | 'calendar' | 'bookings' | 'support' | 'profile' | 'admin';
  setCurrentView: (view: 'book' | 'calendar' | 'bookings' | 'support' | 'profile' | 'admin') => void;

  // Fleet & Routes
  vehicles: Vehicle[];
  routeFares: RouteFare[];
  updateRouteFare: (id: string, field: keyof RouteFare, value: number | string) => void;
  saveAllRouteFares: (fares: RouteFare[]) => void;
  updateVehicleStatus: (vehicleId: string, status: Vehicle['status']) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;

  // Bookings & Calendar
  reservations: Reservation[];
  createBooking: (data: Omit<Reservation, 'id' | 'createdAt' | 'bookingStatus'>) => Promise<Reservation>;
  cancelBooking: (id: string, reason: string) => { success: boolean; refundAmount: number; message: string };
  updateBookingStatus: (id: string, status: Reservation['bookingStatus'], notes?: string) => void;
  modifyReservation: (id: string, updates: Partial<Reservation>) => void;
  checkVehicleConflict: (
    vehicleId: string,
    pickupDate: string,
    pickupTime: string,
    returnDate?: string,
    returnTime?: string,
    excludeBookingId?: string
  ) => { hasConflict: boolean; conflictingReservation?: Reservation };

  // Maintenance
  maintenanceRequests: MaintenanceRequest[];
  addMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => void;
  updateMaintenanceStatus: (
    id: string,
    status: MaintenanceRequest['status'],
    technicianName?: string,
    estimatedCost?: number,
    notes?: string
  ) => void;

  // User & Auth & MFA
  user: UserProfile | null;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isMfaModalOpen: boolean;
  setIsMfaModalOpen: (val: boolean) => void;
  isMfaPromptOpen: boolean;
  setIsMfaPromptOpen: (val: boolean) => void;
  pendingLoginEmail: string | null;
  login: (email: string, pass: string) => Promise<{ requireMfa: boolean }>;
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  logout: () => void;
  toggleMfa: (enabled: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Support & Email simulation
  supportTickets: SupportTicket[];
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => Promise<SupportTicket>;
  replySupportTicket: (ticketId: string, reply: string) => void;

  // Push Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  sendPushNotification: (title: string, message: string, type?: NotificationItem['type'], bookingId?: string) => void;
  requestBrowserNotifications: () => Promise<boolean>;

  // Legal & Cookies
  cookieConsent: boolean;
  acceptCookies: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  VEHICLES: 'localride_vehicles_v1',
  ROUTE_FARES: 'localride_route_fares_v1',
  RESERVATIONS: 'localride_reservations_v1',
  MAINTENANCE: 'localride_maintenance_v1',
  USER: 'localride_user_v1',
  NOTIFICATIONS: 'localride_notifications_v1',
  SUPPORT: 'localride_support_v1',
  COOKIES: 'localride_cookie_consent_v1',
  LANG: 'localride_lang_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'hi'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as 'en' | 'hi') || 'en';
  });

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [routeFares, setRouteFares] = useState<RouteFare[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTE_FARES);
    return saved ? JSON.parse(saved) : INITIAL_ROUTE_FARES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'rk7739967090@gmail.com' || parsed.name === 'Rahul Kumar') {
          return INITIAL_USER;
        }
        return parsed;
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [currentView, setCurrentView] = useState<'book' | 'calendar' | 'bookings' | 'support' | 'profile' | 'admin'>('book');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState<boolean>(false);
  const [pendingLoginEmail, setPendingLoginEmail] = useState<string | null>(null);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPORT);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'TKT-801',
            name: 'Vikash Mishra',
            email: 'vikash.m@gmail.com',
            phone: '+91 91234 56789',
            bookingId: 'LR-29081',
            category: 'booking',
            subject: 'Confirm driver arrival time for Hasanpura pick-up',
            message: 'Need to make sure driver arrives sharp by 10:20 am near the marketplace.',
            status: 'resolved',
            createdAt: '2026-09-10 10:15',
            replyMessage: 'Driver Sanjay Kumar has been notified and will arrive 10 minutes ahead. Auto-assigned dispatch confirmed.',
          },
        ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'notif-1',
            title: 'Upcoming Ride Tomorrow',
            message: 'Trip LR-29081 from Hasanpura to Siwan starts at 10:30 AM tomorrow. Driver: Sanjay Kumar (+91 94312 88401).',
            type: 'trip_reminder',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            bookingId: 'LR-29081',
          },
          {
            id: 'notif-2',
            title: 'Secure Booking Confirmed',
            message: 'Payment of ₹1,200 verified successfully via UPI. Instant invoice ready.',
            type: 'payment',
            timestamp: 'Yesterday',
            read: true,
            bookingId: 'LR-29081',
          },
        ];
  });

  const [cookieConsent, setCookieConsent] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.COOKIES) === 'true';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTE_FARES, JSON.stringify(routeFares));
  }, [routeFares]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceRequests));
  }, [maintenanceRequests]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT, JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Push notification sender
  const sendPushNotification = useCallback(
    (title: string, message: string, type: NotificationItem['type'] = 'trip_reminder', bookingId?: string) => {
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title,
        message,
        type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        bookingId,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Trigger Web Browser Notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`LocalRide: ${title}`, {
            body: message,
            icon: '/favicon.ico',
          });
        } catch (err) {
          console.warn('Native notification suppressed:', err);
        }
      }
    },
    []
  );

  const requestBrowserNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendPushNotification('Push Notifications Active', 'You will receive real-time updates for ride bookings, driver arrival, and fleet alerts.');
      return true;
    }
    return false;
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Calendar conflict detection
  const checkVehicleConflict = useCallback(
    (
      vehicleId: string,
      pickupDate: string,
      pickupTime: string,
      returnDate?: string,
      returnTime?: string,
      excludeBookingId?: string
    ) => {
      const startDateTime = new Date(`${pickupDate}T${pickupTime || '00:00'}`).getTime();
      const endDateTime = returnDate
        ? new Date(`${returnDate}T${returnTime || '23:59'}`).getTime()
        : startDateTime + 4 * 60 * 60 * 1000; // default 4-hour window for one-way trip

      for (const res of reservations) {
        if (res.id === excludeBookingId) continue;
        if (res.vehicleId !== vehicleId) continue;
        if (res.bookingStatus === 'cancelled' || res.bookingStatus === 'completed') continue;

        const resStart = new Date(`${res.pickupDate}T${res.pickupTime}`).getTime();
        const resEnd = res.returnDate
          ? new Date(`${res.returnDate}T${res.returnTime || '23:59'}`).getTime()
          : resStart + 4 * 60 * 60 * 1000;

        // Overlap condition
        if (startDateTime < resEnd && endDateTime > resStart) {
          return { hasConflict: true, conflictingReservation: res };
        }
      }

      return { hasConflict: false };
    },
    [reservations]
  );

  // Route Fare Updater (Admin: भाड़ा अपडेट करें)
  const updateRouteFare = (id: string, field: keyof RouteFare, value: number | string) => {
    setRouteFares((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: value,
              lastUpdated: new Date().toLocaleString(),
            }
          : r
      )
    );
  };

  const saveAllRouteFares = (updatedFares: RouteFare[]) => {
    const timestamped = updatedFares.map((f) => ({
      ...f,
      lastUpdated: new Date().toLocaleString(),
    }));
    setRouteFares(timestamped);
    sendPushNotification('Route Fares Updated', 'New fares have been saved to local fleet dispatch storage.', 'admin');
  };

  // Fleet management
  const updateVehicleStatus = (vehicleId: string, status: Vehicle['status']) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status } : v))
    );
    sendPushNotification(
      'Fleet Status Updated',
      `Vehicle status changed to ${status.toUpperCase()}.`,
      'maintenance'
    );
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: 'veh-' + Date.now(),
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    sendPushNotification('New Vehicle Added', `${newVehicle.name} added to local fleet.`, 'admin');
  };

  const updateVehicle = (vehicleId: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, ...updates } : v))
    );
  };

  // Bookings
  const createBooking = async (data: Omit<Reservation, 'id' | 'createdAt' | 'bookingStatus'>): Promise<Reservation> => {
    const newId = `LR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReservation: Reservation = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      bookingStatus: 'confirmed',
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Update vehicle status to booked if current date
    const today = new Date().toISOString().slice(0, 10);
    if (data.pickupDate === today) {
      updateVehicleStatus(data.vehicleId, 'booked');
    }

    // Push notification
    sendPushNotification(
      'Booking Confirmed!',
      `Trip ${newId} (${data.pickupLocation} → ${data.dropoffLocation}) confirmed. Driver notified.`,
      'booking_confirm',
      newId
    );

    return newReservation;
  };

  const cancelBooking = (id: string, reason: string) => {
    const booking = reservations.find((r) => r.id === id);
    if (!booking) return { success: false, refundAmount: 0, message: 'Reservation not found' };

    // Calculate refund according to Cancellation Policy:
    // Trip within 2 hours: 80% refund (20% fee)
    // Trip > 2 hours away: 100% full refund
    const tripTime = new Date(`${booking.pickupDate}T${booking.pickupTime}`).getTime();
    const now = Date.now();
    const hoursLeft = (tripTime - now) / (1000 * 60 * 60);

    let refundPercentage = 1.0;
    if (hoursLeft < 0) {
      refundPercentage = 0.0; // Already started
    } else if (hoursLeft < 2) {
      refundPercentage = 0.85; // 15% late cancellation fee
    }

    const refundAmount = Math.round(booking.totalAmount * refundPercentage);

    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              bookingStatus: 'cancelled',
              paymentStatus: refundAmount > 0 ? 'refunded' : r.paymentStatus,
              cancelledAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              refundAmount,
              cancellationReason: reason,
            }
          : r
      )
    );

    // Free up vehicle
    setVehicles((prev) =>
      prev.map((v) => (v.id === booking.vehicleId && v.status === 'booked' ? { ...v, status: 'available' } : v))
    );

    sendPushNotification(
      'Ride Cancelled',
      `Booking ${id} was cancelled. Refund of ₹${refundAmount.toLocaleString()} initiated.`,
      'payment',
      id
    );

    return {
      success: true,
      refundAmount,
      message:
        refundAmount > 0
          ? `Booking cancelled successfully. Refund of ₹${refundAmount} has been credited via ${booking.paymentMethod.toUpperCase()}.`
          : 'Booking cancelled. No refund applicable for rides departing within standard minimum threshold.',
    };
  };

  const updateBookingStatus = (id: string, status: Reservation['bookingStatus'], notes?: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              bookingStatus: status,
              notes: notes ? `${r.notes || ''} | [Update]: ${notes}` : r.notes,
            }
          : r
      )
    );

    sendPushNotification('Booking Updated', `Reservation ${id} is now ${status.toUpperCase()}.`, 'admin', id);
  };

  const modifyReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    sendPushNotification('Reservation Modified', `Schedule / details for ${id} have been updated.`, 'admin', id);
  };

  // Maintenance
  const addMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => {
    const newReq: MaintenanceRequest = {
      ...req,
      id: `MN-${Math.floor(100 + Math.random() * 900)}`,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setMaintenanceRequests((prev) => [newReq, ...prev]);

    // Put vehicle in maintenance status
    updateVehicleStatus(req.vehicleId, 'maintenance');

    sendPushNotification(
      'Maintenance Logged',
      `${req.vehicleName} flagged for ${req.issue} (${req.priority.toUpperCase()} priority).`,
      'maintenance'
    );
  };

  const updateMaintenanceStatus = (
    id: string,
    status: MaintenanceRequest['status'],
    technicianName?: string,
    estimatedCost?: number,
    notes?: string
  ) => {
    const target = maintenanceRequests.find((m) => m.id === id);
    setMaintenanceRequests((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              technicianName: technicianName || m.technicianName,
              estimatedCost: estimatedCost !== undefined ? estimatedCost : m.estimatedCost,
              notes: notes || m.notes,
              resolvedAt: status === 'resolved' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
            }
          : m
      )
    );

    if (status === 'resolved' && target) {
      updateVehicleStatus(target.vehicleId, 'available');
      sendPushNotification('Maintenance Completed', `${target.vehicleName} is serviced and back in Available fleet.`, 'maintenance');
    }
  };

  // Auth & MFA
  const login = async (email: string, _pass: string): Promise<{ requireMfa: boolean }> => {
    setPendingLoginEmail(email);
    // Simulate user with MFA enabled
    setIsMfaModalOpen(true);
    return { requireMfa: true };
  };

  const verifyMfa = (code: string): boolean => {
    // Accepts any 6-digit code for simulation, or demo code 123456
    if (/^\d{6}$/.test(code.trim())) {
      const email = pendingLoginEmail || 'aakaashcommunication@gmail.com';
      const role = email.includes('admin') || isAdmin ? 'admin' : 'user';
      setUser({
        id: 'usr-' + Date.now(),
        name: email.includes('aakaash') ? 'Ratna deep' : email.split('@')[0].toUpperCase(),
        email,
        phone: '+91 97984 75673',
        role,
        mfaEnabled: true,
        savedAddresses: [
          { id: '1', label: 'Home', address: 'Main Road, Hasanpura, Siwan' },
          { id: '2', label: 'Station', address: 'Siwan Junction Railway Station' },
        ],
        emergencyContact: {
          name: 'Manoj Kumar',
          phone: '+91 94312 00998',
          relation: 'Brother',
        },
        createdAt: '2026-01-10',
      });
      setIsMfaModalOpen(false);
      setPendingLoginEmail(null);
      sendPushNotification('Secured Login Verified', 'MFA authentication successful. Welcome back to LocalRide.');
      return true;
    }
    return false;
  };

  const cancelMfa = () => {
    setIsMfaModalOpen(false);
    setPendingLoginEmail(null);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    sendPushNotification('Logged Out', 'You have been safely signed out.');
  };

  const toggleMfa = (enabled: boolean) => {
    if (!user) return;
    setUser({ ...user, mfaEnabled: enabled });
    sendPushNotification(
      enabled ? 'MFA Activated' : 'MFA Disabled',
      enabled ? '2-Factor OTP verification enabled for account logins.' : 'MFA is now inactive. Enable anytime for maximum safety.'
    );
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  // Support
  const submitSupportTicket = async (
    ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
  ): Promise<SupportTicket> => {
    const newTkt: SupportTicket = {
      ...ticket,
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'open',
    };

    setSupportTickets((prev) => [newTkt, ...prev]);

    // Send automated email confirmation simulation
    sendPushNotification(
      'Support Ticket Created',
      `Ticket #${newTkt.id} registered. Automated confirmation sent to ${ticket.email}. Support desk will reply shortly.`
    );

    return newTkt;
  };

  const replySupportTicket = (ticketId: string, reply: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, replyMessage: reply, status: 'resolved' } : t))
    );
    sendPushNotification('Support Desk Reply', `Ticket ${ticketId} has been answered by Admin.`, 'admin');
  };

  const acceptCookies = () => {
    setCookieConsent(true);
    localStorage.setItem(STORAGE_KEYS.COOKIES, 'true');
  };

  const resetAllData = () => {
    localStorage.clear();
    setVehicles(INITIAL_VEHICLES);
    setRouteFares(INITIAL_ROUTE_FARES);
    setReservations(INITIAL_RESERVATIONS);
    setMaintenanceRequests(INITIAL_MAINTENANCE);
    setUser(INITIAL_USER);
    setCookieConsent(false);
    sendPushNotification('Reset Complete', 'Default fleet and prototype data restored.');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        adminContact: ADMIN_CONTACT,
        currentView,
        setCurrentView,
        vehicles,
        routeFares,
        updateRouteFare,
        saveAllRouteFares,
        updateVehicleStatus,
        addVehicle,
        updateVehicle,
        reservations,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        modifyReservation,
        checkVehicleConflict,
        maintenanceRequests,
        addMaintenanceRequest,
        updateMaintenanceStatus,
        user,
        isAdmin,
        setIsAdmin,
        isMfaModalOpen,
        setIsMfaModalOpen,
        isMfaPromptOpen: isMfaModalOpen,
        setIsMfaPromptOpen: setIsMfaModalOpen,
        pendingLoginEmail,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        toggleMfa,
        updateProfile,
        supportTickets,
        submitSupportTicket,
        replySupportTicket,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        sendPushNotification,
        requestBrowserNotifications,
        cookieConsent,
        acceptCookies,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
