import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Navbar } from "@/components/Navbar";
import { tmdbLanguageToHtmlLang } from "@/lib/tmdb-language";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getSiteUrl, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "películas",
    "series",
    "TMDb",
    "The Movie Database",
    "streaming",
    "CineScope",
    "Next.js",
    "catálogo de cine"
  ],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const tmdbLanguage = await resolveTmdbLanguageForRequest();
  const htmlLang = tmdbLanguageToHtmlLang(tmdbLanguage);
  return (
    <html lang={htmlLang}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <LocaleProvider tmdbLanguage={tmdbLanguage}>
          <div className="flex min-h-screen flex-col">
            <Navbar initialTmdbLanguage={tmdbLanguage} />
            <div className="flex-1 pt-28 lg:pt-20">{children}</div>
            <Footer />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
