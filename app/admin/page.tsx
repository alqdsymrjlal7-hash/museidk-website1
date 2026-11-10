"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LayoutDashboard, Inbox, Users, FolderOpen, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
      else setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800"><h1 className="text-white font-bold text-xl">لوحة الإدارة</h1></div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="#" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Inbox className="w-5 h-5"/> الطلبات الجديدة</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> إدارة العملاء</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-slate-800">لوحة تحكم المدير</h2>
          <div className="flex items-center gap-4"><span className="text-sm font-bold">{user?.email}</span></div>
        </header>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-[#0099cc]"><p className="text-slate-500 text-sm mb-1">طلبات جديدة</p><h3 className="text-2xl font-bold">0</h3></div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-orange-500"><p className="text-slate-500 text-sm mb-1">قيد التنفيذ</p><h3 className="text-2xl font-bold">0</h3></div>
          </div>
        </div>
      </main>
    </div>
  );
}
