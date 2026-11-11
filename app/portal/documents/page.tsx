"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, FileText, Download, Home, FolderOpen, Bell, Building2, LogOut, Users } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientDocumentsPage() {
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      // 1. جلب ملفات العميل (من الطلبات)
      const { data: reqData } = await supabase
        .from("requests")
        .select(`id, created_at, file_url, services (title)`)
        .eq("client_id", user.id)
        .not("file_url", "is", null);
        
      // 2. جلب المستندات النهائية (من المعاملات)
      const { data: txData } = await supabase
        .from("transactions")
        .select(`id, created_at, file_url, title`)
        .eq("client_id", user.id)
        .not("file_url", "is", null);

      let allDocs: any[] = [];
      
      if (reqData) {
        allDocs = [...allDocs, ...reqData.map(d => ({
          id: d.id,
          type: "طلب خدمة",
          title: d.services?.title || 'مرفق طلب',
          date: d.created_at,
          url: d.file_url
        }))];
      }

      if (txData) {
        allDocs = [...allDocs, ...txData.map(d => ({
          id: d.id,
          type: "مستند نهائي",
          title: d.title,
          date: d.created_at,
          url: d.file_url
        }))];
      }

      // ترتيب حسب التاريخ
      allDocs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setDocuments(allDocs);
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
          <a href="/portal" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Home className="w-5 h-5"/> ملخص الحساب</a>
          <a href="/portal/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FolderOpen className="w-5 h-5"/> معاملاتي</a>
          <a href="/portal/institutions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Building2 className="w-5 h-5"/> مؤسساتي</a>
          <a href="/portal/beneficiaries" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> المستفيدين</a>
          <a href="/portal/documents" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><FileText className="w-5 h-5"/> المستندات</a>
          <a href="/portal/notifications" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Bell className="w-5 h-5"/> التنبيهات</a>
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
            <h1 className="text-xl font-bold">المستندات</h1>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">جميع المستندات والملفات</div>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="p-4 font-medium">نوع المستند</th>
                    <th className="p-4 font-medium">التفاصيل</th>
                    <th className="p-4 font-medium">التاريخ</th>
                    <th className="p-4 font-medium">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">لا توجد مستندات مرفوعة حالياً.</td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.type === 'مستند نهائي' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {doc.type}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{doc.title}</td>
                        <td className="p-4 text-slate-500">{new Date(doc.date).toLocaleDateString('ar-SA')}</td>
                        <td className="p-4">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-white text-[#0099cc] border border-[#0099cc] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#0099cc] hover:text-white transition">
                            <Download className="w-4 h-4" /> تحميل
                          </a>
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
