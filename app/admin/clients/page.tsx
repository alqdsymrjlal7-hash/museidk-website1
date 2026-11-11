"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Users, Search, Eye, FileText, Settings } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientsPage() {
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data } = await supabase.from("profiles").select("*").eq("role", "client").order("created_at", { ascending: false });
      if (data) setClients(data);
      setLoading(false);
    };
    fetchClients();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const filteredClients = clients.filter(c => c.email?.toLowerCase().includes(search.toLowerCase()) || (c.full_name && c.full_name.toLowerCase().includes(search.toLowerCase())));

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <Link href="/" className="h-20 flex items-center justify-center border-b border-slate-800 hover:bg-slate-800 transition">
          <img src="/images/logo.png" alt="Logo" className="h-14 w-auto object-contain mix-blend-screen" />
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/admin" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
          <a href="/admin/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> إدارة المعاملات</a>
          <a href="/admin/clients" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Users className="w-5 h-5"/> إدارة العملاء</a>
          <a href="/admin/services" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Settings className="w-5 h-5"/> إدارة الخدمات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">إدارة العملاء</h2>
          <div className="text-sm font-bold text-slate-700 hidden sm:block">{user?.email}</div>
        </header>

        <div className="p-4 md:p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" />
              <input type="text" placeholder="ابحث بالبريد الإلكتروني..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent focus:outline-none text-slate-700" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="p-4 font-medium">العميل (البريد)</th>
                    <th className="p-4 font-medium">تاريخ التسجيل</th>
                    <th className="p-4 font-medium">الصلاحية</th>
                    <th className="p-4 font-medium">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredClients.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">لا يوجد عملاء مطابقين للبحث.</td></tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-800" dir="ltr">{client.email}</td>
                        <td className="p-4 text-slate-500">{new Date(client.created_at).toLocaleDateString('ar-SA')}</td>
                        <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{client.role}</span></td>
                        <td className="p-4">
                          <button className="text-[#0099cc] hover:bg-blue-50 px-3 py-1 rounded font-bold transition flex items-center gap-1"><Eye className="w-4 h-4"/> عرض</button>
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
