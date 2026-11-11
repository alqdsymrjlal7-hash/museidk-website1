"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, FileText, FolderOpen, Bell, Home, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (!data.user) window.location.href = "/login"; else setUser(data.user); }); }, []);
  
  const menu = [
    { href: "/portal", icon: Home, label: "لوحة التحكم" },
    { href: "/portal/requests", icon: FileText, label: "طلباتي" },
    { href: "/portal/transactions", icon: FolderOpen, label: "معاملاتي" },
    { href: "/portal/institutions", icon: Building2, label: "مؤسساتي" },
    { href: "/portal/notifications", icon: Bell, label: "التنبيهات" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col shadow-xl">
        <Link href="/" className="h-24 flex items-center justify-center border-b border-slate-800"><img src="/images/logo.png" className="h-14 mix-blend-screen" /></Link>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menu.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === item.href ? 'bg-[#0099cc] text-white' : 'hover:bg-slate-800'}`}><item.icon className="w-5 h-5" /> {item.label}</Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={() => { supabase.auth.signOut(); window.location.href="/"; }} className="flex gap-3 text-red-400 w-full hover:bg-slate-800 p-3 rounded-xl"><LogOut className="w-5 h-5" /> تسجيل الخروج</button></div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-bold">بوابة العميل</h2>
          <div className="flex items-center gap-4"><Link href="/" className="text-sm font-bold text-slate-500 hover:text-[#0099cc] flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> الرئيسية</Link><span className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-full">{user?.email}</span></div>
        </header>
        <div className="p-4 md:p-8 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
    }
