import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineScope",
  description: "Explora peliculas con datos en tiempo real de TMDb."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
