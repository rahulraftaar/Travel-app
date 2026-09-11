import React from 'react';
import { useApp } from '../context/AppContext';
import { Cookie, ShieldCheck } from 'lucide-react';

interface CookieBannerProps {
  onOpenPolicies: (tab: 'cookies' | 'terms' | 'cancellation' | 'payments') => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPolicies }) => {
  const { cookieConsent, acceptCookies, language } = useApp();
  const isHindi = language === 'hi';

  if (cookieConsent) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-xl z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 p-4 shadow-xl text-xs space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-neutral-900 text-xs">
            {isHindi ? 'कुकी और डेटा संग्रह नीति' : 'Cookie Policy & Data Collection Notice'}
          </h4>
          <p className="text-neutral-600 text-[11px] leading-relaxed">
            {isHindi
              ? 'हम सुरक्षित भुगतान, वाहन शेड्यूलिंग और यात्रा अलर्ट के लिए आवश्यक कुकीज़ और लोकल स्टोरेज का उपयोग करते हैं। '
              : 'We use necessary cookies and encrypted local storage for route fare caching, vehicle scheduling conflict detection, and secure payments. '}
            <button
              onClick={() => onOpenPolicies('cookies')}
              className="text-blue-600 underline font-semibold"
            >
              {isHindi ? 'कुकी व डेटा नियम पढ़ें' : 'Read Cookie & Data Terms'}
            </button>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-150">
        <button
          onClick={() => onOpenPolicies('cancellation')}
          className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 font-semibold text-[11px]"
        >
          {isHindi ? 'रद्दीकरण नीति' : 'Cancellation Policy'}
        </button>
        <button
          id="accept-cookies-btn"
          onClick={acceptCookies}
          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
        >
          {isHindi ? 'स्वीकार करें' : 'Accept All'}
        </button>
      </div>
    </div>
  );
};
