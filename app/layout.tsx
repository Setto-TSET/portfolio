import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { MotionConfig } from "motion/react";
import { EggProvider, Footer, TopBar, themeScript } from "@/components/Chrome";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const thai = IBM_Plex_Sans_Thai({ variable: "--font-thai", subsets: ["thai", "latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: `${site.name} · Portfolio`, template: `%s · ${site.name}` },
  description: "ผลงาน โปรเจกต์ และเรื่องราวของนักพัฒนาสายจันทราและเงา",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${sans.variable} ${serif.variable} ${thai.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <EggProvider>
            <TopBar />
            <main>{children}</main>
            <Footer />
          </EggProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
