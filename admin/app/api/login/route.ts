import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';

// Rate limiting simple en memoria por IP (5 intentos cada 15 min)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Decodificación Base32 segura
function base32ToBuffer(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let i = 0; i < base32.length; i++) {
    const val = alphabet.indexOf(base32[i].toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return Buffer.from(bytes);
}

// Verificación matemática TOTP RFC 6238 en el Servidor (Ventana ±1 intervalo)
function verifyServerTOTP(token: string, secretBase32: string): boolean {
  const secret = base32ToBuffer(secretBase32);
  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = 30;
  const currentStep = Math.floor(epoch / timeStep);

  for (let stepOffset = -1; stepOffset <= 1; stepOffset++) {
    const step = currentStep + stepOffset;
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigInt64BE(BigInt(step));

    const hmac = crypto.createHmac('sha1', secret).update(timeBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const generated = (code % 1000000).toString().padStart(6, '0');
    if (generated === token.trim()) {
      return true;
    }
  }
  return false;
}

// Generación de Cookie firmada HMAC-SHA256
function createSessionToken(secret: string): string {
  const payload = {
    sub: 'admin-karc0',
    exp: Date.now() + 12 * 60 * 60 * 1000, // 12 horas de duración
    iat: Date.now()
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('hex');
  return `${payloadBase64}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiados intentos fallidos. Bloqueado temporalmente por 15 minutos.' },
        { status: 429 }
      );
    }

    const { code } = await request.json();

    if (!code || typeof code !== 'string' || code.trim().length !== 6) {
      return NextResponse.json(
        { error: 'Código de verificación de 6 dígitos inválido.' },
        { status: 400 }
      );
    }

    const totpSecret = process.env.STUDIO_TOTP_SECRET;
    const sessionSecret = process.env.STUDIO_SESSION_SECRET;

    if (!totpSecret || !sessionSecret) {
      console.error('[CRITICAL] Variables STUDIO_TOTP_SECRET o STUDIO_SESSION_SECRET no configuradas en Vercel.');
      return NextResponse.json(
        { error: 'Error de configuración de seguridad en el servidor.' },
        { status: 500 }
      );
    }

    const isValid = verifyServerTOTP(code, totpSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Código 2FA incorrecto o expirado. Comprueba la hora de tu teléfono.' },
        { status: 401 }
      );
    }

    // Éxito: Limpiar intentos de IP y emitir cookie httpOnly
    loginAttempts.delete(ip);
    const sessionToken = createSessionToken(sessionSecret);

    const response = NextResponse.json({ ok: true, message: 'Autenticación correcta' });

    response.cookies.set('dkitchen_studio_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60, // 12 horas
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Error interno de validación.' },
      { status: 500 }
    );
  }
}
