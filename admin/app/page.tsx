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
  LogOut,
  Archive,
  Calendar,
  Share2,
  Copy,
  ChevronRight,
  Send,
  Sliders,
  Check
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

interface FormatoExperience {
  slug: string;
  nombre: string;
  descripcion: string;
  precioPack: string;
  img16x9: string;
  img4x5: string;
  peso16x9: string;
  peso4x5: string;
  prompt: string;
  estado: 'pendiente_aprobacion' | 'aprobada';
}

interface FlyerItem {
  id: string;
  nombre: string;
  variante: string;
  paleta: string;
  formato: string;
  urlHtml: string;
  qrUrl: string;
  utm: string;
  descripcion: string;
  estado: 'pendiente_aprobacion' | 'aprobada';
}

interface PostEstatico {
  id: string;
  tipo: 'post' | 'carrusel';
  titular: string;
  badge: string;
  imagen?: string;
  slidesCount?: number;
  copyPublicacion: string;
  enlaceUtm: string;
  tags: string[];
  estado: 'pendiente_aprobacion' | 'aprobada';
}

interface PiezaBoveda {
  id: string;
  tipo: 'video' | 'experience' | 'flyer' | 'post' | 'carrusel';
  tituloOriginal: string;
  tituloFinal: string;
  descripcionFinal: string;
  canal: 'Instagram & Facebook' | 'Instagram Reels' | 'Print & Mesa' | 'Google Business' | 'Multi-red';
  fechaProgramada: string;
  horaProgramada: string;
  estadoPublicacion: 'lista_para_programar' | 'programada' | 'publicada';
}

const PIEZAS_VIDEOS_INICIALES: PiezaEstudio[] = [
  {
    id: 'pieza-02',
    titulo: 'Pieza 02 (Master 30s): Hostelero, tu Carta en 60s · Motion Reveal Hook Directo',
    linea: 'HyperFrames CLI v0.8.140 (GSAP 3.14.2 + Anillos Shockwave + Zero Clutter + 5.5s Mega-CTA)',
    duracion: '30.0s',
    estado: 'pendiente_aprobacion',
    videoUrl: '/media/pieza-02/reel.mp4?v=20261008-03',
    contactSheetUrl: '/media/pieza-02/contact_sheet.jpg?v=20261008-03',
    lufs: '-14.0 LUFS (Álvaro ElevenLabs De-Kitchen + Lo-Fi Ducked + Bass Boom)',
    bitrate: '11,1 Mbps H.264 High (Master)',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: '08/10/2026',
    descripcion: 'Segunda pieza maestra (30 segundos exactos) con hook directo a hostelería ("Hostelero, ¿cuánto dinero gastas al mes...?"). Contraste tipográfico colosal (96px/72px), shockwave rings de alta vibración, QR pedestal noble sin microtextos, smartphone hero en cristal obsidian con Balfegó real y subida de margen live (24€ a 29€), 0% comisiones colosal y 5.5 segundos completos de Mega-CTA flotante con música ininterrumpida.',
    zonasSeguras: 'cumplidas',
    ajustes: []
  },
  {
    id: 'pieza-01',
    titulo: 'Pieza 01 (Master 30s): Tu Carta en 60s · HyperFrames Motion Editorial',
    linea: 'HyperFrames CLI v0.8.140 (GSAP 3.14.2 + B-Roll Real + 60/60 WCAG AA)',
    duracion: '30.0s',
    estado: 'pendiente_aprobacion',
    videoUrl: '/media/pieza-01/reel.mp4?v=20261008-03',
    contactSheetUrl: '/media/pieza-01/contact_sheet.jpg?v=20261008-03',
    lufs: '-14.0 LUFS (Álvaro + Lo-Fi Ducked + SFX Stems)',
    bitrate: '11,1 Mbps H.264 High (Master)',
    formato: '1080x1920 (9:16 Vertical)',
    fps: 30,
    fecha: '07/10/2026',
    descripcion: 'Edición cinematográfica editorial de alto nivel (30 segundos). Motor HyperFrames CLI v0.8.140 + GSAP 3.14.2. Hook de dolor con B-roll gastronómico real, escaneo láser sobre QR noble de madera, smartphone hero interactivo con fotos IA ultra-HD y cambio de precio en vivo de 24€ a 29€ (+5€ margen), suite operativa en tríptico calibrado a zonas seguras (Comandero, Carta, Cero comisiones) y Mega-CTA Gran Reserva por 1,00 €.',
    zonasSeguras: 'cumplidas',
    ajustes: []
  }
];

const FORMATOS_EXPERIENCE_INICIALES: FormatoExperience[] = [
  {
    slug: 'noche-de-maridaje',
    nombre: 'Noche de Maridaje',
    descripcion: 'Catas guiadas de bodega y platos diseñados para armonizar con cada etiqueta. Ideal para jueves de fidelización de ticket medio alto.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-noche-de-maridaje-16x9.webp',
    img4x5: '/media/experience/experience-noche-de-maridaje-4x5.webp',
    peso16x9: '123 KB',
    peso4x5: '117 KB',
    prompt: 'Cinematic food photography of an intimate wine pairing dinner in a luxury Spanish restaurant, crystal wine glasses with rich red wine next to artfully plated gourmet dishes, warm candle glow, dark deep obsidian background with amber and dark burgundy wine accents, shallow depth of field f/1.8 bokeh, elegant rustic table, no logos, no text, no visible human faces.',
    estado: 'pendiente_aprobacion'
  },
  {
    slug: 'mesa-del-chef',
    nombre: 'Mesa del Chef',
    descripcion: 'Experiencia inmersiva y exclusiva frente al pase de cocina o con interacción directa con el equipo gastronómico.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-mesa-del-chef-16x9.webp',
    img4x5: '/media/experience/experience-mesa-del-chef-4x5.webp',
    peso16x9: '136 KB',
    peso4x5: '133 KB',
    prompt: "Cinematic high-end chef's table culinary experience in an open kitchen, chef hands precisely arranging delicate herbs on a signature Michelin-star dish, warm tungsten spotlighting, copper pans in soft background blur, amber and burgundy tones, rich texture, no logos, no readable text, no recognizable faces.",
    estado: 'pendiente_aprobacion'
  },
  {
    slug: 'brunch-de-domingo',
    nombre: 'Brunch de Domingo',
    descripcion: 'Rentabiliza las mañanas de domingo con una propuesta gourmet fresca, apetecible y de alta rotación familiar y de amigos.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-brunch-de-domingo-16x9.webp',
    img4x5: '/media/experience/experience-brunch-de-domingo-4x5.webp',
    peso16x9: '212 KB',
    peso4x5: '277 KB',
    prompt: 'Bright warm gourmet Sunday brunch table in a boutique Mediterranean bistro, artisanal sourdough toast with poached eggs and creamy hollandaise, fresh seasonal fruits, ceramic coffee cups, warm morning sun streaming through window, amber highlights with subtle wine velvet accents, no logos, no text, no recognizable faces.',
    estado: 'pendiente_aprobacion'
  },
  {
    slug: 'viaje-gastronomico',
    nombre: 'Viaje Gastronómico',
    descripcion: 'Menús degustación temáticos por regiones o continentes para dinamizar semanas valle y atraer a público curioso.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-viaje-gastronomico-16x9.webp',
    img4x5: '/media/experience/experience-viaje-gastronomico-4x5.webp',
    peso16x9: '201 KB',
    peso4x5: '212 KB',
    prompt: 'Cinematic international gastronomic journey dining experience, multi-course world cuisine tasting menu with exotic spices, artisanal Japanese, Mexican and Mediterranean gourmet dishes harmoniously presented, warm candlelight, deep rich wooden background, amber and dark crimson accents, no logos, no text, no recognizable faces.',
    estado: 'pendiente_aprobacion'
  },
  {
    slug: 'taller-en-vivo',
    nombre: 'Taller en Vivo',
    descripcion: 'Masterclasses interactivas donde los comensales aprenden una técnica gastronómica y posteriormente cenan el menú preparado.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-taller-en-vivo-16x9.webp',
    img4x5: '/media/experience/experience-taller-en-vivo-4x5.webp',
    peso16x9: '170 KB',
    peso4x5: '149 KB',
    prompt: 'Interactive live cooking workshop masterclass in a professional culinary studio kitchen, hands of participants learning pasta and culinary techniques around a central wooden marble prep island, chef demonstrating, copper pans, warm ambient lighting with gold accents, engaging culinary atmosphere, no logos, no text, no recognizable faces.',
    estado: 'pendiente_aprobacion'
  },
  {
    slug: 'afterwork-con-musica',
    nombre: 'Afterwork con Música',
    descripcion: 'Combinación de tapas de autor, coctelería y sesión acústica suave para captar clientela corporativa al salir de la oficina.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-afterwork-con-musica-16x9.webp',
    img4x5: '/media/experience/experience-afterwork-con-musica-4x5.webp',
    peso16x9: '79 KB',
    peso4x5: '120 KB',
    prompt: 'Ambiente animado de barra de gastrobar al atardecer, pinchos y tapas gourmet, copas y aperitivos con iluminación cálida de bistró, sin marcas ni caras.',
    estado: 'pendiente_aprobacion'
  },
  {
    slug: 'reto-o-batalla',
    nombre: 'Reto o Batalla',
    descripcion: 'Duelo culinario en sala con dos propuestas gastronómicas y sistema de votación directa por parte de los clientes.',
    precioPack: '299 € (+ IVA) / 199 € clientes QR',
    img16x9: '/media/experience/experience-reto-o-batalla-16x9.webp',
    img4x5: '/media/experience/experience-reto-o-batalla-4x5.webp',
    peso16x9: '87 KB',
    peso4x5: '130 KB',
    prompt: 'Duelo gastronómico de autor en mesa de catas a ciegas, dos propuestas culinarias frente a frente con emplatados audaces y contrastados, fondo cálido sin textos.',
    estado: 'pendiente_aprobacion'
  }
];

const FLYERS_INICIALES: FlyerItem[] = [
  {
    id: 'flyer-maestro-a4-doble-cara',
    nombre: 'Flyer Maestro Oficial A4 (Dos Caras Imprenta)',
    variante: 'Pase Exclusivo Editorial Gran Reserva (Sin Fondo Negro)',
    paleta: '#FBF9F5 (Crema Editorial), #6E0C2B (Vino Tinto), #C59B27 (Oro Noble), #1A151E (Tinta)',
    formato: 'A4 Vertical (210×297 mm) + 3 mm sangrado a 300 ppp (Cara A Anverso + Cara B Reverso)',
    urlHtml: '/media/flyers/flyer_maestro_a4_doble_cara.html',
    qrUrl: 'https://dkitchencorporate.es/qr?utm_source=flyer&utm_medium=print&utm_campaign=arranque_oct26',
    utm: 'utm_source=flyer&utm_medium=print&utm_campaign=arranque_oct26',
    descripcion: 'Diseño de credencial exclusiva para alta gastronomía. Cara A: Credencial/Pase Exclusivo con sello lacre Gran Reserva. Cara B: Manifiesto Tecnológico, 3 Pilares y Llave de Activación QR (35 mm) a 1,00 € con UTM estrictas. Cero fondos negros para impresión impecable a dos caras.',
    estado: 'pendiente_aprobacion'
  }
];

const PIEZAS_ESTATICAS_INICIALES: PostEstatico[] = [
  {
    id: 'post-01',
    tipo: 'post',
    titular: '¿Sigues reimprimiendo cartas en papel cada vez que cambias un precio?',
    badge: 'Fuga de Beneficio',
    imagen: '/media/posts/01-presentacion.jpg',
    copyPublicacion: '¿Cuánto dinero y tiempo le cuesta a tu restaurante cambiar 3 precios o quitar un plato agotado? 🍽️ Con DKitchen, abres tu teléfono, cambias el precio en 10 segundos y tus mesas ya lo tienen actualizado. Sin reimprimir nada jamás. 👉 Activa tu carta digital con el primer mes por solo 1 € (+ IVA). Alta de 159 € incluida en la prueba.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#DKitchen', '#HosteleriaMadrid', '#RestaurantesMadrid', '#CartaDigital'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'post-02',
    tipo: 'post',
    titular: 'Tu carta digital lista en 60 segundos.',
    badge: 'Agilidad en Sala',
    imagen: '/media/posts/02-primer-mes.jpg',
    copyPublicacion: 'Cambiar de carta no debería ser un dolor de cabeza de dos semanas. En DKitchen cualquier miembro de tu equipo puede añadir una sugerencia del día en menos de 1 minuto. Tu QR en mesa no cambia nunca; tu contenido evoluciona con tu cocina. 🍷 Prueba por 1 € el primer mes.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#Restaurantes', '#DigitalizacionGastronomica', '#CartaQR'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'post-03',
    tipo: 'post',
    titular: '14 alérgenos claros. Cero dudas en mesa.',
    badge: 'Normativa UE Blindada',
    imagen: '/media/posts/04-alergenos.jpg',
    copyPublicacion: 'El 80% de las dudas en sala ocurren por comensales preguntando qué platos llevan gluten, lactosa o frutos secos. Con DKitchen, cada plato cuenta con sus 14 iconos normalizados. El cliente filtra en un toque desde su teléfono y pide seguro. Cumple normativa desde 1 €.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#Alergenos', '#HosteleriaSegura', '#RestaurantesMadrid'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'post-04',
    tipo: 'post',
    titular: '0% Comisiones. Todo el margen es para tu cocina.',
    badge: 'Margen Protegido',
    imagen: '/media/posts/05-signature.jpg',
    copyPublicacion: 'Hay plataformas que se quedan entre el 15% y el 30% de cada pedido. En DKitchen creemos que el hostelero debe ser dueño de su negocio. Cuota plana fija, sin porcentajes de ventas. Tus clientes pagan en tu pasarela y tu dinero va a tu cuenta. 💡 Consulta tarifas en dkitchencorporate.es/precios.',
    enlaceUtm: 'https://dkitchencorporate.es/precios?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#RentabilidadRestaurante', '#CeroComisiones', '#DKitchen'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'post-05',
    tipo: 'post',
    titular: 'Tu cocina es de autor... No la enseñes como si fuera un PDF.',
    badge: 'Alta Definición',
    imagen: '/media/posts/06-fotos-ia.jpg',
    copyPublicacion: 'Un PDF ampliado en el móvil con letra minúscula no es una carta digital; es una mala experiencia. Cuando un comensal ve el corte de carne chisporroteando o el maridaje sugerido en alta resolución, el ticket medio sube de forma natural (+18% en promedio de sala). Dale a tu producto el soporte que merece.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#GastroMarketing', '#FoodDesign', '#RestaurantesEspana'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'post-06',
    tipo: 'post',
    titular: 'Tu restaurante en el siglo XXI por 1 € (+ IVA).',
    badge: 'Oferta de Arranque',
    imagen: '/media/posts/03-antes-despues.jpg',
    copyPublicacion: 'Queremos que compruebes en tu propio servicio lo que cambia tener la sala conectada. Durante 30 días, disfruta de todas las funciones de la Carta Digital Ampliada de DKitchen por solo 1 € (+ IVA). Te incluimos el alta de 159 €, subimos tu carta y te dejamos todo preparado hoy mismo.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#DKitchen', '#RestaurantesMadrid', '#HosteleriaDigital'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'carrusel-01',
    tipo: 'carrusel',
    titular: 'Los 4 Dolores Que Una Carta en Papel Le Causa a Tu Restaurante',
    badge: 'Radiografía de Sala',
    slidesCount: 5,
    copyPublicacion: 'Desliza para ver la radiografía real del coste del papel en hostelería: 1. Reimpresión constante (200€-600€/año). 2. Platos tachados a boli que degradan la marca. 3. Dudas de alérgenos colapsando al camarero en hora punta. 4. La solución: DKitchen QR con cambios inmediatos y 1 € el primer mes.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#GestionHostelera', '#CartaEnPapel', '#DKitchen'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'carrusel-02',
    tipo: 'carrusel',
    titular: 'Paso a Paso: Cómo Funciona DKitchen en Tu Sala',
    badge: 'Operativa de Sala',
    slidesCount: 5,
    copyPublicacion: 'Mira cómo es el flujo real: 1. El cliente escanea el QR en mesa sin descargar app. 2. Disfruta de fotos apetecibles y filtros de alérgenos. 3. Tú ocultas platos agotados o cambias precios en 5s desde el móvil. Activa tu mes de prueba por 1 € (+ IVA) con alta bonificada.',
    enlaceUtm: 'https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#OperativaRestaurante', '#CartaQR', '#Hosteleria'],
    estado: 'pendiente_aprobacion'
  },
  {
    id: 'carrusel-03',
    tipo: 'carrusel',
    titular: 'DKitchen Experience: Cómo Llenar Tu Restaurante los Días Flojos',
    badge: 'Eventos Gastronómicos',
    slidesCount: 8,
    copyPublicacion: '¿Mesas vacías los martes o miércoles? Presentamos los 7 formatos oficiales de DKitchen Experience: Noche de Maridaje, Mesa del Chef, Brunch de Domingo, Viaje Gastronómico, Taller en Vivo, Afterwork con Música y Reto Culinario. Formato llave en mano desde 299 € (o 199 € para clientes QR). El 100% de la venta es de tu sala.',
    enlaceUtm: 'https://dkitchencorporate.es/experience?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26',
    tags: ['#DKitchenExperience', '#EventosGastronomicos', '#Maridaje'],
    estado: 'pendiente_aprobacion'
  }
];

export default function DashboardAdmin() {
  const [moduloActivo, setModuloActivo] = useState<'videos' | 'imagenes' | 'carruseles' | 'flyers' | 'vault'>('videos');
  
  // Estados de datos
  const [piezasVideo, setPiezasVideo] = useState<PiezaEstudio[]>(PIEZAS_VIDEOS_INICIALES);
  const [formatosExp, setFormatosExp] = useState<FormatoExperience[]>(FORMATOS_EXPERIENCE_INICIALES);
  const [flyers, setFlyers] = useState<FlyerItem[]>(FLYERS_INICIALES);
  const [postsEstaticos, setPostsEstaticos] = useState<PostEstatico[]>(PIEZAS_ESTATICAS_INICIALES);
  const [boveda, setBoveda] = useState<PiezaBoveda[]>([]);

  // Estados de selección
  const [videoSeleccionadoId, setVideoSeleccionadoId] = useState<string>('v1-la-carta-en-llamas');
  const [formatoExpSeleccionado, setFormatoExpSeleccionado] = useState<string>('noche-de-maridaje');
  const [vistaRelacionExp, setVistaRelacionExp] = useState<'16x9' | '4x5'>('16x9');
  const [flyerSeleccionadoId, setFlyerSeleccionadoId] = useState<string>('flyer-propuesta-a');
  
  // UI auxiliares
  const [mostrarZonasSeguras, setMostrarZonasSeguras] = useState(false);
  const [pestañaVideo, setPestañaVideo] = useState<'video' | 'sheet'>('video');
  const [modalAjusteAbierto, setModalAjusteAbierto] = useState(false);
  const [textoAjuste, setTextoAjuste] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Cargar estado guardado de Vault desde localStorage si existe
  useEffect(() => {
    try {
      const bovedaGuardada = localStorage.getItem('dkitchen_vault_piezas');
      if (bovedaGuardada) {
        setBoveda(JSON.parse(bovedaGuardada));
      }
    } catch {
      // ignorar
    }
  }, []);

  const persistirBoveda = (nuevaBoveda: PiezaBoveda[]) => {
    setBoveda(nuevaBoveda);
    try {
      localStorage.setItem('dkitchen_vault_piezas', JSON.stringify(nuevaBoveda));
    } catch {
      // ignorar
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  const copiarPortapapeles = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2500);
  };

  // Acciones de Aprobación hacia Vault
  const aprobarVideo = (video: PiezaEstudio) => {
    setPiezasVideo(prev => prev.map(p => p.id === video.id ? { ...p, estado: 'aprobada' } : p));
    const existeEnBoveda = boveda.some(b => b.id === video.id);
    if (!existeEnBoveda) {
      const nuevaPieza: PiezaBoveda = {
        id: video.id,
        tipo: 'video',
        tituloOriginal: video.titulo,
        tituloFinal: video.titulo,
        descripcionFinal: video.descripcion + ' \n\n🔗 Prueba 1 € en: https://dkitchencorporate.es/qr?utm_source=instagram&utm_medium=reels&utm_campaign=arranque_oct26',
        canal: 'Instagram Reels',
        fechaProgramada: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        horaProgramada: '13:30',
        estadoPublicacion: 'lista_para_programar'
      };
      persistirBoveda([nuevaPieza, ...boveda]);
    }
    setMensajeExito(`¡Vídeo «${video.id}» aprobado y enviado al Vault de publicaciones!`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const aprobarExperience = (exp: FormatoExperience) => {
    setFormatosExp(prev => prev.map(f => f.slug === exp.slug ? { ...f, estado: 'aprobada' } : f));
    const existeEnBoveda = boveda.some(b => b.id === `exp-${exp.slug}`);
    if (!existeEnBoveda) {
      const nuevaPieza: PiezaBoveda = {
        id: `exp-${exp.slug}`,
        tipo: 'experience',
        tituloOriginal: `DKitchen Experience: ${exp.nombre}`,
        tituloFinal: `Planifica tu evento «${exp.nombre}» con DKitchen`,
        descripcionFinal: `${exp.descripcion}\n\nPack llave en mano por ${exp.precioPack}. Vende tus entradas y consumiciones sin intermediarios.\n\n🔗 Reserva fecha: https://dkitchencorporate.es/experience?utm_source=instagram&utm_medium=social&utm_campaign=arranque_oct26`,
        canal: 'Instagram & Facebook',
        fechaProgramada: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        horaProgramada: '19:00',
        estadoPublicacion: 'lista_para_programar'
      };
      persistirBoveda([nuevaPieza, ...boveda]);
    }
    setMensajeExito(`¡Formato «${exp.nombre}» aprobado y añadido al Vault!`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const aprobarFlyer = (flyer: FlyerItem) => {
    setFlyers(prev => prev.map(f => f.id === flyer.id ? { ...f, estado: 'aprobada' } : f));
    const existeEnBoveda = boveda.some(b => b.id === flyer.id);
    if (!existeEnBoveda) {
      const nuevaPieza: PiezaBoveda = {
        id: flyer.id,
        tipo: 'flyer',
        tituloOriginal: flyer.nombre,
        tituloFinal: `${flyer.nombre} (Listo para Imprenta)`,
        descripcionFinal: `Arte final vectorial preparado para producción en imprenta (A5/A6 300 ppp CMYK). QR directo a checkout con UTM: ${flyer.qrUrl}`,
        canal: 'Print & Mesa',
        fechaProgramada: new Date().toISOString().split('T')[0],
        horaProgramada: '10:00',
        estadoPublicacion: 'lista_para_programar'
      };
      persistirBoveda([nuevaPieza, ...boveda]);
    }
    setMensajeExito(`¡${flyer.nombre} aprobado y guardado en Vault para orden de imprenta!`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const aprobarPostEstatico = (item: PostEstatico) => {
    setPostsEstaticos(prev => prev.map(p => p.id === item.id ? { ...p, estado: 'aprobada' } : p));
    const existeEnBoveda = boveda.some(b => b.id === item.id);
    if (!existeEnBoveda) {
      const nuevaPieza: PiezaBoveda = {
        id: item.id,
        tipo: item.tipo,
        tituloOriginal: item.titular,
        tituloFinal: item.titular,
        descripcionFinal: `${item.copyPublicacion}\n\n🔗 ${item.enlaceUtm}\n\n${item.tags.join(' ')}`,
        canal: 'Multi-red',
        fechaProgramada: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        horaProgramada: '12:00',
        estadoPublicacion: 'lista_para_programar'
      };
      persistirBoveda([nuevaPieza, ...boveda]);
    }
    setMensajeExito(`¡Pieza «${item.titular}» aprobada y añadida al Vault!`);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const actualizarItemBoveda = (id: string, campos: Partial<PiezaBoveda>) => {
    const actualizada = boveda.map(item => item.id === id ? { ...item, ...campos } : item);
    persistirBoveda(actualizada);
    setMensajeExito('Cambios en el Vault guardados correctamente.');
    setTimeout(() => setMensajeExito(null), 2500);
  };

  const eliminarDeBoveda = (id: string) => {
    const filtrada = boveda.filter(item => item.id !== id);
    persistirBoveda(filtrada);
    setMensajeExito('Pieza retirada del Vault.');
    setTimeout(() => setMensajeExito(null), 2500);
  };

  const videoSeleccionado = piezasVideo.find(p => p.id === videoSeleccionadoId) || piezasVideo[0];
  const expSeleccionado = formatosExp.find(f => f.slug === formatoExpSeleccionado) || formatosExp[0];
  const flyerSeleccionado = flyers.find(f => f.id === flyerSeleccionadoId) || flyers[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1920] font-sans antialiased selection:bg-[#6E0C2B] selection:text-white pb-24">
      {/* Toast de notificación */}
      {mensajeExito && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1920] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-[#D9B25C] animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{mensajeExito}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#6E0C2B] flex items-center justify-center shadow-xs text-white font-bold text-lg tracking-tighter shrink-0">
              DK
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#1E1920] truncate">DKitchen Studio Admin</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
                  Gran Reserva
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesión Segura (karc0)</span>
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

        {/* Barra de Pestañas / Módulos de Contenido */}
        <div className="border-t border-[#F0EBE1] bg-[#FAF8F5] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setModuloActivo('videos')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                moduloActivo === 'videos'
                  ? 'bg-[#6E0C2B] text-white shadow-xs'
                  : 'bg-white text-[#716975] hover:text-[#1E1920] border border-[#E8E2D5]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeo Master Oficial</span>
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
              <span>Experience (14 Fotos WebP)</span>
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
              <span>Flyers Maestro (A5/A6)</span>
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
              <span>Posts & Carruseles (6+3)</span>
            </button>

            <button
              onClick={() => setModuloActivo('vault')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                moduloActivo === 'vault'
                  ? 'bg-[#D9B25C] text-[#1E1920] shadow-md border border-[#C29D47]'
                  : 'bg-[#F4EBE1] text-[#6E0C2B] hover:bg-[#EBDCCF] border border-[#E3D3C4]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Vault de Aprobadas ({boveda.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ========================================================= */}
        {/* MÓDULO 1: VÍDEOS (MOTION & REELS)                         */}
        {/* ========================================================= */}
        {moduloActivo === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visor 9:16 Vertical */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-3xl p-3 sm:p-4 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Smartphone className="w-4 h-4 text-[#6E0C2B] shrink-0" />
                    <span className="text-xs font-bold text-[#1E1920] truncate">Visor Móvil 9:16</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPestañaVideo('video')}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        pestañaVideo === 'video' 
                          ? 'bg-[#6E0C2B] text-white shadow-xs' 
                          : 'bg-[#F7F4EE] text-[#716975]'
                      }`}
                    >
                      Vídeo
                    </button>
                    <button
                      onClick={() => setPestañaVideo('sheet')}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        pestañaVideo === 'sheet' 
                          ? 'bg-[#6E0C2B] text-white shadow-xs' 
                          : 'bg-[#F7F4EE] text-[#716975]'
                      }`}
                    >
                      Mosaico
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-[#E8E2D5] flex items-center justify-center text-center">
                  {pestañaVideo === 'video' ? (
                    videoSeleccionado.videoUrl ? (
                      <video
                        key={videoSeleccionado.videoUrl}
                        src={videoSeleccionado.videoUrl}
                        controls
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain bg-black"
                      >
                        Tu navegador no soporta vídeo HTML5.
                      </video>
                    ) : (
                      <div className="p-6 space-y-3">
                        <Film className="w-10 h-10 text-[#D9B25C] mx-auto opacity-70" />
                        <div className="text-white text-xs font-bold uppercase tracking-wider">{videoSeleccionado.id}</div>
                      </div>
                    )
                  ) : (
                    videoSeleccionado.contactSheetUrl ? (
                      <div className="w-full h-full overflow-y-auto bg-neutral-900">
                        <img 
                          src={videoSeleccionado.contactSheetUrl} 
                          alt="Hoja de Contactos"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-neutral-400 text-xs p-6">Mosaico no disponible.</div>
                    )
                  )}

                  {mostrarZonasSeguras && pestañaVideo === 'video' && (
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

            {/* Ficha Técnica y Controles */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EBE1]">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E0C2B]">{videoSeleccionado.linea}</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1920] mt-0.5 break-words">{videoSeleccionado.titulo}</h3>
                  </div>
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      videoSeleccionado.estado === 'aprobada' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {videoSeleccionado.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A434F] my-3 leading-relaxed">
                  {videoSeleccionado.descripcion}
                </p>

                {/* Caja de Decisión */}
                <div className="p-3.5 rounded-2xl bg-[#FDF9F3] border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-3">
                  <div>
                    <div className="text-xs font-bold text-[#1E1920]">Revisión de Dirección</div>
                    <div className="text-[11px] text-[#716975]">Aprueba para enviar a la Bóveda de Publicaciones programadas.</div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => aprobarVideo(videoSeleccionado)}
                      className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Aprobar y Enviar al Vault</span>
                    </button>
                  </div>
                </div>

                {/* Métricas de Audio y Vídeo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Formato</span>
                    </div>
                    <div className="text-xs font-bold text-[#1E1920] mt-0.5 truncate">{videoSeleccionado.formato}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Duración</span>
                    </div>
                    <div className="text-xs font-bold text-[#1E1920] mt-0.5">{videoSeleccionado.duracion} ({videoSeleccionado.fps} fps)</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <Volume2 className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Audio</span>
                    </div>
                    <div className="text-[11px] font-bold text-[#1E1920] mt-0.5 truncate">{videoSeleccionado.lufs}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]/80">
                    <div className="text-[10px] font-medium text-[#716975] flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3 text-[#6E0C2B]" />
                      <span>Zonas Seguras</span>
                    </div>
                    <div className={`text-xs font-bold mt-0.5 ${videoSeleccionado.zonasSeguras === 'cumplidas' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {videoSeleccionado.zonasSeguras === 'cumplidas' ? 'Blindadas' : 'Ajustar'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de selección de reels */}
              <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1E1920] uppercase tracking-wider">
                    Catálogo de Vídeos
                  </h4>
                  <span className="text-[11px] text-[#716975]">{piezasVideo.length} disponibles</span>
                </div>

                <div className="space-y-2.5">
                  {piezasVideo.map((pieza) => {
                    const estaActiva = videoSeleccionado.id === pieza.id;
                    return (
                      <div
                        key={pieza.id}
                        onClick={() => setVideoSeleccionadoId(pieza.id)}
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
                            <h5 className="text-xs font-bold text-[#1E1920] truncate">{pieza.titulo}</h5>
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

        {/* ========================================================= */}
        {/* MÓDULO 2: IMÁGENES EXPERIENCE (LOS 7 FORMATOS WEBP)       */}
        {/* ========================================================= */}
        {moduloActivo === 'imagenes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E0C2B]">DKitchen Experience</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1920] mt-0.5">{expSeleccionado.nombre}</h3>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setVistaRelacionExp('16x9')}
                      className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
                        vistaRelacionExp === '16x9' ? 'bg-[#6E0C2B] text-white' : 'bg-[#F7F4EE] text-[#716975]'
                      }`}
                    >
                      16:9 Web (1920×1080)
                    </button>
                    <button
                      onClick={() => setVistaRelacionExp('4x5')}
                      className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
                        vistaRelacionExp === '4x5' ? 'bg-[#6E0C2B] text-white' : 'bg-[#F7F4EE] text-[#716975]'
                      }`}
                    >
                      4:5 Feed (1200×1500)
                    </button>
                  </div>
                </div>

                {/* Previsualizador de la imagen WebP */}
                <div className="relative rounded-2xl overflow-hidden bg-black/90 border border-[#E8E2D5] my-4 flex items-center justify-center">
                  <img
                    src={vistaRelacionExp === '16x9' ? expSeleccionado.img16x9 : expSeleccionado.img4x5}
                    alt={expSeleccionado.nombre}
                    className="max-h-[500px] w-auto object-contain mx-auto transition-transform hover:scale-102 duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/20">
                    WebP &lt; 300 KB ({vistaRelacionExp === '16x9' ? expSeleccionado.peso16x9 : expSeleccionado.peso4x5})
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FDF9F3] border border-[#E8E2D5] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#1E1920]">Ficha de Formato Oficial</div>
                    <div className="text-[11px] text-[#716975]">Precio del Pack: <span className="font-semibold text-[#6E0C2B]">{expSeleccionado.precioPack}</span></div>
                  </div>
                  <button
                    onClick={() => aprobarExperience(expSeleccionado)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Aprobar y Mandar al Vault</span>
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs font-bold text-[#1E1920]">Prompt de Generación (Sin Marcas ni Caras):</div>
                  <p className="text-xs text-[#716975] bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D5] font-mono leading-relaxed">
                    {expSeleccionado.prompt}
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de los 7 Formatos */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1E1920] uppercase tracking-wider">
                    Los 7 Formatos Oficiales (14 WebP)
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    100% Sin Marcas
                  </span>
                </div>

                <div className="space-y-2.5">
                  {formatosExp.map((item) => {
                    const activo = item.slug === expSeleccionado.slug;
                    return (
                      <div
                        key={item.slug}
                        onClick={() => setFormatoExpSeleccionado(item.slug)}
                        className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                          activo
                            ? 'bg-[#FDF9F3] border-[#6E0C2B] ring-1 ring-[#6E0C2B]/20 shadow-xs'
                            : 'bg-white border-[#E8E2D5] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={item.img16x9}
                            alt={item.nombre}
                            className="w-12 h-10 object-cover rounded-lg border border-[#E8E2D5] shrink-0"
                          />
                          <div className="truncate">
                            <h5 className="text-xs font-bold text-[#1E1920] truncate">{item.nombre}</h5>
                            <div className="text-[10px] text-[#716975] truncate mt-0.5">
                              {item.slug} • {item.peso16x9}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                          item.estado === 'aprobada'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.estado === 'aprobada' ? 'Aprobada' : 'Revisar'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MÓDULO 3: FLYERS MAESTROS (A5/A6 CON QR + UTM)           */}
        {/* ========================================================= */}
        {moduloActivo === 'flyers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E0C2B]">Flyer Maestro de Imprenta</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1920] mt-0.5">{flyerSeleccionado.nombre}</h3>
                  </div>
                  <a
                    href={flyerSeleccionado.urlHtml}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-xs font-semibold text-[#6E0C2B] border border-[#E8E2D5] hover:bg-[#F4EBE1]"
                  >
                    <span>Abrir en Pestaña</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Previsualizador iframe del HTML del Flyer */}
                <div className="w-full bg-[#1E1920]/5 rounded-2xl p-4 my-4 border border-[#E8E2D5] flex items-center justify-center overflow-hidden">
                  <iframe
                    src={flyerSeleccionado.urlHtml}
                    title={flyerSeleccionado.nombre}
                    className="w-full max-w-[500px] h-[640px] rounded-xl shadow-lg border border-[#E8E2D5] bg-white"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FDF9F3] border border-[#E8E2D5] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#1E1920]">Verificación Técnica de Imprenta</div>
                    <div className="text-[11px] text-[#716975]">QR de 30mm probado con UTM estricta hacia /qr. Sin oferta Fundador.</div>
                  </div>
                  <button
                    onClick={() => aprobarFlyer(flyerSeleccionado)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Aprobar Propuesta</span>
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E1920]">
                    <span>URL Destino del Código QR:</span>
                    <button
                      onClick={() => copiarPortapapeles(flyerSeleccionado.qrUrl, flyerSeleccionado.id)}
                      className="text-[#6E0C2B] hover:underline flex items-center space-x-1"
                    >
                      {copiadoId === flyerSeleccionado.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiadoId === flyerSeleccionado.id ? 'Copiado' : 'Copiar URL'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-[#716975] break-all bg-white p-2 rounded-lg border border-[#E8E2D5]">
                    {flyerSeleccionado.qrUrl}
                  </div>
                </div>
              </div>
            </div>

            {/* Selector de Propuestas A y B */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs">
                <h4 className="text-xs sm:text-sm font-bold text-[#1E1920] uppercase tracking-wider mb-3">
                  Propuestas de Imprenta
                </h4>

                <div className="space-y-3">
                  {flyers.map((flyer) => {
                    const activo = flyer.id === flyerSeleccionado.id;
                    return (
                      <div
                        key={flyer.id}
                        onClick={() => setFlyerSeleccionadoId(flyer.id)}
                        className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                          activo
                            ? 'bg-[#FDF9F3] border-[#6E0C2B] ring-1 ring-[#6E0C2B]/20 shadow-xs'
                            : 'bg-white border-[#E8E2D5] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-[#1E1920]">{flyer.nombre}</h5>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            flyer.estado === 'aprobada'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {flyer.estado === 'aprobada' ? 'Aprobado' : 'Revisar'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#716975] mt-1.5 leading-relaxed">{flyer.descripcion}</p>
                        <div className="mt-2 text-[10px] font-mono text-[#6E0C2B] bg-white/70 p-1.5 rounded border border-[#E8E2D5]">
                          {flyer.paleta}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MÓDULO 4: POSTS Y CARRUSELES ESTÁTICOS                    */}
        {/* ========================================================= */}
        {moduloActivo === 'carruseles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E0C2B]">Campaña de Arranque Redes</span>
                <h3 className="text-base sm:text-lg font-bold text-[#1E1920]">6 Posts Estáticos y 3 Carruseles de Autor</h3>
                <p className="text-xs text-[#716975] mt-0.5">Listos con copys persuasivos, badges de valor y enlaces con UTM individual.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#FAF8F5] border border-[#E8E2D5] px-3 py-1.5 rounded-xl font-semibold text-[#1E1920]">
                  {postsEstaticos.filter(p => p.estado === 'aprobada').length} de {postsEstaticos.length} Aprobadas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {postsEstaticos.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
                        {item.badge}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.estado === 'aprobada'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.tipo === 'carrusel' ? `Carrusel (${item.slidesCount} slides)` : 'Post 4:5'}
                      </span>
                    </div>

                    {item.imagen && (
                      <div className="relative rounded-2xl overflow-hidden bg-neutral-100 border border-[#E8E2D5] aspect-4/5 flex items-center justify-center">
                        <img
                          src={item.imagen}
                          alt={item.titular}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <h4 className="text-sm font-bold text-[#1E1920] leading-snug">
                      {item.titular}
                    </h4>

                    <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E2D5] text-xs text-[#4A434F] max-h-36 overflow-y-auto leading-relaxed">
                      {item.copyPublicacion}
                    </div>

                    <div className="text-[10px] font-mono text-[#716975] truncate bg-white p-1.5 rounded border border-[#E8E2D5]">
                      {item.enlaceUtm}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
                    <button
                      onClick={() => copiarPortapapeles(item.copyPublicacion, item.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#716975] hover:bg-[#F7F4EE] border border-[#E8E2D5] flex items-center space-x-1"
                    >
                      {copiadoId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiadoId === item.id ? 'Copiado' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => aprobarPostEstatico(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1 ${
                        item.estado === 'aprobada'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.estado === 'aprobada' ? 'Aprobada' : 'Aprobar'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MÓDULO 5: VAULT (BÓVEDA DE PUBLICACIONES & PROGRAMACIÓN)   */}
        {/* ========================================================= */}
        {moduloActivo === 'vault' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1E1920] to-[#381622] rounded-3xl p-6 text-white shadow-md border border-[#D9B25C]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Archive className="w-5 h-5 text-[#D9B25C]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9B25C]">Bóveda de Producción</span>
                </div>
                <h2 className="text-xl font-bold mt-1">Vault de Piezas Aprobadas por karc0</h2>
                <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                  Desde aquí gestionas títulos definitivos, descripciones de copy final y planificas la fecha de lanzamiento controlado en redes sociales y soportes de sala.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 text-center shrink-0">
                <div className="text-2xl font-bold text-[#D9B25C]">{boveda.length}</div>
                <div className="text-[11px] text-neutral-300">Piezas en Bóveda</div>
              </div>
            </div>

            {boveda.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#E8E2D5] shadow-xs text-center space-y-3 max-w-xl mx-auto my-8">
                <div className="w-12 h-12 rounded-2xl bg-[#F4EBE1] text-[#6E0C2B] flex items-center justify-center mx-auto">
                  <Archive className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#1E1920]">Tu Bóveda está vacía</h4>
                <p className="text-xs text-[#716975] leading-relaxed">
                  Revisa los módulos de Vídeos, Experience, Flyers o Carruseles y pulsa en «Aprobar» en las piezas que desees añadir a tu plan de publicación.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {boveda.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E2D5] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE1]">
                      <div className="flex items-center space-x-2.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F4EBE1] text-[#6E0C2B] border border-[#E3D3C4]">
                          {item.tipo.toUpperCase()}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#1E1920]">{item.tituloOriginal}</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {item.estadoPublicacion.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={() => eliminarDeBoveda(item.id)}
                          className="text-xs text-red-600 hover:text-red-800 p-1 font-semibold"
                          title="Quitar del Vault"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Editor de Título y Copy Definitivo */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-bold text-[#1E1920] block mb-1">Título Definitivo de Publicación:</label>
                          <input
                            type="text"
                            value={item.tituloFinal}
                            onChange={(e) => actualizarItemBoveda(item.id, { tituloFinal: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#6E0C2B]/30"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#1E1920] block mb-1">Copy / Descripción Final para el Canal:</label>
                          <textarea
                            rows={4}
                            value={item.descripcionFinal}
                            onChange={(e) => actualizarItemBoveda(item.id, { descripcionFinal: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-[#E8E2D5] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#6E0C2B]/30"
                          />
                        </div>
                      </div>

                      {/* Parámetros de Programación y Canal */}
                      <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D5]">
                        <div>
                          <label className="text-[11px] font-bold text-[#1E1920] block mb-1">Canal de Destino:</label>
                          <select
                            value={item.canal}
                            onChange={(e) => actualizarItemBoveda(item.id, { canal: e.target.value as any })}
                            className="w-full p-2 rounded-xl border border-[#E8E2D5] text-xs bg-white focus:outline-hidden"
                          >
                            <option value="Instagram Reels">Instagram Reels</option>
                            <option value="Instagram & Facebook">Instagram & Facebook</option>
                            <option value="Multi-red">Multi-red (IG, FB, LinkedIn)</option>
                            <option value="Print & Mesa">Print & Mesa (Impresión)</option>
                            <option value="Google Business">Google Business Profile</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-[#1E1920] block mb-1">Fecha Programada:</label>
                            <input
                              type="date"
                              value={item.fechaProgramada}
                              onChange={(e) => actualizarItemBoveda(item.id, { fechaProgramada: e.target.value })}
                              className="w-full p-2 rounded-xl border border-[#E8E2D5] text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#1E1920] block mb-1">Hora Estimada:</label>
                            <input
                              type="time"
                              value={item.horaProgramada}
                              onChange={(e) => actualizarItemBoveda(item.id, { horaProgramada: e.target.value })}
                              className="w-full p-2 rounded-xl border border-[#E8E2D5] text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#1E1920] block mb-1">Estado de Publicación:</label>
                          <select
                            value={item.estadoPublicacion}
                            onChange={(e) => actualizarItemBoveda(item.id, { estadoPublicacion: e.target.value as any })}
                            className="w-full p-2 rounded-xl border border-[#E8E2D5] text-xs bg-white focus:outline-hidden"
                          >
                            <option value="lista_para_programar">Lista para Programar</option>
                            <option value="programada">Programada en Meta Business / Hootsuite</option>
                            <option value="publicada">Publicada en Directo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}