import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./screen.css";
import { LearningProvider } from "@/components/learning/learning-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Little Orbit | Azat’s learning space",
  description:
    "A colorful, step-by-step long division adventure for Azat Sa. Learn with Orbit, then practice with a friendly game.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LearningProvider>{children}</LearningProvider>
      </body>
    </html>
  );
}
