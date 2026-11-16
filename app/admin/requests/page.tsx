"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Download, MessageCircle } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminRequests() {
  const [reqs, setReqs] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("requests").select(`*, services(title), profiles(email, phone, full_name)`).order("created_at", { ascending: false }).then(r => setReqs(r.data || []));
  }, []);

  const update = async (id: string, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setReqs(reqs.map(r => r.id === id ? { ...r, status } : r));
  };

  const sendWhatsApp = (phone: string, name: string, service: string) => {
    if (!phone) return alert("لا يوجد رقم جوال");
    let formatted = phone.replace(/\s+/g, '');
    if (formatted.startsWith('05')) formatted = '966' + formatted.substring(1);
    const message = `مرحباً ${name || 'عميلنا العزيز'}، نود تذكيركم بخصوص طلبكم (${service}). يرجى التواصل معنا لإكمال الإجراءات. مساعدك الرقمي.`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right"><thead className="bg-slate-50 border-b"><tr><th className="p-4">العميل</th><th className="p-4">الخدمة</th><th className="p-4">المرفق</th><th className="p-4">الحالة</th><th className="p-4">تواصل</th></tr></thead><tbody>
          {reqs.map(r => (
            <tr key={r.id} className="border-b">
              <td className="p-4"><p className="font-bold">{r.profiles?.email}</p><p className="text-xs text-slate-500">{r.client_name} - {r.client_phone || r.profiles?.phone}</p></td>
              <td className="p-4">{r.services?.title}</td>
              <td className="p-4">{r.file_url ? <a href={r.file_url} target="_blank" className="text-blue-600 flex gap-1"><Download className="w-4 h-4"/> تحميل</a> : '-'}</td>
              <td className="p-4"><select value={r.status} onChange={e => update(r.id, e.target.value)} className="bg-slate-100 p-2 rounded-lg"><option value="جديد">جديد</option><option value="قيد التنفيذ">قيد التنفيذ</option><option value="مكتمل">مكتمل</option></select></td>
              <td className="p-4"><button onClick={() => sendWhatsApp(r.client_phone || r.profiles?.phone, r.client_name || r.profiles?.full_name, r.services?.title)} className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#1EBE5D] transition"><MessageCircle className="w-5 h-5" /></button></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
