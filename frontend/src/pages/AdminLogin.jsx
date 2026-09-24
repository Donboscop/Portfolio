import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, Hash, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import '../components/CustomAnimation.css';

const AdminLogin = () => {
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid administrator email.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    const result = await sendOtp(email);
    setLoading(false);

    if (result.success) {
      setIsOtpSent(true);
      setStatusMessage(result.message || 'Verification code generated! Please check your email.');
    } else {
      setError(result.message || 'Verification failed. Please check your backend connection.');
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Invalid or expired verification code.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center border border-slate-200/50 dark:border-white/10 shadow-2xl">

          <div className="mx-auto w-14 h-14 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Secure Admin Login
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Access the dashboard via passwordless verification code checks.
          </p>

          {statusMessage && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-300 text-xs font-semibold text-left">
              {statusMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-500 text-left">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-semibold">{error}</span>
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6 text-left">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Get Verification Code</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyLogin} className="space-y-6 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/40 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm tracking-widest font-mono text-center font-bold outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Enter the 6-digit code sent to your email inbox.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setError(null);
                    setStatusMessage(null);
                    setOtp('');
                  }}
                  className="flex items-center justify-center px-4 py-3.5 border border-slate-300/40 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100/50 dark:hover:bg-white/5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Verify & Log In</span>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
