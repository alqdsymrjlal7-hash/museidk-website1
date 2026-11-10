"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Users, FileText, AlertCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminTransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      // جلب جميع المعاملات مع إيميل العميل
      const { data } = await supabase
        .from("transactions")
        .select(`*, profiles (email)`)
        .order("expiry_date", { ascending: true });
        
      if (data) setTransactions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // دالة لحساب عدد الأيام المتبقية
  const getDaysRemaining = (expiryDate: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
    tx.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      
      {/* القائمة الجانبية */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800"><h1 className="text-white font-bold text-xl">لوحة الإدارة</h1></div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/admin" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
          <a href="/admin/transactions" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><FileText className="w-5 h-5"/> إدارة المعاملات</a>
          <a href="/admin/clients" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> إدارة العملاء</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">إدارة المعاملات والتجديدات</h2>
          <div className="text-sm font-bold text-slate-700 hidden sm:block">{user?.email}</div>
        </header>

        <div className="p-4 md:p-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* شريط البحث */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <input 
                type="text" 
                placeholder="ابحث باسم العميل أو المعاملة..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md bg-white px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc]"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="p-4 font-medium">العميل</th>
                    <th className="p-4 font-medium">المعاملة</th>
                    <th className="p-4 font-medium">تاريخ الانتهاء</th>
                    <th className="p-4 font-medium">المتبقي</th>
                    <th className="p-4 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">لا توجد معاملات مسجلة حتى الآن.</td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const daysLeft = getDaysRemaining(tx.expiry_date);
                      return (
                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-800" dir="ltr">{tx.profiles?.email || 'غير معروف'}</td>
                          <td className="p-4 text-slate-600">{tx.title}</td>
                          <td className="p-4 text-slate-500" dir="ltr">{tx.expiry_date || '-'}</td>
                          <td className="p-4">
                            {daysLeft !== null ? (
                              daysLeft <= 0 ? (
                                <span className="text-red-600 font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4"/> منتهية</span>
                              ) : daysLeft <= 90 ? (
                                <span className="text-orange-500 font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {daysLeft} يوم</span>
                              ) : (
                                <span className="text-green-600 font-bold">{daysLeft} يوم</span>
                              )
                            ) : '-'}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              daysLeft !== null && daysLeft <= 0 ? 'bg-red-100 text-red-700' : 
                              daysLeft !== null && daysLeft <= 90 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
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
