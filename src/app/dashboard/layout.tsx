import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HR Dashboard - Sentiment Analysis & Analytics",
  description:
    "Comprehensive HR dashboard showcasing sentiment analysis, text processing, and data visualization techniques. Features real-time analytics, department insights, and feedback trends.",
  keywords: [
    "HR dashboard",
    "sentiment analysis",
    "employee analytics",
    "data visualization",
    "text analytics",
    "NLP dashboard",
    "feedback insights",
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
