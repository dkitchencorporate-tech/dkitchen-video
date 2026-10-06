import { NextResponse, NextRequest } from 'next/server';

// Verificación de firma HMAC-SHA256 con Web Crypto (compatible Edge / Node)
async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payloadBase64, signatureHex] = token.split('.');
    if (!payloadBase64 || !signatureHex) return false;

    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);

    // Comprobar expiración (12 horas)
    if (!payload.exp || Date.now() > payload.exp) return false;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    return await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payloadBase64));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rutas públicas excluidas de autenticación
  if (
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // 2. Comprobar cookie segura de sesión
  const sessionCookie = request.cookies.get('dkitchen_studio_session')?.value;
  const sessionSecret = process.env.STUDIO_SESSION_SECRET;

  if (sessionCookie && sessionSecret) {
    const isValid = await verifySessionToken(sessionCookie, sessionSecret);
    if (isValid) {
      return NextResponse.next();
    }
  }

  // 3. Si es petición de medios protegidos (/media/*) -> 401 Unauthorized estricto
  if (pathname.startsWith('/media/')) {
    return new NextResponse('Unauthorized: Sesión de DKitchen Studio requerida.', { status: 401 });
  }

  // 4. Si es otra ruta del panel -> Redirigir a /login
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
