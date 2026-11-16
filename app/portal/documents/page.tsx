"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, FileText, Download } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      
      const { data: reqData } = await supabase.from("requests").select(`id, created_at, file_url, services (title)`).eq("client_id", user.id).not("file_url", "is", null);
      const { data: txData } = await supabase.from("transactions").select(`id, created_at, file_url, title`).eq("client_id", user.id).not("file_url", "is", null);
      
      let allDocs: any[] = [];
      
      if (reqData) {
        allDocs = [...allDocs, ...reqData.map((d: any) => {
          const title = Array.isArray(d.services) ? d.services[0]?.title : d.services?.title;
          return { id: d.id, type: "طلب خدمة", title: title || 'مرفق طلب', date: d.created_at, url: d.file_url };
        })];
      }
      
      if (txData) {
        allDocs = [...allDocs, ...txData.map((d: any) => ({ id: d.id, type: "مستند نهائي", title: d.title, date: d.created_at, url: d.file_url }))];
      }
      
      allDocs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDocuments(allDocs);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b"><tr><th className="p-4">نوع المستند</th><th className="p-4">التفاصيل</th><th className="p-4">التاريخ</th><th className="p-4">الإجراء</th></tr></thead>
          <tbody className="text-sm">
            {documents.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500">لا توجد مستندات.</td></tr> : documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.type === 'مستند نهائي' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{doc.type}</span></td>
                <td className="p-4 font-bold">{doc.title}</td>
                <td className="p-4 text-slate-500">{new Date(doc.date).toLocaleDateString('ar-SA')}</td>
                <td className="p-4"><a href={doc.url} target="_blank" className="text-[#0099cc] font-bold flex items-center gap-1"><Download className="w-4 h-4"/> تحميل</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
                                                                       }
