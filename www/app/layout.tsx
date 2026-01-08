import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ebade | The First Agent-First Framework",
  description:
    "ebade is The first framework designed for AI agents, readable by humans. Reduce token usage by 70% with intent-driven development.",
  openGraph: {
    type: "website",
    url: "https://ebade.dev/",
    title: "ebade | The First Agent-First Framework",
    description:
      "The first framework designed FOR AI agents. Reduce token usage by 70% with intent-driven development.",
    images: [{ url: "https://ebade.dev/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ebade | The First Agent-First Framework",
    description:
      "The first framework designed FOR AI agents. Reduce token usage by 70%.",
    images: ["https://ebade.dev/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RMQ7E747ZH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RMQ7E747ZH');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
