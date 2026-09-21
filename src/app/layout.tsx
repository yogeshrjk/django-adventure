import type { Metadata } from "next";
import { Bangers, Nunito } from "next/font/google";
import "./globals.css";
import { GameStoreProvider } from "@/components/game/GameStoreProvider";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { TopHud } from "@/components/game/TopHud";
import { GuestNoticeBanner } from "@/components/game/GuestNoticeBanner";
import { SenseiChatWidget } from "@/components/chat/SenseiChatWidget";
import { Gamepad2 } from "lucide-react";

const bangers = Bangers({
  weight: "400",
  variable: "--font-comic",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Django Adventure — Learn Django Like a Game (0 to 100)",
  description:
    "An anime-style game to learn Python + Django + DRF from zero to hero. Story on the left, code editor on the right, AI coach checks your code.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bangers.variable} ${nunito.variable} h-full`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ThemeProvider>
        <GameStoreProvider>
          <TopHud />
          <div className="flex-1 pt-14 pb-14 sm:pt-16 sm:pb-16">
            <GuestNoticeBanner />
            {children}
          </div>
          <footer className="fixed bottom-0 inset-x-0 z-40 border-t-2 border-[#191924] bg-white/90 px-4 py-2.5 text-center text-xs font-bold backdrop-blur dark:border-black dark:bg-[#14141c]/90">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-comic tracking-wide">DJANGO ADVENTURE</span>
              <span className="opacity-40">•</span>
              <span className="opacity-75">© {new Date().getFullYear()} Django Adventure. All rights reserved.</span>
            </div>
          </footer>
          <SenseiChatWidget />
        </GameStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
