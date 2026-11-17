"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, User, Phone, Mail, FileText, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", id).single().then(r => setClient(r.data));
    supabase.from("requests").select(`*, services(title)`).eq("client_id", id).order("created_at", { ascending: false }).then(r => setRequests(r.data || []));
  }, [id]);

  if (!client) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/clients" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc] transition"><ArrowRight className="w-5 h-5"/> رجوع للعملاء</Link>
      
      {/* كارت بيانات العميل (للعرض فقط) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-800">ملف العميل (للقراءة فقط)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-slate-600"><User className="w-5 h-5 text-[#0099cc]"/> {client.full_name || 'غير مسجل'}</div>
          <div className="flex items-center gap-2 text-slate-600" dir="ltr"><Mail className="w-5 h-5 text-[#0099cc]"/> {client.email}</div>
          <div className="flex items-center gap-2 text-slate-600" dir="ltr"><Phone className="w-5 h-5 text-[#0099cc]"/> {client.phone || 'لا يوجد'}</div>
        </div>
      </div>

      {/* جدول الطلبات (للعرض فقط) */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b font-bold bg-slate-50">سجل طلبات العميل</div>
        <table className="w-full text-right">
          <thead className="border-b text-sm text-slate-500"><tr><th className="p-4">الخدمة</th><th className="p-4">التاريخ</th><th className="p-4">الحالة</th><th className="p-4">المرفق</th></tr></thead>
          <tbody>
            {requests.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500">لا توجد طلبات لهذا العميل.</td></tr> : requests.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-4 font-bold text-slate-800">{r.services?.title}</td>
                <td className="p-4 text-slate-500">{new Date(r.created_at).toLocaleDateString('ar-SA')}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{r.status}</span></td>
                <td className="p-4">{r.file_url ? <a href={r.file_url} target="_blank" className="text-blue-600 flex gap-1"><Download className="w-4 h-4"/> تحميل</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
    }
