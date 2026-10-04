import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "DKitchen Studio · Control y Aprobación",
  description: "Estudio de producción audiovisual y centro de aprobación de piezas Gran Reserva.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable} ${bricolage.variable}`}>
      <body className="bg-negro text-papel font-sans antialiased selection:bg-vino selection:text-oro min-h-screen">
        {children}
      </body>
    </html>
  );
}