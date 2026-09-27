import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('r.sharma@stackguard-aif.in');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Rajiv Sharma');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, name);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickLogin = (quickEmail: string, quickName: string) => {
    setEmail(quickEmail);
    setName(quickName);
    login(quickEmail, quickName);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#080C14] text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid + ambient glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B0A_1px,transparent_1px),linear-gradient(to_bottom,#1E293B0A_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0E1626] border border-[#38BDF8]/40 shadow-lg text-[#38BDF8] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-[#F8FAFC]">
            STACK<span className="text-[#38BDF8]">GUARD</span> <span className="text-sm font-mono text-[#94A3B8]">AIF</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-Time Multi-Strategy Risk & Execution Broker
          </p>
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#0A0F1A] text-[#34D399] border border-[#10B981]/30">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            <span>SEBI CAT III / SIF ENVELOPE ACTIVE</span>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-6 shadow-2xl backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC] mb-1">
            Terminal Authentication
          </h2>
          <p className="text-xs text-[#64748B] mb-5">
            Enter your institutional credentials to access execution controls.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Fund Manager Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                  placeholder="manager@aif-fund.in"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  PIN / Master Key
                </label>
                <span className="text-[10px] text-[#38BDF8] hover:underline cursor-pointer">
                  Hardware Token Active
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#080C14] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating Gateway...' : 'Sign In to Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-[#1E293B]">
            <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider mb-2.5 text-center">
              Quick Role Switch (Demo Mode)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('r.sharma@stackguard-aif.in', 'Rajiv Sharma (CIO)')}
                className="p-2 rounded bg-[#0A0F1A] hover:bg-[#121B2E] border border-[#1E293B] text-left transition-colors"
              >
                <div className="text-[11px] font-semibold text-[#F8FAFC]">Rajiv Sharma</div>
                <div className="text-[9px] text-[#38BDF8] font-mono">Portfolio Manager / CIO</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('p.mehta@stackguard-aif.in', 'Priya Mehta (CRO)')}
                className="p-2 rounded bg-[#0A0F1A] hover:bg-[#121B2E] border border-[#1E293B] text-left transition-colors"
              >
                <div className="text-[11px] font-semibold text-[#F8FAFC]">Priya Mehta</div>
                <div className="text-[9px] text-amber-400 font-mono">Chief Risk Officer</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-[10px] text-[#64748B] font-mono">
          SEBI / AIF Reg: IN/AIF3/24-25/0892 | Pre-Trade OMS Gateway v4.2.1
        </div>
      </div>
    </div>
  );
};
