"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, FileText, FolderOpen, Bell, RefreshCcw, Home, Plus, Building2 } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PortalPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from("requests")
        .select(`*, services (title, price)`)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
        
      if (data) setRequests(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800">
          <h1 className="text-white font-bold text-xl">بوابة العميل</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/portal" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Home className="w-5 h-5"/> ملخص الحساب</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> طلباتي</a>
          <a href="/portal/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FolderOpen className="w-5 h-5"/> معاملاتي</a>
          <a href="/portal/institutions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Building2 className="w-5 h-5"/> مؤسساتي</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">مرحباً، {user?.email?.split('@')[0]}</h2>
          <Link href="/" className="text-sm text-[#0099cc] hover:underline hidden md:block">العودة للموقع</Link>
        </header>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm mb-1">الطلبات الجارية</p>
              <h3 className="text-3xl font-bold text-[#0099cc]">{requests.filter(r => r.status !== 'مكتمل').length}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm mb-1">المعاملات المكتملة</p>
              <h3 className="text-3xl font-bold text-green-500">{requests.filter(r => r.status === 'مكتمل').length}</h3>
            </div>
            <Link href="/request" className="bg-[#0099cc] text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center hover:bg-[#007799] transition">
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-bold text-lg">طلب خدمة جديدة</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">أحدث الطلبات</div>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-medium">رقم الطلب</th>
                    <th className="p-4 font-medium">الخدمة</th>
                    <th className="p-4 font-medium">التاريخ</th>
                    <th className="p-4 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">لا توجد طلبات حتى الآن.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4 text-slate-400 text-xs">#{req.id.split('-')[0]}</td>
                        <td className="p-4 font-bold text-slate-800">{req.services?.title}</td>
                        <td className="p-4 text-slate-500">{new Date(req.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{req.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
              }
