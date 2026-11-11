"use client";
import { FileText, FolderOpen, Building2, Bell } from "lucide-react";
import Link from "next/link";

export default function PortalHome() {
  const cards = [
    { href: "/portal/requests", icon: FileText, title: "طلباتي", desc: "عرض ومتابعة طلباتك الحالية" },
    { href: "/portal/transactions", icon: FolderOpen, title: "معاملاتي", desc: "سجل المعاملات وتواريخ الانتهاء" },
    { href: "/portal/institutions", icon: Building2, title: "مؤسساتي", desc: "إدارة المؤسسات والعمال" },
    { href: "/portal/notifications", icon: Bell, title: "التنبيهات", desc: "رسائل التذكير والتجديد" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8">مرحباً بك في لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center group">
            <div className="bg-blue-50 p-5 rounded-2xl text-[#0099cc] mb-4 group-hover:bg-[#0099cc] group-hover:text-white transition"><c.icon className="w-10 h-10" /></div>
            <h3 className="text-xl font-bold mb-2">{c.title}</h3>
            <p className="text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
