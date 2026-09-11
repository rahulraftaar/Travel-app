import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RouteFare } from '../types';
import {
  Check,
  CheckCircle2,
  Database,
  Plus,
  RefreshCw,
  Save,
  Sliders,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface AdminFareUpdaterProps {
  onBackToBooking?: () => void;
}

export const AdminFareUpdater: React.FC<AdminFareUpdaterProps> = ({ onBackToBooking }) => {
  const { language, routeFares, saveAllRouteFares, adminContact } = useApp();
  const isHindi = language === 'hi';

  // Local draft state for bulk editing
  const [draftFares, setDraftFares] = useState<RouteFare[]>(() => JSON.parse(JSON.stringify(routeFares)));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);

  // New route form
  const [newFrom, setNewFrom] = useState('Hasanpura');
  const [newTo, setNewTo] = useState('');
  const [newDist, setNewDist] = useState(25);
  const [newBus, setNewBus] = useState(50);
  const [newAuto, setNewAuto] = useState(80);
  const [newErick, setNewErick] = useState(70);
  const [newCar, setNewCar] = useState(1500);
  const [newSuv, setNewSuv] = useState(2000);
  const [newBike, setNewBike] = useState(200);

  const handleFareChange = (
    id: string,
    field: 'busFare' | 'autoFare' | 'erickshawFare' | 'carFare' | 'suvFare' | 'bikeFare',
    val: string
  ) => {
    const num = parseInt(val, 10) || 0;
    setDraftFares((prev) =>
      prev.map((rf) => (rf.id === id ? { ...rf, [field]: num } : rf))
    );
    setSavedSuccess(false);
  };

  const handleSaveAll = () => {
    saveAllRouteFares(draftFares);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const handleAddNewRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTo.trim()) return;

    const newRoute: RouteFare = {
      id: 'rf-' + Date.now(),
      from: newFrom.trim(),
      to: newTo.trim(),
      distanceKm: newDist,
      busFare: newBus,
      autoFare: newAuto,
      erickshawFare: newErick,
      carFare: newCar,
      suvFare: newSuv,
      bikeFare: newBike,
      lastUpdated: new Date().toLocaleString(),
    };

    const updated = [newRoute, ...draftFares];
    setDraftFares(updated);
    saveAllRouteFares(updated);
    setShowAddRouteModal(false);
    setNewTo('');
    setSavedSuccess(true);
  };

  const handleDeleteRoute = (id: string) => {
    if (confirm(isHindi ? 'क्या आप इस रूट को हटाना चाहते हैं?' : 'Remove this route?')) {
      const updated = draftFares.filter((f) => f.id !== id);
      setDraftFares(updated);
      saveAllRouteFares(updated);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Admin Header Box matching screenshot: ⚙️ Admin: भाड़ा अपडेट करें */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label="settings">
              ⚙️
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                {isHindi ? 'Admin: भाड़ा अपडेट करें' : 'Admin: Update Route Fares'}
              </h1>
              {/* Notice text matching user's image: "Demo prototype में बदलाव इसी browser में save होंगे।" */}
              <p className="text-xs text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {isHindi
                    ? 'Demo prototype में बदलाव इसी browser में save होंगे।'
                    : 'Changes in demo prototype are saved directly in this browser local storage.'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddRouteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'नया रूट जोड़ें' : 'Add Route'}</span>
            </button>
          </div>
        </div>

        {/* Success toast banner */}
        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isHindi
                ? 'सभी रूट के भाड़ा रेट सफलतापूर्वक सेव कर दिए गए हैं!'
                : 'All route fares and rates have been saved successfully to fleet database!'}
            </span>
          </div>
        )}

        {/* Route Fares Editor List - closely styled to images 2 & 3 */}
        <div className="mt-5 space-y-4">
          {draftFares.map((route) => {
            return (
              <div
                key={route.id}
                className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/40 hover:bg-white hover:border-neutral-300 transition-all space-y-2.5"
              >
                {/* Route Destination Title */}
                <div className="flex items-center justify-between">
                  <div className="font-bold text-neutral-900 text-base flex items-center gap-2">
                    <span className="text-blue-600">{route.to}</span>
                    <span className="text-xs font-normal text-neutral-400">
                      ({route.from} → {route.to}, ~{route.distanceKm} km)
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteRoute(route.id)}
                    className="p-1 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                    title="Delete Route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 2-column or 4-column inputs matching the phone screen layout */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {/* Bus */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-600 block">
                      🚌 {isHindi ? 'बस' : 'Bus'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={route.busFare}
                        onChange={(e) => handleFareChange(route.id, 'busFare', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Auto */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-600 block">
                      🛺 {isHindi ? 'ऑटो' : 'Auto'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={route.autoFare}
                        onChange={(e) => handleFareChange(route.id, 'autoFare', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* E-Rickshaw */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-600 block">
                      🛵 {isHindi ? 'ई-रिक्शा' : 'E-Rickshaw'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={route.erickshawFare}
                        onChange={(e) => handleFareChange(route.id, 'erickshawFare', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Car (1200 Rs) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-600 block">
                      🚗 {isHindi ? 'कार (Car)' : 'Car / Cab'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={route.carFare}
                        onChange={(e) => handleFareChange(route.id, 'carFare', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-blue-400 rounded-lg text-blue-800 font-black focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional optional SUV / Bike secondary row */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">🚙 SUV:</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1 text-neutral-400">₹</span>
                      <input
                        type="number"
                        value={route.suvFare}
                        onChange={(e) => handleFareChange(route.id, 'suvFare', e.target.value)}
                        className="w-full pl-5 pr-2 py-1 bg-white border border-neutral-200 rounded text-neutral-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">🏍️ Bike:</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1 text-neutral-400">₹</span>
                      <input
                        type="number"
                        value={route.bikeFare}
                        onChange={(e) => handleFareChange(route.id, 'bikeFare', e.target.value)}
                        className="w-full pl-5 pr-2 py-1 bg-white border border-neutral-200 rounded text-neutral-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Blue Button matching screenshot: "रेट सेव करें" */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <button
            id="btn-save-rates"
            type="button"
            onClick={handleSaveAll}
            className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>{isHindi ? 'रेट सेव करें' : 'Save Rates Now'}</span>
          </button>
        </div>
      </div>

      {/* Add New Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              {isHindi ? 'नया लोकल रूट जोड़ें' : 'Add New Local Route'}
            </h3>
            <form onSubmit={handleAddNewRoute} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    {isHindi ? 'कहाँ से (From)' : 'Origin'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newFrom}
                    onChange={(e) => setNewFrom(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    {isHindi ? 'कहाँ तक (To)' : 'Destination'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mairwa / Ekma"
                    value={newTo}
                    onChange={(e) => setNewTo(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Distance (km)</label>
                <input
                  type="number"
                  required
                  value={newDist}
                  onChange={(e) => setNewDist(parseInt(e.target.value, 10) || 0)}
                  className="w-full border border-neutral-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Bus (₹)</label>
                  <input
                    type="number"
                    value={newBus}
                    onChange={(e) => setNewBus(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Auto (₹)</label>
                  <input
                    type="number"
                    value={newAuto}
                    onChange={(e) => setNewAuto(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">E-Rick (₹)</label>
                  <input
                    type="number"
                    value={newErick}
                    onChange={(e) => setNewErick(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Car (₹)</label>
                  <input
                    type="number"
                    value={newCar}
                    onChange={(e) => setNewCar(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">SUV (₹)</label>
                  <input
                    type="number"
                    value={newSuv}
                    onChange={(e) => setNewSuv(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Bike (₹)</label>
                  <input
                    type="number"
                    value={newBike}
                    onChange={(e) => setNewBike(parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-neutral-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 font-semibold text-neutral-700"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  {isHindi ? 'रूट सेव करें' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
