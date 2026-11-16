"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Users, Settings, UserCog, ArrowLeft, Bell, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => { 
    supabase.auth.getUser().then(({ data }) => { 
      if (!data.user) {
        window.location.href = "/login?redirect=/admin"; 
      } else {
        setUser(data.user);
        supabase.from("profiles").select("role").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (!profile || !['admin', 'data_entry', 'follow_up'].includes(profile.role)) {
            alert("غير مصرح لك بالدخول. هذه الصفحة للمدير فقط.");
            window.location.href = "/portal"; 
          } else {
            setRole(profile.role);
            setLoading(false);
            supabase.from("admin_notifications").select("*").eq("is_read", false).order("created_at", { ascending: false }).then(res => {
              setNotifications(res.data || []);
            });
          }
        });
      }
    }); 
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("admin_notifications").update({ is_read: true }).eq("id", id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحقق من الصلاحيات...</div>;

  const menu = [
    { href: "/admin", icon: LayoutDashboard, label: "لوحة التحكم" }, 
    { href: "/admin/requests", icon: LayoutDashboard, label: "الطلبات" }, 
    { href: "/admin/clients", icon: Users, label: "العملاء" }, 
    { href: "/admin/plans", icon: CreditCard, label: "الباقات" },
    { href: "/admin/services", icon: Settings, label: "الخدمات" }, 
    { href: "/admin/staff", icon: UserCog, label: "الموظفين" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col shadow-xl">
        <Link href="/" className="h-24 flex items-center justify-center border-b border-slate-800 hover:bg-slate-800/50 transition">
          <img src="/images/logo.png" className="h-14 mix-blend-screen" />
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menu.map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href ? 'bg-[#0099cc] text-white shadow-lg' : 'hover:bg-slate-800'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { supabase.auth.signOut(); window.location.href="/"; }} className="flex gap-3 text-red-400 w-full hover:bg-slate-800 p-3 rounded-xl transition">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">لوحة الإدارة</h2>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-[#0099cc] flex items-center gap-1 transition">
              <ArrowLeft className="w-4 h-4"/> الرئيسية
            </Link>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-full text-slate-800">{user?.email}</span>
              <span className="text-[10px] text-[#0099cc] font-bold mt-1">{role === 'admin' ? 'مدير النظام' : 'موظف'}</span>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {notifications.length > 0 && (
            <div className="bg-white border border-blue-200 p-4 mb-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-[#0099cc] mb-3 flex items-center gap-2"><Bell className="w-5 h-5"/> لديك إشعارات جديدة:</h3>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-sm text-slate-700">{n.message}</p>
                    <button onClick={() => markAsRead(n.id)} className="text-xs text-white bg-[#0099cc] hover:bg-[#007799] px-3 py-1.5 rounded-lg flex items-center gap-1 transition"><CheckCircle className="w-4 h-4"/> تم</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
              }
