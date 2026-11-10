"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, FileText, FolderOpen, Bell, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PortalPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
      else setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800"><h1 className="text-white font-bold text-xl">بوابة العميل</h1></div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="#" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Home className="w-5 h-5"/> ملخص الحساب</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> طلباتي</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FolderOpen className="w-5 h-5"/> معاملاتي</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><RefreshCcw className="w-5 h-5"/> التجديدات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-slate-800">مرحباً، {user?.email?.split('@')[0]}</h2>
          <Link href="/" className="text-sm text-[#0099cc] hover:underline">العودة للموقع</Link>
        </header>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm mb-1">الطلبات الجارية</p><h3 className="text-3xl font-bold text-[#0099cc]">0</h3></div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm mb-1">المعاملات المكتملة</p><h3 className="text-3xl font-bold text-green-500">0</h3></div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm mb-1">التجديدات القريبة</p><h3 className="text-3xl font-bold text-orange-500">0</h3></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
            <p>لا توجد لديك أي معاملات حالياً.</p>
          </div>
        </div>
      </main>
    </div>
  );
            }
