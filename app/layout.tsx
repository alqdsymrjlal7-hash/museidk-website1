import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({ 
  weight: ['400', '500', '700', '800'],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "مساعدك الرقمي | خدمات إلكترونية، تجديد هوية، وسجلات تجارية",
  description: "المنصة الرائدة للخدمات الإلكترونية في السعودية. نساعدك في تجديد الهوية الوطنية، فتح الحسابات البنكية، إصدار السجلات التجارية في القنفذة ومكة المكرمة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
