// scripts/build_composicion_v1.js
// Generador de composición HTML/GSAP de ultra alta fidelidad (Nivel Agencia de 20.000 €)
// Con activos fotográficos reales de dkitchencorporate.es embebidos en Base64

const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('assets/images');
const s1 = fs.readFileSync(path.join(imgDir, 's1.png')).toString('base64');
const s2 = fs.readFileSync(path.join(imgDir, 's2.png')).toString('base64');
const s17 = fs.readFileSync(path.join(imgDir, 's17.png')).toString('base64');
const s18 = fs.readFileSync(path.join(imgDir, 's18.jpeg')).toString('base64');
const s22 = fs.readFileSync(path.join(imgDir, 's22.jpeg')).toString('base64');

const htmlContent = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>DKitchen Reel 01 - La Carta en Llamas (Edición Master 35s)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800;12..96,900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  html, body {
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    background: #08090C;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: #FAF8F5;
    -webkit-font-smoothing: antialiased;
  }

  /* ESCENARIO CINEMATOGRÁFICO 3D */
  #stage-universe {
    position: relative;
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    perspective: 1600px;
    perspective-origin: 50% 48%;
    background: radial-gradient(circle at 50% 35%, #180812 0%, #08090C 80%);
  }

  /* RETÍCULA MICRO-DOT DE ALTA GAMA (COMO EN DKITCHENCORPORATE.ES) */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
    pointer-events: none;
    z-index: 2;
  }

  /* LUCES VOLUMÉTRICAS EN MOVIMIENTO CONTINUO */
  .glow-ambient {
    position: absolute;
    border-radius: 50%;
    filter: blur(140px);
    pointer-events: none;
    z-index: 1;
  }
  .glow-burgundy { 
    width: 800px; height: 800px; 
    background: radial-gradient(circle, rgba(163,24,74,0.55), transparent 70%); 
    top: 10%; left: -150px; 
  }
  .glow-wine { 
    width: 900px; height: 900px; 
    background: radial-gradient(circle, rgba(110,12,43,0.65), transparent 70%); 
    bottom: 10%; right: -200px; 
  }
  .glow-gold { 
    width: 600px; height: 600px; 
    background: radial-gradient(circle, rgba(217,178,92,0.3), transparent 70%); 
    bottom: 25%; left: 20%; 
  }

  /* MARQUESINA CONTINUA SUPERIOR (COMO EN DKITCHENCORPORATE.ES) */
  .marquee-bar {
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    border-top: 1px solid rgba(255,255,255,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 12px 0;
    background: rgba(8,9,12,0.7);
    backdrop-filter: blur(8px);
    z-index: 8;
  }
  .marquee-inner {
    display: inline-block;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }
  .marquee-inner span { color: #D9B25C; margin: 0 16px; }

  /* CAJA SEGURA ESTRICTA (940x1280 px: X: 0-940, Y: 220-1500) */
  .safe-container {
    position: absolute;
    top: 230px;
    left: 70px;
    width: 940px;
    height: 1260px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }

  /* HEADER BADGE TOP */
  .brand-pill-header {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 28px;
    border-radius: 999px;
    background: rgba(23,25,30,0.85);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(16px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  }
  .seal-mini {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #D9B25C, #9E7A1C);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 14px;
    color: #0A080C;
    box-shadow: 0 0 12px rgba(217,178,92,0.6);
  }
  .brand-pill-text {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #FAF8F5;
  }
  .brand-pill-text span { color: #A3184A; }

  /* ================= ESCENA 1: HOOK DISRUPTIVO & PAPEL ARDIENDO ================= */
  .scene-1-container {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 40px;
    z-index: 20;
  }
  .hook-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 64px;
    font-weight: 900;
    line-height: 1.02;
    text-transform: uppercase;
    letter-spacing: -1.5px;
    margin-bottom: 24px;
    color: #FAF8F5;
  }
  .hook-title .highlight-wine {
    color: #FF5277;
    text-shadow: 0 0 35px rgba(255,82,119,0.7);
  }
  .hook-title .highlight-gold {
    color: #D9B25C;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    text-transform: none;
    font-weight: 700;
    font-size: 76px;
  }
  .cost-loss-box {
    margin-top: 24px;
    padding: 24px 44px;
    border-radius: 24px;
    background: rgba(24,10,18,0.85);
    border: 2px solid #FF5277;
    box-shadow: 0 0 50px rgba(255,82,119,0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .cost-loss-label {
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #FF8BA4;
    font-weight: 800;
  }
  .cost-loss-number {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 56px;
    font-weight: 900;
    color: #FAF8F5;
  }

  /* HOJAS 3D FLOTANTES ARDIENDO */
  .flying-paper {
    position: absolute;
    width: 340px;
    height: 480px;
    background: #F7F4EE;
    color: #1A1412;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 40px 90px rgba(0,0,0,0.85), 0 0 30px rgba(255,80,0,0.35);
    transform-style: preserve-3d;
    pointer-events: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .paper-1 { top: 16%; left: 60px; transform: rotateX(24deg) rotateY(-22deg) rotateZ(-14deg); }
  .paper-2 { bottom: 14%; right: 60px; transform: rotateX(-16deg) rotateY(24deg) rotateZ(14deg); }

  /* ================= ESCENAS 2, 3 & 4: SMARTPHONE 3D CON CARTA REAL KAISEKI ================= */
  .phone-stage-3d {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    z-index: 15;
    opacity: 0;
  }

  /* CHASIS IPHONE DE ÉLITE (COMO EN DKITCHENCORPORATE.ES) */
  .iphone-chassis {
    position: relative;
    width: 500px;
    height: 1020px;
    border-radius: 54px;
    padding: 4px;
    background: linear-gradient(145deg, #6b707b, #1b1d22 35%, #0b0c0f 70%, #4a4e57);
    box-shadow: 0 60px 140px -20px rgba(0,0,0,0.9), 0 0 0 2px rgba(217,178,92,0.4);
    transform-style: preserve-3d;
    transform: perspective(1600px) rotateX(14deg) rotateY(-14deg) rotateZ(2deg);
  }

  .iphone-inner {
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background: #090A0D;
    padding: 10px;
    overflow: hidden;
    position: relative;
  }

  .iphone-screen {
    width: 100%;
    height: 100%;
    border-radius: 40px;
    background: #15161A;
    overflow: hidden;
    position: relative;
    color: #F3F1EC;
  }

  /* REFLEJO DE CRISTAL ANIMADO */
  .glass-sheen {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 45;
    background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.18) 48%, transparent 60%);
    background-size: 250% 100%;
    mix-blend-mode: overlay;
  }

  .dynamic-island {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 28px;
    background: #000;
    border-radius: 20px;
    z-index: 50;
  }

  /* CONTENIDO INTERNO DE LA CARTA REAL DE DKITCHEN */
  .menu-scroll-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .menu-header-banner {
    position: relative;
    height: 180px;
    width: 100%;
    overflow: hidden;
  }
  .menu-header-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .menu-header-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #15161A 0%, rgba(21,22,26,0.5) 50%, transparent 100%);
  }
  .menu-header-text {
    position: absolute;
    bottom: 12px;
    left: 18px;
    right: 18px;
  }
  .rest-title-serif {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 34px;
    font-weight: 700;
    color: #FAF8F5;
    line-height: 1;
  }
  .rest-subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    margin-top: 4px;
  }

  .menu-section {
    padding: 16px 18px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    color: #FAF8F5;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 6px;
  }

  /* DISH CARD HERO */
  .dish-card-featured {
    background: #1F2126;
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    margin-bottom: 14px;
    position: relative;
  }
  .dish-featured-img {
    width: 100%;
    height: 190px;
    overflow: hidden;
    position: relative;
  }
  .dish-featured-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .dish-featured-info {
    padding: 16px;
  }
  .dish-name-price {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }
  .dish-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    color: #FAF8F5;
  }
  .dish-price {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 24px;
    font-weight: 900;
    color: #E8592A;
    background: rgba(232,89,42,0.12);
    padding: 4px 12px;
    border-radius: 10px;
    border: 1px solid rgba(232,89,42,0.3);
  }
  .dish-desc-text {
    font-size: 13px;
    color: rgba(243,241,236,0.65);
    line-height: 1.4;
    margin-bottom: 10px;
  }

  /* RAYO LÁSER DE ESCANEO QR */
  .laser-scanner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, transparent, #D9B25C 30%, #FAF8F5 50%, #D9B25C 70%, transparent);
    box-shadow: 0 0 30px #D9B25C, 0 0 50px #FF5277;
    z-index: 60;
    opacity: 0;
  }

  /* SATELLITE PILL BADGES (COMO EN DKITCHENCORPORATE.ES) */
  .satellite-badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(23,25,30,0.88);
    padding: 14px 22px;
    color: #FFF;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    backdrop-filter: blur(16px);
    z-index: 30;
    opacity: 0;
  }
  .radar-dot {
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .radar-ping {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    opacity: 0.6;
    animation: ping 1.5s infinite ease-out;
  }
  @keyframes ping {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2.4); opacity: 0; }
  }

  .badge-mesa { top: 12%; left: -60px; transform: rotate(-4deg); }
  .badge-precio { top: 36%; right: -70px; transform: rotate(3deg); }
  .badge-reserva { bottom: 18%; left: -40px; transform: rotate(2deg); }

  /* ================= ESCENA 4: ABANICO DE 3 CELULARES (ARQUETIPO 03) ================= */
  .fan-phone-left {
    position: absolute;
    width: 420px;
    height: 860px;
    border-radius: 46px;
    background: #111216;
    border: 3px solid rgba(255,255,255,0.12);
    box-shadow: -40px 50px 100px rgba(0,0,0,0.9);
    transform: translateX(-260px) translateY(80px) rotateY(-26deg) rotateX(12deg) scale(0.82);
    z-index: 8;
    overflow: hidden;
    padding: 24px;
    opacity: 0;
  }
  .fan-phone-right {
    position: absolute;
    width: 420px;
    height: 860px;
    border-radius: 46px;
    background: #111216;
    border: 3px solid rgba(255,255,255,0.12);
    box-shadow: 40px 50px 100px rgba(0,0,0,0.9);
    transform: translateX(260px) translateY(80px) rotateY(26deg) rotateX(12deg) scale(0.82);
    z-index: 8;
    overflow: hidden;
    padding: 24px;
    opacity: 0;
  }

  /* ================= ESCENA 5: MEGA-CTA FINAL VAULT ================= */
  .mega-cta-stage {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 50;
    opacity: 0;
  }

  .cta-vault-box {
    width: 860px;
    padding: 54px 40px;
    border-radius: 40px;
    background: radial-gradient(circle at 50% 25%, #42081B 0%, #12040A 100%);
    border: 3px solid #D9B25C;
    box-shadow: 0 0 70px rgba(217, 178, 92, 0.4), 0 40px 120px rgba(0, 0, 0, 0.95);
    position: relative;
    overflow: hidden;
  }

  .cta-vault-box::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.09), transparent);
    transform: rotate(45deg);
    animation: shineSweep 3.5s infinite linear;
  }
  @keyframes shineSweep {
    0% { transform: translate(-100%, -100%) rotate(45deg); }
    100% { transform: translate(100%, 100%) rotate(45deg); }
  }

  .cta-badge-top {
    display: inline-block;
    padding: 10px 28px;
    border-radius: 999px;
    background: #D9B25C;
    color: #0A080C;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
    box-shadow: 0 0 20px rgba(217,178,92,0.6);
  }

  .cta-hero-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 66px;
    font-weight: 900;
    line-height: 1.05;
    color: #FAF8F5;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .cta-hero-title span { color: #D9B25C; }

  .cta-subtitle {
    font-size: 22px;
    color: #E2DDD5;
    font-weight: 600;
    margin-bottom: 34px;
  }

  .cta-button-glow {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    padding: 24px 52px;
    border-radius: 22px;
    background: linear-gradient(135deg, #D9B25C 0%, #A67C1E 100%);
    color: #0A080C;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 34px;
    font-weight: 900;
    letter-spacing: 1px;
    box-shadow: 0 14px 50px rgba(217, 178, 92, 0.6);
  }

  .cta-footer-url {
    margin-top: 26px;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #FAF8F5;
    text-transform: lowercase;
  }
  .cta-footer-url span { color: #D9B25C; }
</style>
</head>
<body>

<div id="stage-universe">
  <!-- Retícula y Luces Volumétricas de Lujo -->
  <div class="grid-overlay"></div>
  <div class="glow-ambient glow-burgundy"></div>
  <div class="glow-ambient glow-wine"></div>
  <div class="glow-ambient glow-gold"></div>

  <!-- Marquesina Superior Oficial -->
  <div class="marquee-bar">
    <div class="marquee-inner">
      Sin comisiones por pedido <span>•</span> Cambios al momento <span>•</span> Alérgenos según la UE <span>•</span> Tu marca, tus clientes <span>•</span> Primer mes por 1 € <span>•</span> Sin comisiones por pedido <span>•</span> Cambios al momento
    </div>
  </div>

  <!-- CAJA SEGURA ESTRICTA (940x1280) -->
  <div class="safe-container">
    
    <!-- HEADER MARCA SUPERIOR -->
    <header class="brand-pill-header" id="brand-header">
      <div class="seal-mini">DK</div>
      <div class="brand-pill-text">D<span>Kitchen</span> Corporate</div>
    </header>

    <!-- ================= ESCENA 1: HOOK DISRUPTIVO DOLOR ================= -->
    <div class="scene-1-container" id="scene-1">
      <h1 class="hook-title">
        ¿Cada vez que cambias un precio... <br>
        <span class="highlight-wine">QUEMAS</span> <span class="highlight-gold">tu beneficio?</span>
      </h1>
      <div class="cost-loss-box">
        <div class="cost-loss-label">Fuga de dinero anual en imprenta</div>
        <div class="cost-loss-number" id="cost-counter">1.840 € / año</div>
      </div>
    </div>

    <!-- HOJAS DE CARTA FÍSICA VOLANDO EN 3D -->
    <div class="flying-paper paper-1" id="paper-left">
      <div style="font-weight:800;font-size:20px;margin-bottom:8px;border-bottom:2px solid #222;padding-bottom:6px;font-family:'Cormorant Garamond',serif;">RESTAURANTE EL ASADOR</div>
      <div style="font-size:14px;line-height:1.7;color:#444;">
        • Chuletón Dry Aged ... <span style="text-decoration:line-through;color:#C00;">24 €</span> <strong>28 €</strong> (a mano)<br>
        • Rodaballo Salvaje ... S/M<br>
        • Tartar Balfegó ... 24 €<br>
        <div style="margin-top:10px;padding:6px;background:#FEE2E2;color:#991B1B;font-weight:bold;font-size:12px;border-radius:6px;">
          ⚠ Carta desactualizada por imprenta
        </div>
      </div>
    </div>
    <div class="flying-paper paper-2" id="paper-right">
      <div style="font-weight:800;font-size:20px;margin-bottom:8px;border-bottom:2px solid #222;padding-bottom:6px;font-family:'Cormorant Garamond',serif;">FACTURA DE IMPRENTA</div>
      <div style="font-size:14px;line-height:1.7;color:#444;">
        Concepto: 250 Cartas Plastificadas<br>
        Plazo de entrega: 14 días<br>
        <div style="margin-top:12px;padding:8px;background:#18181B;color:#FFF;font-weight:bold;font-size:15px;border-radius:8px;">
          Total: 460,00 € + IVA
        </div>
      </div>
    </div>

    <!-- ================= ESCENAS 2, 3 & 4: SMARTPHONE 3D CON CARTA REAL KAISEKI ================= -->
    <div class="phone-stage-3d" id="phone-stage">
      
      <!-- Teléfono Izquierdo (Comandero Sala) -->
      <div class="fan-phone-left" id="phone-left">
        <div style="font-size:20px;font-weight:800;color:#D9B25C;margin-bottom:16px;">Comandero Pro · Sala</div>
        <div style="background:#1E2129;padding:16px;border-radius:16px;margin-bottom:12px;border-left:5px solid #2F8F6B;">
          <div style="font-weight:800;font-size:16px;color:#fff;">Mesa 4 · Comanda</div>
          <div style="font-size:13px;color:#2F8F6B;margin-top:4px;">Enviado a cocina en 0.2s</div>
        </div>
        <div style="background:#1E2129;padding:16px;border-radius:16px;border-left:5px solid #D9B25C;">
          <div style="font-weight:800;font-size:16px;color:#fff;">Mesa 7 · Cuenta</div>
          <div style="font-size:13px;color:#D9B25C;margin-top:4px;">Cobro directo en TPV</div>
        </div>
      </div>

      <!-- Teléfono Principal (Carta Digital Kaiseki Oficial) -->
      <div class="iphone-chassis" id="phone-main">
        <div class="iphone-inner">
          <div class="iphone-screen">
            <div class="dynamic-island"></div>
            <div class="glass-sheen"></div>
            <div class="laser-scanner" id="laser-bar"></div>

            <div class="menu-scroll-container" id="menu-scroll">
              <!-- Banner Superior Kaiseki -->
              <header class="menu-header-banner">
                <img src="data:image/png;base64,${s17}" alt="Kaiseki Header">
                <div class="menu-header-gradient"></div>
                <div class="menu-header-text">
                  <h2 class="rest-title-serif">Kaiseki</h2>
                  <p class="rest-subtitle">Cocina japonesa de mercado · Carta en vivo</p>
                </div>
              </header>

              <!-- Sección Entrantes Fríos -->
              <section class="menu-section">
                <h3 class="section-title">Entrantes Fríos</h3>

                <!-- Plato Estrella 1 -->
                <div class="dish-card-featured" id="dish-hero">
                  <div class="dish-featured-img">
                    <img src="data:image/png;base64,${s1}" alt="Tartar Balfegó">
                  </div>
                  <div class="dish-featured-info">
                    <div class="dish-name-price">
                      <div class="dish-name">Tartar de Atún Balfegó</div>
                      <div class="dish-price" id="live-price-tag">24,00 €</div>
                    </div>
                    <div class="dish-desc-text">Ventresca Balfegó fundente marinada con sésamo tostado y yuzu fresco.</div>
                    <div style="display:flex;gap:8px;">
                      <span style="font-size:11px;font-weight:700;color:#2F8F6B;background:rgba(47,143,107,0.15);padding:3px 8px;border-radius:6px;">✓ 14 Alérgenos OK</span>
                      <span style="font-size:11px;font-weight:700;color:#38BDF8;background:rgba(56,189,248,0.15);padding:3px 8px;border-radius:6px;">✨ Foto IA Pro</span>
                    </div>
                  </div>
                </div>

                <!-- Plato 2 -->
                <div style="background:#1F2126;border-radius:18px;padding:12px;display:flex;gap:12px;align-items:center;border:1px solid rgba(255,255,255,0.08);">
                  <img src="data:image/png;base64,${s2}" style="width:64px;height:64px;border-radius:12px;object-fit:cover;">
                  <div style="flex:1;">
                    <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:#FFF;">Carpaccio de Pez Limón</div>
                    <div style="font-size:11px;color:#888;">Hamachi con ponzu trufado</div>
                  </div>
                  <div style="font-weight:900;font-size:18px;color:#D9B25C;">21 €</div>
                </div>

              </section>
            </div>
          </div>
        </div>
      </div>

      <!-- Teléfono Derecho (Panel Ingresos & Cero Comisiones) -->
      <div class="fan-phone-right" id="phone-right">
        <div style="font-size:20px;font-weight:800;color:#D9B25C;margin-bottom:16px;">Rentabilidad Directa</div>
        <div style="background:#1E2129;padding:16px;border-radius:16px;margin-bottom:12px;">
          <div style="font-size:13px;color:#9E9A93;">Ticket Medio Sala</div>
          <div style="font-size:28px;font-weight:900;color:#2F8F6B;">+18,4%</div>
        </div>
        <div style="background:#1E2129;padding:16px;border-radius:16px;">
          <div style="font-size:13px;color:#9E9A93;">Comisiones a Plataformas</div>
          <div style="font-size:28px;font-weight:900;color:#38BDF8;">0,00 €</div>
        </div>
      </div>

    </div>

    <!-- SATELLITE PILL BADGES -->
    <div class="satellite-badge badge-mesa" id="badge-1">
      <div class="radar-dot" style="background:#A3184A;"><div class="radar-ping" style="background:#A3184A;"></div></div>
      <div>
        <span style="display:block;font-size:15px;font-weight:800;">Mesa 4</span>
        <span style="display:block;font-size:12px;color:rgba(255,255,255,0.7);">Llama al camarero</span>
      </div>
    </div>

    <div class="satellite-badge badge-precio" id="badge-2">
      <div class="radar-dot" style="background:#2F8F6B;"><div class="radar-ping" style="background:#2F8F6B;"></div></div>
      <div>
        <span style="display:block;font-size:15px;font-weight:800;">Precio actualizado</span>
        <span style="display:block;font-size:12px;color:rgba(255,255,255,0.7);">Tartar · 24 → 28 €</span>
      </div>
    </div>

    <div class="satellite-badge badge-reserva" id="badge-3">
      <div class="radar-dot" style="background:#3B6EA5;"><div class="radar-ping" style="background:#3B6EA5;"></div></div>
      <div>
        <span style="display:block;font-size:15px;font-weight:800;">Reserva 21:30</span>
        <span style="display:block;font-size:12px;color:rgba(255,255,255,0.7);">4 personas · confirmada</span>
      </div>
    </div>

    <!-- ================= ESCENA 5: MEGA-CTA FINAL VAULT ================= -->
    <div class="mega-cta-stage" id="mega-cta">
      <div class="cta-vault-box">
        <div class="cta-badge-top">Oferta Oficial de Arranque</div>
        <h2 class="cta-hero-title">Pruébalo 30 días<br><span>por solo 1,00 €</span></h2>
        <p class="cta-subtitle">Alta bonificada de 159 € incluida · Sin permanencia jamás</p>
        <div class="cta-button-glow">
          <span>COMENZAR AHORA</span> ➔
        </div>
        <div class="cta-footer-url">
          dkitchencorporate.es/<span>qr</span>
        </div>
      </div>
    </div>

    <footer style="height:10px;"></footer>
  </div>
</div>

<script>
  window.LISTO = false;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => { window.LISTO = true; }
  });
  window.TL = tl;

  // ================= CRONOGRAMA MAESTRO (35.0 SEGUNDOS) =================

  // --- ESCENA 1: HOOK DISRUPTIVO (0.0s - 5.5s) ---
  tl.from("#brand-header", { duration: 0.8, y: -50, opacity: 0, ease: "power3.out" }, 0.0);
  tl.from("#scene-1", { duration: 1.0, scale: 0.85, opacity: 0, ease: "power4.out" }, 0.2);
  
  // Hojas de papel volando en 3D
  tl.from("#paper-left", { duration: 1.4, x: -250, y: 150, rotateZ: -45, opacity: 0, ease: "back.out(1.5)" }, 0.4);
  tl.from("#paper-right", { duration: 1.4, x: 250, y: 180, rotateZ: 45, opacity: 0, ease: "back.out(1.5)" }, 0.6);
  
  // Hojas se queman y colapsan hacia los lados
  tl.to("#paper-left", { duration: 1.0, scale: 0.2, rotateX: 90, opacity: 0, ease: "power3.in" }, 4.2);
  tl.to("#paper-right", { duration: 1.0, scale: 0.2, rotateX: -90, opacity: 0, ease: "power3.in" }, 4.4);
  tl.to("#scene-1", { duration: 0.8, scale: 0.9, opacity: 0, ease: "power2.inOut" }, 4.8);

  // --- ESCENA 2: QR SCAN & NACIMIENTO IPHONE 3D CON CARTA REAL KAISEKI (5.5s - 14.0s) ---
  tl.set("#phone-stage", { opacity: 1 }, 5.2);
  tl.from("#phone-main", { 
    duration: 1.8, 
    scale: 0.35, 
    rotateY: 85, 
    rotateX: -25, 
    z: -500, 
    opacity: 0, 
    ease: "power3.out" 
  }, 5.4);

  // Rayo Láser escaneando el menú
  tl.to("#laser-bar", { duration: 0.2, opacity: 1 }, 6.4);
  tl.fromTo("#laser-bar", 
    { top: "0%" }, 
    { top: "95%", duration: 2.0, ease: "power2.inOut", repeat: 1, yoyo: true }, 
    6.6
  );
  tl.to("#laser-bar", { duration: 0.3, opacity: 0 }, 10.8);

  // Aparece Badge 1 (Mesa 4)
  tl.to("#badge-1", { duration: 0.8, opacity: 1, x: 20, ease: "back.out(1.7)" }, 8.5);
  tl.to("#badge-1", { duration: 0.5, opacity: 0, y: -20, ease: "power2.in" }, 13.0);

  // --- ESCENA 3: ZOOM MACRO & MODIFICACIÓN EN VIVO (14.0s - 22.0s) ---
  tl.to("#phone-main", { 
    duration: 1.4, 
    scale: 1.14, 
    rotateY: 6, 
    rotateX: 8, 
    ease: "power3.inOut" 
  }, 14.0);

  // Cambio de precio 24€ -> 28€ con destello
  tl.to("#live-price-tag", { 
    duration: 0.3, 
    scale: 1.35, 
    backgroundColor: "#D9B25C", 
    color: "#0A080C", 
    boxShadow: "0 0 40px #D9B25C", 
    ease: "power2.out" 
  }, 15.5);
  tl.call(() => {
    document.getElementById("live-price-tag").innerText = "28,00 €";
  }, null, 15.8);
  tl.to("#live-price-tag", { 
    duration: 0.5, 
    scale: 1.0, 
    backgroundColor: "rgba(232,89,42,0.2)", 
    color: "#E8592A", 
    ease: "elastic.out(1, 0.4)" 
  }, 16.0);

  // Aparece Badge 2 (Precio actualizado) y Badge 3 (Reserva)
  tl.to("#badge-2", { duration: 0.8, opacity: 1, x: -20, ease: "back.out(1.7)" }, 16.5);
  tl.to("#badge-3", { duration: 0.8, opacity: 1, x: 20, ease: "back.out(1.7)" }, 18.0);
  tl.to(["#badge-2", "#badge-3"], { duration: 0.5, opacity: 0, ease: "power2.in" }, 21.5);

  // --- ESCENA 4: ABANICO DE 3 CELULARES (22.0s - 30.5s) ---
  tl.to("#phone-main", { 
    duration: 1.2, 
    scale: 0.84, 
    rotateY: 0, 
    rotateX: 6, 
    ease: "power3.inOut" 
  }, 22.0);

  tl.to("#phone-left", { 
    duration: 1.2, 
    opacity: 1, 
    x: -260, 
    scale: 0.78, 
    ease: "power3.out" 
  }, 22.4);

  tl.to("#phone-right", { 
    duration: 1.2, 
    opacity: 1, 
    x: 260, 
    scale: 0.78, 
    ease: "power3.out" 
  }, 22.6);

  // Flotación 3D continua de los 3 dispositivos
  tl.to(["#phone-main", "#phone-left", "#phone-right"], {
    duration: 3.5,
    y: "-=25",
    rotateX: "+=3",
    repeat: 1,
    yoyo: true,
    ease: "sine.inOut"
  }, 24.0);

  // Teléfonos colapsan y salen de cuadro
  tl.to("#phone-stage", { 
    duration: 0.9, 
    scale: 0.5, 
    opacity: 0, 
    y: 120, 
    ease: "power3.in" 
  }, 29.8);

  // --- ESCENA 5: SILENCIO DE VOZ & MEGA-CTA CINEMÁTICO (30.5s - 35.0s) ---
  tl.set("#mega-cta", { opacity: 1 }, 30.4);
  tl.from(".cta-vault-box", { 
    duration: 1.2, 
    scale: 0.55, 
    rotateX: 45, 
    opacity: 0, 
    ease: "elastic.out(1, 0.6)" 
  }, 30.5);

  tl.from(".cta-badge-top", { duration: 0.6, y: -20, opacity: 0, ease: "power2.out" }, 31.0);
  tl.from(".cta-hero-title", { duration: 0.8, scale: 0.9, opacity: 0, ease: "back.out(1.5)" }, 31.2);
  tl.from(".cta-button-glow", { duration: 0.8, scale: 0.8, opacity: 0, ease: "elastic.out(1, 0.4)" }, 31.6);
  tl.from(".cta-footer-url", { duration: 0.6, y: 15, opacity: 0, ease: "power2.out" }, 32.0);

  // Pulso de luz y respiración final en el botón de CTA
  tl.to(".cta-button-glow", {
    duration: 0.8,
    scale: 1.05,
    boxShadow: "0 0 55px rgba(217, 178, 92, 0.95)",
    repeat: 2,
    yoyo: true,
    ease: "sine.inOut"
  }, 32.5);

  window.LISTO = true;
</script>
</body>
</html>`;

const targetPath = path.resolve('reels/v1-la-carta-en-llamas/composicion.html');
fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('[Build HTML] Composicion v1 generada con éxito en ' + targetPath);
