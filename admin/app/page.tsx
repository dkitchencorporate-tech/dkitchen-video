"use client";

import React, { useState } from "react";
import {
  Film,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Download,
  Share2,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Eye,
  Calendar,
  Layers,
  MessageSquare,
  Lock,
  User,
  ArrowUpRight,
  TrendingUp,
  Volume2,
  Smartphone,
  Monitor,
  Menu,
  X
} from "lucide-react";

interface Pieza {
  id: string;
  codigo: string;
  titulo: string;
  tipo: "HTML / Motion" | "UGC Veo" | "Carrusel / Fijo";
  serie: string;
  estado: "borrador" | "qc" | "pendiente" | "aprobada" | "programada" | "publicada";
  duracion: string;
  fecha: string;
  videoUrl?: string;
  contactSheetUrl?: string;
  qc: {
    formato: string;
    congelados: number;
    negros: number;
    lufs: number;
    zonasSeguras: boolean;
  };
  metricas48h?: {
    retencion3s: string;
    completado: string;
    guardados: number;
  };
  guion: string;
  gancho: string;
  comentarioCambio?: string;
}

const PIEZAS_INICIALES: Pieza[] = [
  {
    id: "p-01",
    codigo: "REEL-01",
    titulo: "Tu carta, a la altura de tu cocina",
    tipo: "HTML / Motion",
    serie: "#TuCartaEn60Segundos",
    estado: "pendiente",
    duracion: "12 s",
    fecha: "2026-10-04",
    videoUrl: "https://raw.githubusercontent.com/dkitchencorporate-tech/dkitchen-video/main/reels/reel-01/reel.mp4",
    contactSheetUrl: "https://raw.githubusercontent.com/dkitchencorporate-tech/dkitchen-video/main/reels/reel-01/contact_sheet.jpg",
    qc: {
      formato: "1080x1920 30fps H.264 High (10 Mbps)",
      congelados: 0,
      negros: 0,
      lufs: -14.1,
      zonasSeguras: true
    },
    guion: "0-3s: Presentación de la carta visual en smartphone. 3-6s: Zoom a fotos apetecibles generadas con IA. 6-9s: Sala conectada y gestión de reservas en vivo. 9-12s: Cierre Gran Reserva con oferta 1 € + IVA.",
    gancho: "Tu cocina merece una carta a su altura.",
    metricas48h: {
      retencion3s: "72%",
      completado: "58%",
      guardados: 42
    }
  },
  {
    id: "p-02",
    codigo: "REEL-02",
    titulo: "Configura tu menú en 60 segundos",
    tipo: "HTML / Motion",
    serie: "#TuCartaEn60Segundos",
    estado: "pendiente",
    duracion: "16 s",
    fecha: "2026-10-04",
    videoUrl: "https://raw.githubusercontent.com/dkitchencorporate-tech/dkitchen-video/main/reels/reel-02/reel.mp4",
    contactSheetUrl: "https://raw.githubusercontent.com/dkitchencorporate-tech/dkitchen-video/main/reels/reel-02/contact_sheet.jpg",
    qc: {
      formato: "1080x1920 30fps H.264 High (11 Mbps)",
      congelados: 0,
      negros: 0,
      lufs: -14.0,
      zonasSeguras: true
    },
    guion: "0-1.8s: Gancho de dolor de cartas en papel. 1.8-6s: Paso 1, edición instantánea desde el panel móvil sin cambiar el QR. 6-11s: Paso 2, 14 alérgenos claros y fotos IA. 11-16s: Cierre Gran Reserva con oferta 1 € + IVA.",
    gancho: "¿Cuánto tardas en cambiar un plato en tu carta? Con DKitchen: 60 segundos."
  },
  {
    id: "p-03",
    codigo: "UGC-01",
    titulo: "Dejé de reimprimir cartas plastificadas",
    tipo: "UGC Veo",
    serie: "#DiarioDeUnHostelero",
    estado: "borrador",
    duracion: "22 s",
    fecha: "2026-10-05",
    qc: {
      formato: "1080x1920 30fps H.264 High (12 Mbps)",
      congelados: 0,
      negros: 0,
      lufs: -13.8,
      zonasSeguras: true
    },
    guion: "Hostelero a cámara en sala: cuenta el dolor del papel roto y la solución del QR con fotos reales.",
    gancho: "Tiré 50 cartas a la basura por cambiar el precio del chuletón."
  }
];

export default function EstudioAdmin() {
  const [piezas, setPiezas] = useState<Pieza[]>(PIEZAS_INICIALES);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<Pieza>(PIEZAS_INICIALES[0]);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [mostrarZonasSeguras, setMostrarZonasSeguras] = useState<boolean>(true);
  const [textoCambio, setTextoCambio] = useState<string>("");
  const [modalCambioAbierto, setModalCambioAbierto] = useState<boolean>(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);
  const [tabActiva, setTabActiva] = useState<"produccion" | "metricas" | "creditos">("produccion");

  const actualizarEstado = (id: string, nuevoEstado: Pieza["estado"], comentario?: string) => {
    setPiezas((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              estado: nuevoEstado,
              comentarioCambio: comentario || p.comentarioCambio
            }
          : p
      )
    );
    if (piezaSeleccionada.id === id) {
      setPiezaSeleccionada((prev) => ({
        ...prev,
        estado: nuevoEstado,
        comentarioCambio: comentario || prev.comentarioCambio
      }));
    }
  };

  const piezasFiltradas =
    filtroEstado === "todos"
      ? piezas
      : piezas.filter((p) => p.estado === filtroEstado);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen overflow-x-hidden md:overflow-hidden bg-negro text-papel font-sans">
      {/* BARRA LATERAL (Desktop & Drawer Móvil) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-negro/95 md:bg-negro border-r border-vino-dark/50 flex flex-col justify-between p-5 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          menuMovilAbierto ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo y Botón de cierre móvil */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-vino flex items-center justify-center border border-oro/40 shadow-lg shadow-vino/30">
                <span className="font-serif font-bold text-oro text-2xl">D</span>
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold tracking-wide text-papel">
                  D<span className="text-oro">K</span>itchen
                </h1>
                <p className="text-[10px] tracking-widest uppercase text-oro/70 font-display font-semibold">
                  Studio Admin
                </p>
              </div>
            </div>
            <button
              onClick={() => setMenuMovilAbierto(false)}
              className="md:hidden text-papel/70 hover:text-papel p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setTabActiva("produccion");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                tabActiva === "produccion"
                  ? "bg-vino/50 text-oro border border-oro/30 font-medium shadow-md shadow-vino/20"
                  : "text-papel/70 hover:bg-vino-dark/30 hover:text-papel"
              }`}
            >
              <Film className="w-4 h-4 text-oro" />
              <span>Lote de Producción</span>
            </button>
            <button
              onClick={() => {
                setTabActiva("metricas");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                tabActiva === "metricas"
                  ? "bg-vino/50 text-oro border border-oro/30 font-medium shadow-md shadow-vino/20"
                  : "text-papel/70 hover:bg-vino-dark/30 hover:text-papel"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-oro" />
              <span>Métricas 48h & Viralidad</span>
            </button>
            <button
              onClick={() => {
                setTabActiva("creditos");
                setMenuMovilAbierto(false);
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                tabActiva === "creditos"
                  ? "bg-vino/50 text-oro border border-oro/30 font-medium shadow-md shadow-vino/20"
                  : "text-papel/70 hover:bg-vino-dark/30 hover:text-papel"
              }`}
            >
              <Sliders className="w-4 h-4 text-oro" />
              <span>Créditos & Recursos</span>
            </button>
          </nav>

          {/* Contador de Créditos en Vivo */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-vino-dark/30 to-vino/10 border border-vino/30">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-oro font-display text-[11px] uppercase tracking-wider font-semibold">
                Fondo Flow (Veo)
              </span>
              <span className="font-bold text-papel">0 / 1.000</span>
            </div>
            <div className="w-full bg-negro h-1.5 rounded-full overflow-hidden mb-4">
              <div className="bg-oro h-full w-[0%] transition-all" />
            </div>

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-oro font-display text-[11px] uppercase tracking-wider font-semibold">
                ElevenLabs Starter
              </span>
              <span className="font-bold text-papel">0 / 30.000</span>
            </div>
            <div className="w-full bg-negro h-1.5 rounded-full overflow-hidden">
              <div className="bg-vino-light h-full w-[0%] transition-all" />
            </div>
          </div>
        </div>

        {/* Sesión de Usuario Seguro */}
        <div className="pt-4 border-t border-vino-dark/40 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-vino/60 flex items-center justify-center border border-oro/20">
            <User className="w-4 h-4 text-oro" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-papel truncate">karc0</p>
            <p className="text-[10px] text-oro/70 truncate flex items-center">
              <Lock className="w-2.5 h-2.5 mr-1" /> Acceso Exclusivo Google
            </p>
          </div>
        </div>
      </aside>

      {/* OVERLAY PARA MÓVIL */}
      {menuMovilAbierto && (
        <div
          onClick={() => setMenuMovilAbierto(false)}
          className="fixed inset-0 bg-negro/80 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto md:overflow-hidden">
        {/* CABECERA SUPERIOR RESPONSIVE */}
        <header className="h-16 border-b border-vino-dark/40 bg-negro/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMenuMovilAbierto(true)}
              className="md:hidden text-papel/80 hover:text-papel p-2 -ml-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-base md:text-lg font-semibold text-papel truncate">
              {tabActiva === "produccion" && "Control y Aprobación de Piezas"}
              {tabActiva === "metricas" && "Auditoría de Rendimiento a 48h"}
              {tabActiva === "creditos" && "Infraestructura & Consumo"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full bg-vino/30 border border-oro/30 text-oro font-medium">
              HyperFrames Engine
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold">Drive Sync</span>
            </div>
          </div>
        </header>

        {/* VISTA 1: PRODUCCIÓN Y SALA DE PROYECCIÓN */}
        {tabActiva === "produccion" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
            {/* LISTA DE PIEZAS (Colapsable o en cuadrícula según pantalla) */}
            <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-vino-dark/40 flex flex-col bg-negro/40 flex-shrink-0">
              {/* Filtros */}
              <div className="p-3 md:p-4 border-b border-vino-dark/40 flex space-x-2 overflow-x-auto no-scrollbar">
                {["todos", "pendiente", "aprobada", "borrador"].map((est) => (
                  <button
                    key={est}
                    onClick={() => setFiltroEstado(est)}
                    className={`text-xs px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition-all ${
                      filtroEstado === est
                        ? "bg-oro text-negro font-bold shadow-md shadow-oro/20"
                        : "bg-vino-dark/30 text-papel/70 hover:bg-vino-dark/60"
                    }`}
                  >
                    {est}
                  </button>
                ))}
              </div>

              {/* Items de lista */}
              <div className="flex-1 overflow-y-auto divide-y divide-vino-dark/20 p-2 space-y-1 max-h-56 lg:max-h-none">
                {piezasFiltradas.map((pieza) => (
                  <div
                    key={pieza.id}
                    onClick={() => setPiezaSeleccionada(pieza)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      piezaSeleccionada.id === pieza.id
                        ? "bg-vino/40 border border-oro/40 shadow-lg shadow-vino/20"
                        : "hover:bg-vino-dark/20 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono tracking-wider text-oro font-bold">
                        {pieza.codigo}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                          pieza.estado === "aprobada"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : pieza.estado === "pendiente"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-vino-dark text-papel/70 border border-vino"
                        }`}
                      >
                        {pieza.estado}
                      </span>
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-papel line-clamp-1 mb-1">
                      {pieza.titulo}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-papel/50">
                      <span>{pieza.serie}</span>
                      <span>{pieza.duracion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SALA DE PROYECCIÓN Y REVISIÓN */}
            <div className="flex-1 flex flex-col xl:flex-row overflow-y-auto p-4 md:p-6 lg:p-8 gap-6 md:gap-8 items-center xl:items-start justify-center">
              {/* REPRODUCTOR VERTICAL 9:16 RESPONSIVE */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 w-full max-w-[340px]">
                <div className="relative w-full aspect-[9/16] max-h-[580px] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-vino/50 flex items-center justify-center">
                  {/* Reproductor de Vídeo */}
                  {piezaSeleccionada.videoUrl ? (
                    <video
                      key={piezaSeleccionada.videoUrl}
                      src={piezaSeleccionada.videoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-papel/50">
                      <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-xs">En renderizado por Actions...</p>
                    </div>
                  )}

                  {/* Máscara de Zonas Seguras IG/TikTok */}
                  {mostrarZonasSeguras && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-oro/30">
                      <div className="absolute top-0 inset-x-0 h-[11.4%] bg-red-950/20 border-b border-red-500/30 flex items-center justify-center">
                        <span className="text-[9px] text-red-300 font-mono tracking-wider">
                          Zona Superior Oculta (220px)
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[21.8%] bg-red-950/20 border-t border-red-500/30 flex items-center justify-center">
                        <span className="text-[9px] text-red-300 font-mono tracking-wider">
                          Zona Inferior Oculta (420px)
                        </span>
                      </div>
                      <div className="absolute top-[11.4%] bottom-[21.8%] right-0 w-[6.2%] bg-red-950/20 border-l border-red-500/30" />
                    </div>
                  )}
                </div>

                {/* Controles de Vista */}
                <div className="mt-4 flex items-center justify-center space-x-3 w-full">
                  <button
                    onClick={() => setMostrarZonasSeguras(!mostrarZonasSeguras)}
                    className={`text-xs px-3.5 py-2 rounded-xl border transition-all flex items-center space-x-1.5 ${
                      mostrarZonasSeguras
                        ? "bg-oro/20 border-oro text-oro font-semibold"
                        : "border-vino-dark text-papel/60 hover:text-papel"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Zonas Seguras</span>
                  </button>
                  {piezaSeleccionada.videoUrl && (
                    <a
                      href={piezaSeleccionada.videoUrl}
                      download
                      className="text-xs px-3.5 py-2 rounded-xl bg-vino-dark/50 border border-vino text-papel/80 hover:text-papel flex items-center space-x-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar MP4</span>
                    </a>
                  )}
                </div>
              </div>

              {/* PANEL DE CONTROL DE CALIDAD Y DECISIÓN */}
              <div className="w-full max-w-xl bg-negro/80 border border-vino-dark/50 rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-mono text-oro uppercase tracking-wider font-semibold">
                        {piezaSeleccionada.tipo} · {piezaSeleccionada.serie}
                      </span>
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-papel mt-1">
                        {piezaSeleccionada.titulo}
                      </h2>
                    </div>
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider ${
                        piezaSeleccionada.estado === "aprobada"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                          : "bg-amber-950 text-amber-300 border border-amber-700"
                      }`}
                    >
                      {piezaSeleccionada.estado}
                    </span>
                  </div>

                  {/* Ficha de Guion & Gancho */}
                  <div className="p-4 rounded-xl bg-vino-dark/20 border border-vino/30 mb-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-oro uppercase tracking-wider">
                        Gancho Primeros 1.5s
                      </span>
                      <p className="text-xs md:text-sm italic text-papel/90 mt-0.5 font-serif">
                        «{piezaSeleccionada.gancho}»
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-oro uppercase tracking-wider">
                        Estructura Temporal
                      </span>
                      <p className="text-xs text-papel/70 mt-0.5 leading-relaxed">
                        {piezaSeleccionada.guion}
                      </p>
                    </div>
                  </div>

                  {/* Control de Calidad */}
                  <div className="mb-5">
                    <h4 className="text-[11px] font-bold text-oro uppercase tracking-wider mb-2.5 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                      Auditoría Técnica Gran Reserva (§3)
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-negro/60 border border-vino-dark/40">
                        <span className="text-papel/50 text-[10px] block">Formato & Bitrate</span>
                        <span className="font-semibold text-papel text-xs">
                          {piezaSeleccionada.qc.formato.split(' ')[0]} · 10-12 Mbps
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-negro/60 border border-vino-dark/40">
                        <span className="text-papel/50 text-[10px] block">Normalización Sonoridad</span>
                        <span className="font-semibold text-emerald-400 text-xs">
                          {piezaSeleccionada.qc.lufs} LUFS (Objetivo −14)
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-negro/60 border border-vino-dark/40">
                        <span className="text-papel/50 text-[10px] block">Congelados &gt; 1.5s</span>
                        <span className="font-semibold text-emerald-400 text-xs">
                          {piezaSeleccionada.qc.congelados} (Cero scroll)
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-negro/60 border border-vino-dark/40">
                        <span className="text-papel/50 text-[10px] block">Cuadros Negros</span>
                        <span className="font-semibold text-emerald-400 text-xs">
                          {piezaSeleccionada.qc.negros} detectados
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hoja de Contactos */}
                  {piezaSeleccionada.contactSheetUrl && (
                    <div className="mb-5">
                      <span className="text-[10px] font-bold text-oro uppercase tracking-wider block mb-2">
                        Hoja de Contactos (1 frame cada 2s)
                      </span>
                      <div className="rounded-xl overflow-hidden border border-vino-dark/60 bg-black">
                        <img
                          src={piezaSeleccionada.contactSheetUrl}
                          alt="Hoja de Contactos"
                          className="w-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Comentario si hubo cambio pedido */}
                  {piezaSeleccionada.comentarioCambio && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 mb-5 text-xs text-amber-200">
                      <strong>Cambio solicitado:</strong> {piezaSeleccionada.comentarioCambio}
                    </div>
                  )}
                </div>

                {/* BOTONES DE DECISIÓN (karc0) */}
                <div className="pt-4 border-t border-vino-dark/40 space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        actualizarEstado(piezaSeleccionada.id, "aprobada")
                      }
                      className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-oro-dark via-oro to-oro-light text-negro font-bold text-xs md:text-sm shadow-lg shadow-oro/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Aprobar Pieza</span>
                    </button>

                    <button
                      onClick={() => setModalCambioAbierto(true)}
                      className="w-full py-3 px-3 rounded-xl bg-vino hover:bg-vino-light text-papel font-medium text-xs md:text-sm border border-vino-light/40 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Pedir Cambio</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-papel/40">
                    Aprobación exclusiva de karc0 para pase a Meta Business & TikTok Scheduler.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: MÉTRICAS 48H */}
        {tabActiva === "metricas" && (
          <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-papel">
              Rendimiento Histórico & Retención Orgánica
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="p-5 md:p-6 rounded-2xl bg-vino-dark/30 border border-vino/40">
                <span className="text-[11px] uppercase tracking-wider text-oro font-semibold">
                  Retención Media a 3s
                </span>
                <p className="text-3xl md:text-4xl font-serif font-bold text-papel mt-2">68.4%</p>
                <p className="text-xs text-emerald-400 mt-2">
                  +14% por encima del estándar del sector
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-2xl bg-vino-dark/30 border border-vino/40">
                <span className="text-[11px] uppercase tracking-wider text-oro font-semibold">
                  Tasa de Finalización
                </span>
                <p className="text-3xl md:text-4xl font-serif font-bold text-papel mt-2">52.1%</p>
                <p className="text-xs text-emerald-400 mt-2">
                  Regla de 1.2s sin congelados efectiva
                </p>
              </div>

              <div className="p-5 md:p-6 rounded-2xl bg-vino-dark/30 border border-vino/40">
                <span className="text-[11px] uppercase tracking-wider text-oro font-semibold">
                  Oferta sin Riesgo
                </span>
                <p className="text-3xl md:text-4xl font-serif font-bold text-papel mt-2">1 € + IVA</p>
                <p className="text-xs text-oro/80 mt-2">
                  Prueba todo incluido en bio
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 3: CRÉDITOS Y RECURSOS */}
        {tabActiva === "creditos" && (
          <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-papel">
              Gestión de Fondos & Cuotas
            </h3>
            <div className="p-5 md:p-6 rounded-2xl bg-vino-dark/30 border border-vino/40 space-y-4">
              <h4 className="font-bold text-oro text-sm md:text-base">Políticas de Gasto Compartido</h4>
              <ul className="text-xs md:text-sm text-papel/80 space-y-2.5 list-disc list-inside">
                <li>
                  <strong>Flow (Google One AI Pro):</strong> 1.000 créditos compartidos. Presupuesto: 5 clips Veo por semana; imágenes con Nano Banana son gratis.
                </li>
                <li>
                  <strong>ElevenLabs Starter:</strong> 30.000 créditos mensuales (~30 minutos de locución de marca Gran Reserva).
                </li>
                <li>
                  <strong>GitHub Actions:</strong> Renderizado ilimitado sin coste gracias a la visibilidad pública del repositorio.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE PEDIR CAMBIO */}
      {modalCambioAbierto && (
        <div className="fixed inset-0 bg-negro/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-negro border border-vino rounded-2xl p-5 md:p-6 shadow-2xl">
            <h3 className="font-serif text-lg md:text-xl font-bold text-papel mb-2">
              Solicitar Ajuste a la Pieza
            </h3>
            <p className="text-xs text-papel/60 mb-4">
              Indica qué elemento debe ajustarse (ritmo, corte, tipografía, volumen o gancho). La pieza volverá a estado de borrador para corrección.
            </p>
            <textarea
              value={textoCambio}
              onChange={(e) => setTextoCambio(e.target.value)}
              placeholder="Ej: Acortar el gancho a 1.2s y subir el volumen de la voz en la escena 2..."
              rows={4}
              className="w-full p-3 rounded-xl bg-vino-dark/30 border border-vino-dark/60 text-xs md:text-sm text-papel placeholder-papel/30 focus:outline-none focus:border-oro"
            />
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => setModalCambioAbierto(false)}
                className="px-4 py-2 rounded-lg text-xs text-papel/60 hover:text-papel"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  actualizarEstado(piezaSeleccionada.id, "borrador", textoCambio);
                  setTextoCambio("");
                  setModalCambioAbierto(false);
                }}
                className="px-4 py-2 rounded-lg text-xs bg-vino hover:bg-vino-light text-papel font-medium transition-all"
              >
                Enviar a Corrección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}