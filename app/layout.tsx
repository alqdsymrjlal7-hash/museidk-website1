import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({ weight: ['400', '500', '700', '800'], subsets: ["arabic"] });
export const metadata: Metadata = { title: "مساعدك الرقمي | منصة الخدمات" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} antialiased bg-slate-50 text-slate-800`}>{children}</body>
    </html>
  );
}
