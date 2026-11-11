"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Bell, CheckCircle, Home, FileText, FolderOpen, Building2, LogOut, Users } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setNotifications(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <Link href="/" className="h-20 flex items-center justify-center border-b border-slate-800 hover:bg-slate-800 transition">
          <img src="/images/logo.png" alt="Logo" className="h-14 w-auto object-contain mix-blend-screen" />
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/portal" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Home className="w-5 h-5"/> ملخص الحساب</a>
          <a href="/portal/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FolderOpen className="w-5 h-5"/> معاملاتي</a>
          <a href="/portal/institutions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Building2 className="w-5 h-5"/> مؤسساتي</a>
          <a href="/portal/beneficiaries" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> المستفيدين</a>
          <a href="/portal/documents" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> المستندات</a>
          <a href="/portal/notifications" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Bell className="w-5 h-5"/> التنبيهات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4 md:hidden">
            <Link href="/portal" className="p-2 bg-white rounded-full shadow"><ArrowRight className="w-5 h-5 text-slate-600" /></Link>
            <h1 className="text-xl font-bold">التنبيهات</h1>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                لا توجد لديك أي تنبيهات حالياً.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <li key={notif.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition ${notif.is_read ? 'opacity-70' : 'bg-blue-50/50'}`}>
                    <div className={`p-2 rounded-full mt-1 ${notif.is_read ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-[#0099cc]'}`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${notif.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{notif.message}</p>
                      <span className="text-xs text-slate-400 mt-2 block">{new Date(notif.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    {!notif.is_read && (
                      <button onClick={() => markAsRead(notif.id)} className="text-xs text-[#0099cc] font-bold hover:underline flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> تعيين كمقروء
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
