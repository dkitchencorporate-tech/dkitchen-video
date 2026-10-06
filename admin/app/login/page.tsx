'use client';

import React, { useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // Redirigir al dashboard protegido con la cookie httpOnly ya establecida
        window.location.href = '/';
      } else {
        setError(data.error || 'Código incorrecto');
      }
    } catch {
      setError('Error al comunicar con el servidor de seguridad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#18181B] rounded-3xl p-8 border border-neutral-800 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/20 border border-[#DC2626]/40 flex items-center justify-center mx-auto text-[#DC2626]">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">DKitchen Studio</h2>
          <p className="text-xs text-neutral-400 mt-1">Acceso Protegido por Servidor (2FA TOTP)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-neutral-300">Código de 6 dígitos</label>
            <input
              type="text"
              required
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full mt-1 p-3.5 rounded-xl border border-neutral-700 bg-neutral-900 text-center text-3xl tracking-[0.3em] font-mono font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 text-[#090B10] font-bold text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Verificando en servidor...' : 'Verificar y Entrar'}</span>
          </button>
        </form>

        <p className="text-[11px] text-neutral-500">
          Uso exclusivo directivo DKitchen Corporate. IP monitorizada.
        </p>
      </div>
    </div>
  );
}
