import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1 pt-20">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
