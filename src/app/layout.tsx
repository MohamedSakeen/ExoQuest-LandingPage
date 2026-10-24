import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LegalModalProvider } from "@/shared/components/legal/LegalModalContext";
import { ToasterProvider } from "@/shared/components/ui/ToasterProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_URL = rawSiteUrl && rawSiteUrl.startsWith("http") ? rawSiteUrl : "https://exoquest.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ExoQuest — Next-Gen CTF & Cybersecurity Practice Platform",
    template: "%s | ExoQuest CTF Platform",
  },
  description:
    "Master cybersecurity with hands-on CTF challenges, live hacking competitions, and interactive labs. Practice web exploitation, cryptography, reverse engineering, and pwn on ExoQuest.",
  applicationName: "ExoQuest",
  keywords: [
    "CTF platform",
    "cybersecurity practice",
    "learn ethical hacking",
    "Capture The Flag challenges",
    "cybersecurity training",
    "hands-on hacking labs",
    "web security labs",
    "binary exploitation",
    "reverse engineering",
    "cryptography CTF",
    "cybersecurity competitions",
    "ethical hacking platform",
    "infosec training",
    "penetration testing practice",
    "TryHackMe alternative",
    "Hack The Box alternative",
  ],
  authors: [{ name: "ExoQuest Team" }],
  creator: "ExoQuest",
  publisher: "ExoQuest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "ExoQuest",
    title: "ExoQuest — Next-Gen CTF & Cybersecurity Practice Platform",
    description:
      "Master ethical hacking with hands-on CTF challenges, live hacking competitions, and interactive cybersecurity labs.",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "ExoQuest CTF Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExoQuest — Next-Gen CTF & Cybersecurity Practice Platform",
    description:
      "Master ethical hacking with hands-on CTF challenges, live hacking competitions, and interactive cybersecurity labs.",
    images: ["/og/default.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#08090d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <LegalModalProvider>
          {children}
        </LegalModalProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
