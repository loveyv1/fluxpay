import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Mono, Syne } from "next/font/google";
import "./globals.css";
import { SWRProvider } from "./swr-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LayoutTransitions } from "@/components/LayoutTransitions";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: "FluxSwap | Decentralized Liquidity on Stellar",
  description: "Decentralized liquidity on Stellar Soroban. Swap assets, provide liquidity, and earn protocol fees.",
  openGraph: {
    title: "FluxSwap",
    description: "Decentralized liquidity on Stellar Soroban.",
    url: "https://fluxswap.vercel.app",
    siteName: "FluxSwap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FluxSwap",
    description: "Decentralized liquidity on Stellar Soroban.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${dmMono.variable} ${syne.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <ErrorBoundary>
          <SWRProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </SWRProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
