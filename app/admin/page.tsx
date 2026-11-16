"use client";
import { LayoutDashboard, Users, Settings, UserCog } from "lucide-react";
import Link from "next/link";

export default function AdminHome() {
  const cards = [
    { href: "/admin/requests", icon: LayoutDashboard, title: "الطلبات", desc: "إدارة طلبات العملاء" },
    { href: "/admin/clients", icon: Users, title: "العملاء", desc: "عرض بيانات العملاء" },
    { href: "/admin/services", icon: Settings, title: "الخدمات", desc: "إدارة الخدمات والأسعار" },
    { href: "/admin/staff", icon: UserCog, title: "الموظفين", desc: "إدارة الصلاحيات" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8">لوحة التحكم الرئيسية</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl transition flex flex-col items-center text-center group">
            <div className="bg-blue-50 p-5 rounded-2xl text-[#0099cc] mb-4 group-hover:bg-[#0099cc] group-hover:text-white transition"><c.icon className="w-10 h-10" /></div>
            <h3 className="text-xl font-bold mb-2">{c.title}</h3>
            <p className="text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
