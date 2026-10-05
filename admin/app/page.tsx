'use client';

import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  Volume2, 
  Monitor, 
  Smartphone, 
  Share2, 
  RefreshCw,
  ExternalLink,
  Info,
  Sliders,
  Check,
  Film
} from 'lucide-react';

interface PiezaVideo {
  id: string;
  titulo: string;
  linea: string;
  duracion: string;
  estado: 'renderizado' | 'generando' | 'en_cola';
  videoUrl: string;
  contactSheetUrl: string;
  lufs: number;
  formato: string;
  fps: number;
  fecha: string;
  descripcion: string;
}

const PIEZAS_INICIALES: PiezaVideo[] = [
  {
    id: 'reel-01',
    titulo: 'Presentación Gran Reserva: El Vuelo Culinario',
    linea: 'Dark Kitchens B2B / Inversores',
    duracion: '0:15',
    estado: 'renderizado',
    videoUrl: '',
    contactSheetUrl: '',
    lufs: -14.1,
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: 'Hoy, 01:45',
    descripcion: 'Apertura con tipografía cinemática y audio Gran Reserva masterizado. Orientado a directores de expansión y marcas gastronómicas.'
  },
  {
    id: 'reel-02',
    titulo: 'Ecosistema Operativo: Cocinas Clandestinas de Alta Gama',
    linea: 'Operaciones & Tecnología Hub',
    duracion: '0:18',
    estado: 'renderizado',
    videoUrl: '',
    contactSheetUrl: '',
    lufs: -13.9,
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: 'Hoy, 02:10',
    descripcion: 'Desglose de estaciones culinarias modulables y rentabilidad por metro cuadrado con métricas en tiempo real.'
  }
];

export default function DashboardAdmin() {
  const [piezas] = useState<PiezaVideo[]>(PIEZAS_INICIALES);
  const [seleccionada, setSeleccionada] = useState<PiezaVideo>(PIEZAS_INICIALES[0]);
  const [mostrarZonasSeguras, setMostrarZonasSeguras] = useState(false);
  const [pestaña, setPestaña] = useState<'video' | 'sheet'>('video');
  const [copiado, setCopiado] = useState(false);

  const copiarEnlace = () => {
    navigator.clipboard.writeText(seleccionada.videoUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1920] font-sans antialiased selection:bg-[#6E0C2B] selection:text-white pb-16">
      {/* Barra superior de navegación */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#6E0C2B] flex items-center justify-center shadow-sm text-white font-bold text-xl tracking-tighter">
              DK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-[#1E1920]">DKitchen Video Studio</span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
                  Gran Reserva
                </span>
              </div>
              <p className="text-xs text-[#716975]">Plataforma de Control Audiovisual B2B & Publicación CDN</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-[#F7F4EE] px-3 py-1.5 rounded-lg border border-[#E8E2D5] text-xs font-medium text-[#4A434F]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Almacenamiento Privado Drive (Producción)</span>
            </div>
            <a 
              href="https://dkitchencorporate.es" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6E0C2B] hover:bg-[#F4EBE1] border border-transparent hover:border-[#E3D3C4] transition-colors"
            >
              <span>Web Corporativa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Banner de Estado del Hub */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#F7F4EE] text-[#6E0C2B] border border-[#E8E2D5]">
              <Sparkles className="w-5 h-5 text-[#6E0C2B]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E1920]">Producción de Piezas Automáticas & Quality Control</h2>
              <p className="text-xs text-[#716975] mt-0.5">
                Piezas generadas a 1080x1920 (9:16) con audio normalizado EBU R128 (-14 LUFS) y almacenamiento en red CDN de alta velocidad.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#716975] bg-[#F7F4EE] px-3 py-1.5 rounded-lg border border-[#E8E2D5]">
              {piezas.length} Piezas Masterizadas
            </span>
          </div>
        </div>

        {/* Cuadrícula de Contenido: Reproductor Responsivo + Panel de Control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Columna Izquierda / Reproductor (5 columnas en desktop, centrado) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-3xl p-3 sm:p-4 border border-[#E8E2D5] shadow-sm">
              
              {/* Header del dispositivo */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-[#6E0C2B]" />
                  <span className="text-xs font-bold text-[#1E1920]">Vista 9:16 (Móvil)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setPestaña('video')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      pestaña === 'video' 
                        ? 'bg-[#6E0C2B] text-white shadow-xs' 
                        : 'bg-[#F7F4EE] text-[#716975] hover:text-[#1E1920]'
                    }`}
                  >
                    Vídeo MP4
                  </button>
                  <button
                    onClick={() => setPestaña('sheet')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      pestaña === 'sheet' 
                        ? 'bg-[#6E0C2B] text-white shadow-xs' 
                        : 'bg-[#F7F4EE] text-[#716975] hover:text-[#1E1920]'
                    }`}
                  >
                    Contact Sheet
                  </button>
                </div>
              </div>

              {/* Marco del teléfono con relación 9:16 estricta */}
              <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-[#E8E2D5] flex items-center justify-center">
                {pestaña === 'video' ? (
                  <video
                    key={seleccionada.videoUrl}
                    src={seleccionada.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  >
                    Tu navegador no soporta el reproductor de vídeo HTML5.
                  </video>
                ) : (
                  <div className="w-full h-full overflow-y-auto bg-neutral-900 flex flex-col items-center">
                    <img 
                      src={seleccionada.contactSheetUrl} 
                      alt="Hoja de Contactos"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Capa Zonas Seguras (Toggleable) */}
                {mostrarZonasSeguras && pestaña === 'video' && (
                  <div className="pointer-events-none absolute inset-0 border-4 border-dashed border-[#D9B25C]/80 z-20 flex flex-col justify-between p-4 bg-[#6E0C2B]/10">
                    <div className="bg-[#6E0C2B]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow text-center mx-auto">
                      Zona Segura Header (Top 15%)
                    </div>
                    <div className="text-center text-[#D9B25C] font-mono text-[11px] bg-black/60 py-1 rounded">
                      Área Central Libre para Subtítulos & Foco
                    </div>
                    <div className="bg-[#6E0C2B]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow text-center mx-auto">
                      Zona Segura UI Redes (Bottom 20%)
                    </div>
                  </div>
                )}
              </div>

              {/* Interruptor de Zonas Seguras */}
              <div className="mt-3 pt-3 border-t border-[#F0EBE1] flex items-center justify-between px-1">
                <span className="text-xs text-[#716975] flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D9B25C]" />
                  <span>Plantilla Zonas Seguras IG/TikTok</span>
                </span>
                <button
                  onClick={() => setMostrarZonasSeguras(!mostrarZonasSeguras)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${
                    mostrarZonasSeguras 
                      ? 'bg-[#F4EBE1] text-[#6E0C2B] border-[#D9B25C]' 
                      : 'bg-white text-[#716975] border-[#E8E2D5] hover:bg-[#FDFBF7]'
                  }`}
                >
                  {mostrarZonasSeguras ? 'Activas' : 'Ocultas'}
                </button>
              </div>

            </div>
          </div>

          {/* Columna Derecha / Inspector, Métricas QC y Lista (7 columnas en desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tarjeta de Ficha Técnica Detallada */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EBE1]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6E0C2B]">{seleccionada.linea}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1920] mt-0.5">{seleccionada.titulo}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Master OK
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#4A434F] my-4 leading-relaxed">
                {seleccionada.descripcion}
              </p>

              {/* Métricas Técnicas y Calidad (Grid 3x) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Resolución</span>
                  </div>
                  <div className="text-sm font-bold text-[#1E1920] mt-1">{seleccionada.formato}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Duración</span>
                  </div>
                  <div className="text-sm font-bold text-[#1E1920] mt-1">{seleccionada.duracion} ({seleccionada.fps} fps)</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Audio Master</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-600 mt-1">{seleccionada.lufs} LUFS</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Auto-QC</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-600 mt-1">0 Errores / 0 Freeze</div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#F0EBE1]">
                <a
                  href={seleccionada.videoUrl}
                  download
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#6E0C2B] hover:bg-[#570922] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                >
                  <Film className="w-4 h-4" />
                  <span>Descargar Master MP4</span>
                </a>

                <button
                  onClick={copiarEnlace}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#F7F4EE] hover:bg-[#EFE9DF] text-[#1E1920] border border-[#E8E2D5] text-xs sm:text-sm font-semibold transition-colors"
                >
                  {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#716975]" />}
                  <span>{copiado ? 'Enlace Copiado' : 'Copiar URL CDN'}</span>
                </button>

                <a
                  href={seleccionada.contactSheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[#6E0C2B] hover:bg-[#F4EBE1] text-xs sm:text-sm font-medium transition-colors ml-auto"
                >
                  <span>Ver Hoja Contactos Completa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Listado de Piezas del Catálogo */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#1E1920] uppercase tracking-wider">
                  Catálogo de Piezas Renderizadas en CDN
                </h4>
                <span className="text-xs text-[#716975]">Selecciona una para previsualizar</span>
              </div>

              <div className="space-y-3">
                {piezas.map((pieza) => {
                  const estaActiva = seleccionada.id === pieza.id;
                  return (
                    <div
                      key={pieza.id}
                      onClick={() => setSeleccionada(pieza)}
                      className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                        estaActiva
                          ? 'bg-[#FDF9F3] border-[#6E0C2B] ring-1 ring-[#6E0C2B]/20 shadow-xs'
                          : 'bg-white border-[#E8E2D5] hover:border-[#D5C9B5] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          estaActiva ? 'bg-[#6E0C2B] text-white' : 'bg-[#F7F4EE] text-[#716975]'
                        }`}>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center space-x-2">
                            <h5 className="text-sm font-bold text-[#1E1920] truncate">{pieza.titulo}</h5>
                            <span className="text-[10px] uppercase font-bold text-[#6E0C2B] bg-[#F4EBE1] px-1.5 py-0.5 rounded border border-[#E3D3C4] shrink-0">
                              {pieza.id}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-[#716975] mt-0.5">
                            <span>{pieza.duracion}</span>
                            <span>•</span>
                            <span>{pieza.formato}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{pieza.lufs} LUFS</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {pieza.estado}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
