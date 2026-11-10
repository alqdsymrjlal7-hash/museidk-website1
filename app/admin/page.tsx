"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Inbox, Users, Settings } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // جلب جميع الطلبات من قاعدة البيانات مع بيانات العميل والخدمة
      const { data, error } = await supabase
        .from("requests")
        .select(`*, profiles (email), services (title, price)`)
        .order("created_at", { ascending: false });

      if (data) setRequests(data);
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري تحميل لوحة الإدارة...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      
      {/* القائمة الجانبية */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800">
          <h1 className="text-white font-bold text-xl">لوحة الإدارة</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/admin" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Inbox className="w-5 h-5"/> الطلبات الجديدة</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> إدارة العملاء</a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Settings className="w-5 h-5"/> الإعدادات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">لوحة تحكم المدير</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-slate-700 hidden sm:block">{user?.email}</span>
             <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center rounded-full font-bold">A</div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-[#0099cc]">
              <p className="text-slate-500 text-sm mb-1">إجمالي الطلبات</p>
              <h3 className="text-2xl font-bold text-slate-800">{requests.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-r-4 border-r-orange-500">
              <p className="text-slate-500 text-sm mb-1">قيد المراجعة</p>
              <h3 className="text-2xl font-bold text-slate-800">{requests.filter(r => r.status === 'جديد').length}</h3>
            </div>
          </div>

          {/* جدول الطلبات */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">أحدث الطلبات الواردة</div>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[700px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="p-4 font-medium">رقم الطلب</th>
                    <th className="p-4 font-medium">العميل</th>
                    <th className="p-4 font-medium">الخدمة</th>
                    <th className="p-4 font-medium">الحالة</th>
                    <th className="p-4 font-medium">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">لا توجد طلبات واردة حتى الآن.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4 text-slate-400 text-xs">#{req.id.split('-')[0]}</td>
                        <td className="p-4 font-bold text-slate-800" dir="ltr">{req.profiles?.email}</td>
                        <td className="p-4 text-slate-600">{req.services?.title}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'جديد' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-[#0099cc] hover:bg-blue-50 px-3 py-1 rounded font-bold transition">مراجعة</button>
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
