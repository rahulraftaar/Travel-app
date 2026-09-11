import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Send,
  ShieldAlert,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen?: boolean;
  onClose: () => void;
  onSelectBooking?: (bookingId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen = true,
  onClose,
  onSelectBooking,
}) => {
  const {
    language,
    notifications,
    markAllNotificationsRead,
    sendPushNotification,
    requestBrowserNotifications,
  } = useApp();

  const isHindi = language === 'hi';

  if (!isOpen) return null;

  const handleTriggerTestReminder = () => {
    sendPushNotification(
      'Upcoming Ride in 2 Hours',
      'Reminder: Your trip from Hasanpura to Siwan departs at 10:30 AM. Assigned Driver: Sanjay Kumar (+91 94312 88401). Please ensure you are at the pickup point on time.',
      'trip_reminder',
      'LR-29081'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">
                {isHindi ? 'पुश नोटिफिकेशन व अलर्ट' : 'Trip Reminders & Push Alerts'}
              </h2>
              <span className="text-[11px] text-neutral-500">
                {notifications.filter((n) => !n.read).length} unread updates
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 text-neutral-500 hover:text-blue-600 rounded-lg text-xs"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Permission Request & Test Banner */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={requestBrowserNotifications}
            className="text-blue-600 hover:underline font-bold text-[11px]"
          >
            Enable Device Push Alerts
          </button>
          <button
            onClick={handleTriggerTestReminder}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-xs"
          >
            Test Trip Reminder
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-neutral-100">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => {
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.bookingId && onSelectBooking) {
                      onSelectBooking(n.bookingId);
                    }
                  }}
                  className={`pt-3 first:pt-0 cursor-pointer transition-all ${
                    !n.read ? 'bg-blue-50/40 -mx-2 px-2 py-2 rounded-xl' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {n.type === 'trip_reminder' ? (
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : n.type === 'payment' ? (
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : n.type === 'maintenance' ? (
                        <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      )}
                      <h4 className="font-bold text-neutral-900 text-xs">{n.title}</h4>
                    </div>

                    <span className="text-[10px] text-neutral-400 shrink-0">{n.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{n.message}</p>

                  {n.bookingId && (
                    <span className="inline-block mt-1.5 text-[10px] font-mono font-bold text-blue-700 bg-white border border-blue-200 px-1.5 py-0.5 rounded">
                      Booking: {n.bookingId}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
