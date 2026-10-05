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
  Smartphone, 
  ExternalLink,
  Check,
  Film,
  ThumbsUp,
  MessageSquare,
  Lock,
  Calendar,
  AlertTriangle,
  History,
  TrendingUp
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
    id: 'reel-piloto',
    titulo: 'Piloto: ¿Cuántas cartas vas a tirar a la basura? (#TuCartaEn60Segundos)',
    linea: 'Motion Design Cinematográfico (Nivel G)',
    duracion: '15.5s',
    estado: 'pendiente_aprobacion',
    videoUrl: '',
    contactSheetUrl: '',
    lufs: 'Pendiente render (-14 LUFS objetivo)',
    bitrate: '10-12 Mbps H.264 High',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: 'Hoy, 13:20',
    descripcion: 'Gancho de dolor provocado por reimpresión de cartas de papel. Mockup 3D dinámico de demo/panel con cambio de precio y alérgenos en 60 segundos. Cierre Gran Reserva con respiración.',
    zonasSeguras: 'cumplidas',
    ajustes: []
  },
  {
    id: 'reel-01',
    titulo: 'Reel 01: Tu carta, a la altura de tu cocina',
    linea: 'B (Demo Producto / HTML Motion)',
    duracion: '12s',
    estado: 'borrador',
    videoUrl: '',
    contactSheetUrl: '',
    lufs: 'Sin pista de audio',
    bitrate: '8,0 Mbps H.264',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: '04/10/2026',
    descripcion: 'Versión previa archivada. Requiere locución ElevenLabs y adaptación visual a la caja segura 940x1280.',
    zonasSeguras: 'revisar',
    ajustes: [
      { fecha: '05/10/2026 12:40', autor: 'Auditoría Claude Code', texto: 'Textos de cabecera y pie invadían zonas seguras; requiere audio y subtítulos grabados.' }
    ]
  },
  {
    id: 'reel-02',
    titulo: 'Reel 02: Configura tu menú en 60 segundos',
    linea: 'B (Demo Producto / Tutorial)',
    duracion: '16s',
    estado: 'borrador',
    videoUrl: '',
    contactSheetUrl: '',
    lufs: 'Sin pista de audio',
    bitrate: '7,8 Mbps H.264',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: '04/10/2026',
    descripcion: 'Versión previa archivada. Se integrará locución de marca oficial y ritmo cinematográfico.',
    zonasSeguras: 'revisar',
    ajustes: [
      { fecha: '05/10/2026 12:40', autor: 'Auditoría Claude Code', texto: 'Fondos con textos previos en imagen chocaban con el titular dinámico.' }
    ]
  }
];

export default function DashboardAdmin() {
  const [piezas, setPiezas] = useState<PiezaEstudio[]>(PIEZAS_INICIALES);
  const [seleccionadaId, setSeleccionadaId] = useState<string>('reel-piloto');
  const [mostrarZonasSeguras, setMostrarZonasSeguras] = useState(true);
  const [pestaña, setPestaña] = useState<'video' | 'sheet' | 'ficha'>('video');
  const [modalAjusteAbierto, setModalAjusteAbierto] = useState(false);
  const [textoAjuste, setTextoAjuste] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1920] font-sans antialiased selection:bg-[#6E0C2B] selection:text-white pb-20">
      
      {/* Alerta de Éxito / Feedback */}
      {mensajeExito && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1920] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-[#D9B25C] animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{mensajeExito}</span>
        </div>
      )}

      {/* Modal de Solicitud de Ajustes */}
      {modalAjusteAbierto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E8E2D5] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#6E0C2B]" />
                <h3 className="font-bold text-lg text-[#1E1920]">Solicitar Ajustes en {seleccionada.id}</h3>
              </div>
              <button 
                onClick={() => setModalAjusteAbierto(false)}
                className="text-[#716975] hover:text-[#1E1920] font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#716975]">
              Describe detalladamente el cambio visual, sonoro o de ritmo requerido. La pieza volverá al estado de edición antes del render final.
            </p>
            <textarea
              value={textoAjuste}
              onChange={(e) => setTextoAjuste(e.target.value)}
              placeholder="Ejemplo: Acelerar la transición del segundo 4, dar más volumen al golpe de percusión y ajustar el color del cronómetro..."
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
                Guardar y Enviar al Productor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Corporativo Privado */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#6E0C2B] flex items-center justify-center shadow-sm text-white font-bold text-xl tracking-tighter">
              DK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-[#1E1920]">estudio.dkitchencorporate.es</span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
                  Gran Reserva Studio
                </span>
              </div>
              <p className="text-xs text-[#716975]">Consola de Aprobación de Contenido Audiovisual & Control de Calidad</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Acceso Seguro: karc0 (Google Auth)</span>
            </div>
            <a 
              href="https://dkitchencorporate.es" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6E0C2B] hover:bg-[#F4EBE1] border border-transparent hover:border-[#E3D3C4] transition-colors"
            >
              <span>Web Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Banner de Estado Operativo */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#F7F4EE] text-[#6E0C2B] border border-[#E8E2D5]">
              <Sparkles className="w-5 h-5 text-[#6E0C2B]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E1920]">Fase de Validación: Pieza Piloto & Estándar Cinematográfico</h2>
              <p className="text-xs text-[#716975] mt-0.5">
                Almacenamiento privado en Google Drive. Ninguna pieza se publica sin tu aprobación explícita.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6E0C2B] bg-[#F4EBE1] px-3 py-1.5 rounded-lg border border-[#E3D3C4]">
              {piezas.length} Piezas en Catálogo
            </span>
          </div>
        </div>

        {/* Cuadrícula Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Columna Izquierda: Reproductor 9:16 y Visor de Zonas Seguras */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-3xl p-3 sm:p-4 border border-[#E8E2D5] shadow-sm">
              
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-[#6E0C2B]" />
                  <span className="text-xs font-bold text-[#1E1920]">Visor 9:16 Vertical</span>
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
                    Reproductor
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

              {/* Marco 9:16 */}
              <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-neutral-950 shadow-inner border border-[#E8E2D5] flex items-center justify-center text-center p-4">
                {seleccionada.videoUrl ? (
                  <video
                    key={seleccionada.videoUrl}
                    src={seleccionada.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="space-y-3">
                    <Film className="w-12 h-12 text-[#D9B25C] mx-auto opacity-70" />
                    <div>
                      <div className="text-white text-xs font-bold uppercase tracking-wider">{seleccionada.id}</div>
                      <p className="text-neutral-400 text-[11px] mt-1 px-4 leading-relaxed">
                        Código de composición HTML listo en el repositorio. Render y audio bajo demanda en Google Drive.
                      </p>
                    </div>
                  </div>
                )}

                {/* Máscara de Zonas Seguras (Activa por defecto según B3) */}
                {mostrarZonasSeguras && (
                  <div className="pointer-events-none absolute inset-0 border-4 border-dashed border-[#D9B25C]/80 z-20 flex flex-col justify-between p-4 bg-[#6E0C2B]/10">
                    <div className="bg-[#6E0C2B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow text-center mx-auto">
                      Zona Prohibida Cabecera (Top 220px)
                    </div>
                    <div className="text-center text-[#D9B25C] font-mono text-[10px] bg-black/70 py-1.5 px-2 rounded border border-[#D9B25C]/40">
                      Caja Segura 940×1280 px<br/>(Área libre para textos, subtítulos y logotipo)
                    </div>
                    <div className="bg-[#6E0C2B]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow text-center mx-auto">
                      Zona Prohibida Pie UI (Bottom 420px)
                    </div>
                  </div>
                )}
              </div>

              {/* Selector de Zonas Seguras */}
              <div className="mt-3 pt-3 border-t border-[#F0EBE1] flex items-center justify-between px-1">
                <span className="text-xs text-[#716975] flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D9B25C]" />
                  <span>Máscara Zonas Seguras (TikTok/IG)</span>
                </span>
                <button
                  onClick={() => setMostrarZonasSeguras(!mostrarZonasSeguras)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-all ${
                    mostrarZonasSeguras 
                      ? 'bg-[#F4EBE1] text-[#6E0C2B] border-[#D9B25C]' 
                      : 'bg-white text-[#716975] border-[#E8E2D5] hover:bg-[#FDFBF7]'
                  }`}
                >
                  {mostrarZonasSeguras ? 'Activa (Segura)' : 'Oculta'}
                </button>
              </div>

            </div>
          </div>

          {/* Columna Derecha: Inspector, Botones Aprobar/Ajustar y Catálogo */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Panel de Aprobación & Ficha Técnica */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EBE1]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6E0C2B]">{seleccionada.linea}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E1920] mt-0.5">{seleccionada.titulo}</h3>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    seleccionada.estado === 'aprobada' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : seleccionada.estado === 'pendiente_aprobacion'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}>
                    {seleccionada.estado.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#4A434F] my-4 leading-relaxed">
                {seleccionada.descripcion}
              </p>

              {/* Botonera de Aprobación del Director (karc0) */}
              <div className="p-4 rounded-2xl bg-[#FDF9F3] border border-[#E8E2D5] flex flex-wrap items-center justify-between gap-3 my-4">
                <div>
                  <div className="text-xs font-bold text-[#1E1920]">Panel de Decisión de karc0</div>
                  <div className="text-[11px] text-[#716975]">Aprueba para proceder a programación o solicita ajustes específicos.</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setModalAjusteAbierto(true)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#E8E2D5] bg-white hover:bg-[#F7F4EE] text-xs font-semibold text-[#1E1920] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Pedir Ajuste</span>
                  </button>
                  <button
                    onClick={aprobarPieza}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Aprobar Pieza</span>
                  </button>
                </div>
              </div>

              {/* Métricas Reales Auditadas (Sin datos falsos) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Resolución</span>
                  </div>
                  <div className="text-xs font-bold text-[#1E1920] mt-1">{seleccionada.formato}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Duración</span>
                  </div>
                  <div className="text-xs font-bold text-[#1E1920] mt-1">{seleccionada.duracion} ({seleccionada.fps} fps)</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Audio Real</span>
                  </div>
                  <div className="text-xs font-bold text-[#1E1920] mt-1">{seleccionada.lufs}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                  <div className="text-[11px] font-medium text-[#716975] flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Zonas Seguras</span>
                  </div>
                  <div className={`text-xs font-bold mt-1 ${seleccionada.zonasSeguras === 'cumplidas' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {seleccionada.zonasSeguras === 'cumplidas' ? '100% Blindadas' : 'Revisar Márgenes'}
                  </div>
                </div>
              </div>

              {/* Historial de Ajustes / Comentarios */}
              {seleccionada.ajustes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#F0EBE1] space-y-2">
                  <div className="text-xs font-bold text-[#1E1920] flex items-center space-x-1.5">
                    <History className="w-3.5 h-3.5 text-[#6E0C2B]" />
                    <span>Historial de Ajustes y Versiones</span>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {seleccionada.ajustes.map((c, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80 text-xs">
                        <div className="flex justify-between text-[11px] font-bold text-[#6E0C2B] mb-0.5">
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

            {/* Catálogo de Piezas */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#1E1920] uppercase tracking-wider">
                  Piezas en Estudio
                </h4>
                <span className="text-xs text-[#716975]">Selecciona una para inspeccionar</span>
              </div>

              <div className="space-y-3">
                {piezas.map((pieza) => {
                  const estaActiva = seleccionada.id === pieza.id;
                  return (
                    <div
                      key={pieza.id}
                      onClick={() => setSeleccionadaId(pieza.id)}
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
                            <span>{pieza.linea}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
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

      </main>
    </div>
  );
}
