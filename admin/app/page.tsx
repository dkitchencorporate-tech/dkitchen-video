'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  Volume2, 
  Smartphone, 
  ExternalLink,
  Film,
  ThumbsUp,
  MessageSquare,
  Lock,
  History,
  Image as ImageIcon,
  FileText,
  Video,
  LogOut
} from 'lucide-react';

interface ComentarioAjuste {
  fecha: string;
  autor: string;
  texto: string;
}

interface PiezaEstudio {
  id: string;
  titulo: string;
  linea: string;
  duracion: string;
  estado: 'borrador' | 'qc' | 'pendiente_aprobacion' | 'aprobada' | 'programada' | 'publicada';
  videoUrl: string;
  contactSheetUrl: string;
  lufs: string;
  bitrate: string;
  formato: string;
  fps: number;
  fecha: string;
  descripcion: string;
  zonasSeguras: 'cumplidas' | 'revisar';
  ajustes: ComentarioAjuste[];
}

const PIEZAS_INICIALES: PiezaEstudio[] = [
  {
    id: 'reel-02',
    titulo: 'Reel 02: Configura tu menú en 60 segundos',
    linea: 'Tutorial Producto (#TuCartaEn60Segundos)',
    duracion: '16s',
    estado: 'pendiente_aprobacion',
    videoUrl: '/media/reel-02/reel.mp4',
    contactSheetUrl: '/media/reel-02/contact_sheet.jpg',
    lufs: 'Sin pista de audio (Pendiente ElevenLabs)',
    bitrate: '7,8 Mbps H.264 High',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: '04/10/2026',
    descripcion: 'Paso a paso de configuración de platos en el panel. Visual pre-renderizado disponible para revisión de ritmo y composición.',
    zonasSeguras: 'revisar',
    ajustes: [
      { fecha: '05/10/2026 12:40', autor: 'Auditoría Claude Code', texto: 'Fondos con textos previos en imagen chocaban con el titular dinámico.' }
    ]
  },
  {
    id: 'reel-01',
    titulo: 'Reel 01: Tu carta, a la altura de tu cocina',
    linea: 'Demo Producto / HTML Motion',
    duracion: '12s',
    estado: 'borrador',
    videoUrl: '/media/reel-01/reel.mp4',
    contactSheetUrl: '/media/reel-01/contact_sheet.jpg',
    lufs: 'Sin pista de audio (Pendiente ElevenLabs)',
    bitrate: '8,0 Mbps H.264 High',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: '04/10/2026',
    descripcion: 'Apertura con tipografía clásica. Versión archivada para actualización con locución y caja segura 940x1280.',
    zonasSeguras: 'revisar',
    ajustes: [
      { fecha: '05/10/2026 12:40', autor: 'Auditoría Claude Code', texto: 'Textos de cabecera y pie invadían zonas seguras; requiere audio y subtítulos grabados.' }
    ]
  },
  {
    id: 'reel-piloto',
    titulo: 'Piloto Cinemático 3D: ¿Cuántas cartas vas a tirar a la basura?',
    linea: 'Motion Flow 3D & Canvas Orgánico (Nivel G)',
    duracion: '15.5s',
    estado: 'pendiente_aprobacion',
    videoUrl: '/media/reel-piloto/reel.mp4',
    contactSheetUrl: '/media/reel-piloto/contact_sheet.jpg',
    lufs: '-15.4 LUFS (Locución Álvaro ElevenLabs + Ducking)',
    bitrate: '9,5 Mbps H.264 High (Master)',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: 'Hoy, 18:45',
    descripcion: 'Versión cinematográfica 3D. Sistema de partículas doradas en canvas, luces volumétricas en parallax, smartphone 3D con inercia, interacción táctil en tiempo real cambiando precio de 24€ a 28€ y tipografía cinética con máscaras. Locución enérgica de Álvaro y caja segura 940x1280 100% blindada.',
    zonasSeguras: 'cumplidas',
    ajustes: []
  },
  {
    id: 'reel-cinematic-pro',
    titulo: 'Reel Cinemático Pro: Paleta Web Oficial y Gastronomía Real',
    linea: 'Cinematic B-Roll + 3D Motion Flow (20 Segundos)',
    duracion: '20.0s',
    estado: 'pendiente_aprobacion',
    videoUrl: '/media/reel-cinematic-pro/reel.mp4',
    contactSheetUrl: '/media/reel-cinematic-pro/contact_sheet.jpg',
    lufs: '-14.5 LUFS (ElevenLabs Peninsular + B-Roll Real)',
    bitrate: '11,4 Mbps H.264 High Master',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: 'Hoy, 20:47',
    descripcion: 'Versión definitiva con colores exactos de la web oficial de DKitchen (#090B10, #F59E0B, #DC2626). Incorpora fotografías reales de alta gastronomía en B-Roll dinámico con efecto Ken Burns, smartphone 3D interactivo con panel de sala, tipografía Outfit con resaltes en oro y chipotle, y locución con pausas e inflexión comercial.',
    zonasSeguras: 'cumplidas',
    ajustes: []
  },
  {
    id: 'reel-ugc-30s',
    titulo: 'Reel 30s Master: Fuga en Sala, Avatar UGC y Conversión Real',
    linea: 'Motion Flow 3D + UGC Viral (30 Segundos)',
    duracion: '30.0s',
    estado: 'pendiente_aprobacion',
    videoUrl: '/media/reel-ugc-30s/reel.mp4',
    contactSheetUrl: '/media/reel-ugc-30s/contact_sheet.jpg',
    lufs: '-14.8 LUFS (ElevenLabs Álvaro + Beat Cinemático)',
    bitrate: '10,2 Mbps H.264 High Master',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: 'Hoy, 19:15',
    descripcion: 'Segunda prueba de alta duración (30s). Integra avatar UGC de portavoz en sala, contraste dinámico de tiempos, smartphone 3D con menú en vivo y micro-interacciones táctiles, métricas de retención (+18% ticket) y cierre directivo Gran Reserva.',
    zonasSeguras: 'cumplidas',
    ajustes: []
  }
];


function base32ToBuffer(base32: string): ArrayBuffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let i = 0; i < base32.length; i++) {
    const val = alphabet.indexOf(base32[i].toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes[Math.floor(i / 8)] = parseInt(bits.substr(i, 8), 2);
  }
  return bytes.buffer;
}

async function verifyTOTP(tokenInput: string, secretBase32: string): Promise<boolean> {
  try {
    const keyBytes = base32ToBuffer(secretBase32);
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: { name: 'SHA-1' } },
      false,
      ['sign']
    );

    const epoch = Math.floor(Date.now() / 1000);
    const timeSteps = [
      Math.floor((epoch - 30) / 30),
      Math.floor(epoch / 30),
      Math.floor((epoch + 30) / 30)
    ];

    for (const step of timeSteps) {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setBigUint64(0, BigInt(step));

      const signature = await window.crypto.subtle.sign('HMAC', key, buffer);
      const hmac = new Uint8Array(signature);
      const offset = hmac[hmac.length - 1] & 0xf;
      const binCode =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);

      const generated = (binCode % 1000000).toString().padStart(6, '0');
      if (generated === tokenInput.trim()) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

export default function DashboardAdmin() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState('videostudiopro.ia@gmail.com');
  const [totpCode, setTotpCode] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');
  
  const [moduloActivo, setModuloActivo] = useState<'videos' | 'imagenes' | 'carruseles' | 'flyers'>('videos');
  const [piezas, setPiezas] = useState<PiezaEstudio[]>(PIEZAS_INICIALES);
  const [seleccionadaId, setSeleccionadaId] = useState<string>('reel-piloto');
  const [mostrarZonasSeguras, setMostrarZonasSeguras] = useState(false);
  const [pestaña, setPestaña] = useState<'video' | 'sheet'>('video');
  const [modalAjusteAbierto, setModalAjusteAbierto] = useState(false);
  const [textoAjuste, setTextoAjuste] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const sesion = localStorage.getItem('dkitchen_admin_user');
    if (sesion) setUsuarioAutenticado(true);
  }, []);

  const handleLoginGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAuth('');
    setVerificando(true);

    try {
      const valido = await verifyTOTP(totpCode, 'DKITCHENSTUDIO26');
      if (valido) {
        localStorage.setItem('dkitchen_admin_user', emailInput.trim().toLowerCase());
        setUsuarioAutenticado(true);
        setErrorAuth('');
      } else {
        setErrorAuth('Código de Google Authenticator incorrecto o expirado. Asegúrate de tener la hora sincronizada en tu móvil.');
      }
    } catch (err) {
      setErrorAuth('Error al validar el código 2FA. Inténtalo de nuevo.');
    } finally {
      setVerificando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dkitchen_admin_user');
    setUsuarioAutenticado(false);
  };

  const seleccionada = piezas.find(p => p.id === seleccionadaId) || piezas[0];

  const aprobarPieza = () => {
    setPiezas(prev => prev.map(p => {
      if (p.id === seleccionada.id) {
        return { ...p, estado: 'aprobada' };
      }
      return p;
    }));
    setMensajeExito(`¡Pieza ${seleccionada.id} aprobada por karc0 para programación!`);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const guardarAjuste = () => {
    if (!textoAjuste.trim()) return;
    const nuevoComentario: ComentarioAjuste = {
      fecha: new Date().toLocaleString('es-ES'),
      autor: 'karc0 (Director)',
      texto: textoAjuste.trim()
    };
    setPiezas(prev => prev.map(p => {
      if (p.id === seleccionada.id) {
        return {
          ...p,
          estado: 'pendiente_aprobacion',
          ajustes: [nuevoComentario, ...p.ajustes]
        };
      }
      return p;
    }));
    setTextoAjuste('');
    setModalAjusteAbierto(false);
    setMensajeExito(`Solicitud de ajuste guardada en la ficha de ${seleccionada.id}.`);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  if (!usuarioAutenticado) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E8E2D5] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#6E0C2B] text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
            DK
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
              Acceso Privado karc0
            </span>
            <h1 className="text-2xl font-bold text-[#1E1920] mt-3">DKitchen Video Studio</h1>
            <p className="text-xs text-[#716975] mt-1">Consola interna de producción audiovisual y aprobación de piezas.</p>
          </div>

          <form onSubmit={handleLoginGoogle} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-[#1E1920]">Usuario Administrador</label>
              <input
                type="email"
                readOnly
                value={emailInput}
                className="w-full mt-1 p-2.5 rounded-xl border border-[#E8E2D5] bg-[#FAF8F5] text-xs font-mono text-[#4A434F] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1E1920]">Código 2FA de Google Authenticator</label>
              <input
                type="text"
                required
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full mt-1 p-3 rounded-xl border border-[#E8E2D5] text-center text-2xl tracking-[0.3em] font-mono font-bold text-[#1E1920] focus:outline-hidden focus:ring-2 focus:ring-[#6E0C2B]/30"
              />
            </div>

            {errorAuth && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorAuth}
              </div>
            )}

            <button
              type="submit"
              disabled={verificando || totpCode.length < 6}
              className="w-full py-3 rounded-xl bg-[#6E0C2B] hover:bg-[#570922] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{verificando ? 'Validando con Google Authenticator...' : 'Verificar y Acceder'}</span>
            </button>
          </form>

          <p className="text-[11px] text-[#A29A91]">
            Protegido bajo política de uso exclusivo DKitchen Corporate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1920] font-sans antialiased selection:bg-[#6E0C2B] selection:text-white pb-24">
      {mensajeExito && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1920] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-[#D9B25C] animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{mensajeExito}</span>
        </div>
      )}

      {modalAjusteAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E8E2D5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#6E0C2B]" />
                <h3 className="font-bold text-base sm:text-lg text-[#1E1920]">Ajustes para {seleccionada.id}</h3>
              </div>
              <button 
                onClick={() => setModalAjusteAbierto(false)}
                className="text-[#716975] hover:text-[#1E1920] font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#716975]">
              Anota qué debe modificarse (tiempos, textos, voz de ElevenLabs o encuadre).
            </p>
            <textarea
              value={textoAjuste}
              onChange={(e) => setTextoAjuste(e.target.value)}
              placeholder="Indica las correcciones específicas..."
              rows={4}
              className="w-full p-3 rounded-xl border border-[#E8E2D5] focus:outline-hidden focus:ring-2 focus:ring-[#6E0C2B]/30 text-sm"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setModalAjusteAbierto(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#716975] hover:bg-[#F7F4EE]"
              >
                Cancelar
              </button>
              <button
                onClick={guardarAjuste}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#6E0C2B] text-white hover:bg-[#570922] transition-colors"
              >
                Guardar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#6E0C2B] flex items-center justify-center shadow-xs text-white font-bold text-lg tracking-tighter shrink-0">
              DK
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#1E1920] truncate">DKitchen Studio</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
                  Gran Reserva
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesión: karc0</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1 rounded-lg text-xs font-semibold text-[#716975] hover:bg-[#F4EBE1] hover:text-[#6E0C2B] flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        <div className="border-t border-[#F0EBE1] bg-[#FAF8F5] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setModuloActivo('videos')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                moduloActivo === 'videos'
                  ? 'bg-[#6E0C2B] text-white shadow-xs'
                  : 'bg-white text-[#716975] hover:text-[#1E1920] border border-[#E8E2D5]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeos (Motion & UGC)</span>
            </button>

            <button
              onClick={() => setModuloActivo('imagenes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                moduloActivo === 'imagenes'
                  ? 'bg-[#6E0C2B] text-white shadow-xs'
                  : 'bg-white text-[#716975] hover:text-[#1E1920] border border-[#E8E2D5]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imágenes & PWA (Flow)</span>
            </button>

            <button
              onClick={() => setModuloActivo('carruseles')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                moduloActivo === 'carruseles'
                  ? 'bg-[#6E0C2B] text-white shadow-xs'
                  : 'bg-white text-[#716975] hover:text-[#1E1920] border border-[#E8E2D5]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Carruseles de Autor</span>
            </button>

            <button
              onClick={() => setModuloActivo('flyers')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                moduloActivo === 'flyers'
                  ? 'bg-[#6E0C2B] text-white shadow-xs'
                  : 'bg-white text-[#716975] hover:text-[#1E1920] border border-[#E8E2D5]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Flyers & Print (QR UTM)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {moduloActivo !== 'videos' ? (
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D5] shadow-xs text-center space-y-4 max-w-2xl mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#F4EBE1] text-[#6E0C2B] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1E1920] capitalize">Módulo de {moduloActivo}</h3>
            <p className="text-sm text-[#716975] leading-relaxed">
              En proceso de integración progresiva: conexión con API de Nano Banana / Flow para fotografía gastronómica sin comisiones y generador de plantillas vectoriales CMYK a 300 ppp para imprenta.
            </p>
            <button
              onClick={() => setModuloActivo('videos')}
              className="px-5 py-2.5 rounded-xl bg-[#6E0C2B] text-white font-semibold text-xs transition-colors"
            >
              Volver al Módulo de Vídeos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-3xl p-3 sm:p-4 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Smartphone className="w-4 h-4 text-[#6E0C2B] shrink-0" />
                    <span className="text-xs font-bold text-[#1E1920] truncate">Visor 9:16</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPestaña('video')}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        pestaña === 'video' 
                          ? 'bg-[#6E0C2B] text-white shadow-xs' 
                          : 'bg-[#F7F4EE] text-[#716975]'
                      }`}
                    >
                      Vídeo
                    </button>
                    <button
                      onClick={() => setPestaña('sheet')}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        pestaña === 'sheet' 
                          ? 'bg-[#6E0C2B] text-white shadow-xs' 
                          : 'bg-[#F7F4EE] text-[#716975]'
                      }`}
                    >
                      Mosaico
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-[#E8E2D5] flex items-center justify-center text-center">
                  {pestaña === 'video' ? (
                    seleccionada.videoUrl ? (
                      <video
                        key={seleccionada.videoUrl}
                        src={seleccionada.videoUrl}
                        controls
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain bg-black"
                      >
                        Tu navegador no soporta reproducción de vídeo HTML5.
                      </video>
                    ) : (
                      <div className="p-6 space-y-3">
                        <Film className="w-10 h-10 text-[#D9B25C] mx-auto opacity-70" />
                        <div className="text-white text-xs font-bold uppercase tracking-wider">{seleccionada.id}</div>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          Código HTML GSAP listo en el repositorio. Render con ElevenLabs bajo demanda.
                        </p>
                      </div>
                    )
                  ) : (
                    seleccionada.contactSheetUrl ? (
                      <div className="w-full h-full overflow-y-auto bg-neutral-900">
                        <img 
                          src={seleccionada.contactSheetUrl} 
                          alt="Hoja de Contactos"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-neutral-400 text-xs p-6">Mosaico no generado aún.</div>
                    )
                  )}

                  {mostrarZonasSeguras && pestaña === 'video' && (
                    <div className="pointer-events-none absolute inset-0 border-4 border-dashed border-[#D9B25C]/80 z-20 flex flex-col justify-between p-3 bg-[#6E0C2B]/10">
                      <div className="bg-[#6E0C2B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded text-center mx-auto">
                        Top 220px (Header Redes)
                      </div>
                      <div className="text-center text-[#D9B25C] font-mono text-[10px] bg-black/75 py-1 px-2 rounded border border-[#D9B25C]/40">
                        Caja Segura 940×1280 px
                      </div>
                      <div className="bg-[#6E0C2B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded text-center mx-auto">
                        Bottom 420px (Pie y Botones)
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between px-1">
                  <span className="text-[11px] text-[#716975] flex items-center space-x-1.5 truncate">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#D9B25C] shrink-0" />
                    <span className="truncate">Zonas Seguras (TikTok/IG)</span>
                  </span>
                  <button
                    onClick={() => setMostrarZonasSeguras(!mostrarZonasSeguras)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold border transition-all ${
                      mostrarZonasSeguras 
                        ? 'bg-[#F4EBE1] text-[#6E0C2B] border-[#D9B25C]' 
                        : 'bg-white text-[#716975] border-[#E8E2D5]'
                    }`}
                  >
                    {mostrarZonasSeguras ? 'Activas' : 'Ocultas'}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EBE1]">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E0C2B]">{seleccionada.linea}</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1920] mt-0.5 break-words">{seleccionada.titulo}</h3>
                  </div>
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      seleccionada.estado === 'aprobada' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {seleccionada.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A434F] my-3 leading-relaxed">
                  {seleccionada.descripcion}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#FDF9F3] border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-3">
                  <div>
                    <div className="text-xs font-bold text-[#1E1920]">Decisión de Dirección (karc0)</div>
                    <div className="text-[11px] text-[#716975]">Aprueba para programar o pide ajustes detallados.</div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setModalAjusteAbierto(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border border-[#E8E2D5] bg-white hover:bg-[#F7F4EE] text-xs font-semibold text-[#1E1920] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#6E0C2B]" />
                      <span>Pedir Ajuste</span>
                    </button>
                    <button
                      onClick={aprobarPieza}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Aprobar</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Formato</span>
                    </div>
                    <div className="text-xs font-bold text-[#1E1920] mt-0.5 truncate">{seleccionada.formato}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Duración</span>
                    </div>
                    <div className="text-xs font-bold text-[#1E1920] mt-0.5">{seleccionada.duracion} ({seleccionada.fps} fps)</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <Volume2 className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Audio</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#1E1920] mt-0.5 truncate">{seleccionada.lufs}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Zonas Seguras</span>
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${seleccionada.zonasSeguras === 'cumplidas' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {seleccionada.zonasSeguras === 'cumplidas' ? 'Blindadas' : 'Ajustar'}
                    </div>
                  </div>
                </div>

                {seleccionada.ajustes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F0EBE1] space-y-2">
                    <div className="text-xs font-bold text-[#1E1920] flex items-center space-x-1.5">
                      <History className="w-3.5 h-3.5 text-[#6E0C2B]" />
                      <span>Historial de Ajustes</span>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {seleccionada.ajustes.map((c, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80 text-[11px]">
                          <div className="flex justify-between font-bold text-[#6E0C2B] mb-0.5">
                            <span>{c.autor}</span>
                            <span className="text-[#716975] font-normal">{c.fecha}</span>
                          </div>
                          <p className="text-[#4A434F]">{c.texto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1E1920] uppercase tracking-wider">
                    Catálogo de Producción
                  </h4>
                  <span className="text-[11px] text-[#716975]">{piezas.length} disponibles</span>
                </div>

                <div className="space-y-2.5">
                  {piezas.map((pieza) => {
                    const estaActiva = seleccionada.id === pieza.id;
                    return (
                      <div
                        key={pieza.id}
                        onClick={() => setSeleccionadaId(pieza.id)}
                        className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                          estaActiva
                            ? 'bg-[#FDF9F3] border-[#6E0C2B] ring-1 ring-[#6E0C2B]/20 shadow-xs'
                            : 'bg-white border-[#E8E2D5] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            estaActiva ? 'bg-[#6E0C2B] text-white' : 'bg-[#F7F4EE] text-[#716975]'
                          }`}>
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center space-x-1.5 truncate">
                              <h5 className="text-xs font-bold text-[#1E1920] truncate">{pieza.titulo}</h5>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-[#716975] mt-0.5">
                              <span>{pieza.duracion}</span>
                              <span>•</span>
                              <span className="truncate">{pieza.linea}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            pieza.estado === 'aprobada' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {pieza.estado.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}