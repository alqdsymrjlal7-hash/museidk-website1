"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Inbox, Users, Settings, Download } from "lucide-react";
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
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data } = await supabase
        .from("requests")
        .select(`*, profiles (email), services (title, price)`)
        .order("created_at", { ascending: false });

      if (data) setRequests(data);
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("requests").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } else {
      alert("حدث خطأ في التحديث");
    }
  };

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
          <a href="/admin" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">لوحة تحكم المدير</h2>
          <div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-700 hidden sm:block">{user?.email}</span></div>
        </header>

        <div className="p-4 md:p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">الطلبات الواردة</div>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[700px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="p-4 font-medium">العميل</th>
                    <th className="p-4 font-medium">الخدمة</th>
                    <th className="p-4 font-medium">المرفق</th>
                    <th className="p-4 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800" dir="ltr">{req.profiles?.email}</td>
                      <td className="p-4 text-slate-600">{req.services?.title}</td>
                      <td className="p-4">
                        {req.file_url ? (
                          <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            <Download className="w-4 h-4"/> تحميل الملف
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">لا يوجد</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select 
                          value={req.status} 
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className="bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#0099cc] focus:border-[#0099cc] block w-full p-2"
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد المراجعة">قيد المراجعة</option>
                          <option value="قيد التنفيذ">قيد التنفيذ</option>
                          <option value="مكتمل">مكتمل</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
        }
