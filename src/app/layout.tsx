import type { Metadata, Viewport } from "next";
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
  title: "Employee Feedback Analyzer - Text Analytics Demo",
  description:
    "A comprehensive demonstration of Text Analytics and Natural Language Processing techniques in employee feedback analysis. Features sentiment analysis, PII detection, and data visualization for academic purposes.",
  keywords: [
    "text analytics",
    "natural language processing",
    "sentiment analysis",
    "employee feedback",
    "NLP demo",
    "academic project",
    "data visualization",
    "feedback analysis",
  ],
  authors: [{ name: "Beny Dishon K" }],
  creator: "Beny Dishon K",
  publisher: "Text Analytics and NLP Course",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moodly-demo.vercel.app",
    title: "Employee Feedback Analyzer - Text Analytics Demo",
    description:
      "A comprehensive demonstration of Text Analytics and Natural Language Processing techniques in employee feedback analysis.",
    siteName: "Text Analytics Demo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Feedback Analyzer - Text Analytics Demo",
    description:
      "A comprehensive demonstration of Text Analytics and Natural Language Processing techniques in employee feedback analysis.",
    creator: "@benydishon",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
