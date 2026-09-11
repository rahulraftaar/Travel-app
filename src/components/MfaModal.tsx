import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';

interface MfaModalProps {
  onClose: () => void;
}

export const MfaModal: React.FC<MfaModalProps> = ({ onClose }) => {
  const { language, verifyMfa, pendingLoginEmail, cancelMfa } = useApp();
  const isHindi = language === 'hi';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCountdown, setResendCountdown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
    setErrorMsg('');

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMsg(isHindi ? 'कृपया पूरा 6-अंकों का कोड दर्ज करें।' : 'Please enter the full 6-digit MFA security code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const success = verifyMfa(code);
      setIsVerifying(false);
      if (success) {
        onClose();
      } else {
        setErrorMsg(isHindi ? 'अमान्य कोड। कृपया 123456 या कोई भी 6 अंक दर्ज करें।' : 'Invalid verification code. Please enter 123456 for demo.');
      }
    }, 800);
  };

  const handleUseDemoCode = () => {
    const demo = ['1', '2', '3', '4', '5', '6'];
    setOtp(demo);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative">
        <button
          onClick={() => {
            cancelMfa();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
              {isHindi ? 'मल्टी-फैक्टर प्रमाणीकरण (MFA)' : 'Two-Factor Authentication (MFA)'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isHindi
                ? 'अधिकतम खाता सुरक्षा के लिए आपके पंजीकृत मोबाइल/ईमेल पर भेजा गया 6-अंकों का सत्यापन कोड दर्ज करें।'
                : 'For maximum account security, enter the 6-digit one-time code sent to your authenticator or device.'}
            </p>
          </div>

          <div className="text-xs font-semibold text-blue-700 bg-blue-50 py-1.5 px-3 rounded-lg inline-block border border-blue-200">
            {pendingLoginEmail || 'aakaashcommunication@gmail.com'}
          </div>
        </div>

        <form onSubmit={handleVerify} className="mt-6 space-y-5 text-xs">
          {/* 6 Digit Inputs */}
          <div>
            <label className="block text-center text-neutral-600 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              Enter 6-Digit Security PIN
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-11 h-12 text-center text-xl font-black font-mono border-2 border-neutral-300 focus:border-blue-600 focus:bg-blue-50/50 rounded-xl outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Helper */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <button
              type="button"
              onClick={handleUseDemoCode}
              className="text-blue-600 hover:text-blue-700 font-bold underline"
            >
              Fill Demo Code (123456)
            </button>

            <span>
              {resendCountdown > 0 ? (
                `Resend in ${resendCountdown}s`
              ) : (
                <button
                  type="button"
                  onClick={() => setResendCountdown(45)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Resend OTP
                </button>
              )}
            </span>
          </div>

          <button
            id="verify-mfa-submit-btn"
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>{isHindi ? 'सुरक्षित सत्यापित करें' : 'Verify & Sign In Safely'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
