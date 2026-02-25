import { ColorTooltipProvider } from "@/components/ColorTooltip";
import Footer from "@/components/Footer";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://themegen.dev"),
  title: {
    default: "Theme Gen - Free Visual Theme Generator for CSS & Tailwind",
    template: "%s | Theme Gen",
  },
  description:
    "Create beautiful color themes with a free visual editor. Preview in real-time and export to CSS variables, Tailwind config, and more. No sign-up required.",
  keywords: [
    "theme generator",
    "css theme generator",
    "tailwind theme generator",
    "color palette generator",
    "color scheme tool",
    "visual theme builder",
    "css variables generator",
    "dark mode generator",
  ],
  authors: [{ name: "Nathan Schroeder" }],
  creator: "Nathan Schroeder",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://themegen.dev",
    siteName: "Theme Gen",
    title: "Theme Gen - Free Visual Theme Generator for CSS & Tailwind",
    description:
      "Create beautiful color themes with a free visual editor. Preview in real-time and export to CSS variables, Tailwind config, and more.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Theme Gen visual editor preview showing color theme customization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theme Gen - Free Visual Theme Generator for CSS & Tailwind",
    description:
      "Create beautiful color themes with a free visual editor. Preview in real-time and export to CSS variables, Tailwind config, and more.",
    images: ["/preview.png"],
  },
  alternates: {
    canonical: "https://themegen.dev",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider>
          <ColorTooltipProvider>
            {children}
            <Footer />
          </ColorTooltipProvider>
          <ThemeCustomizer />
        </ThemeProvider>
        <Analytics />

      </body>
    </html>
  );
}
