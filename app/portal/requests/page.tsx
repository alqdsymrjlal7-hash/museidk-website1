"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientRequests() {
  const [reqs, setReqs] = useState<any[]>([]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from("requests").select(`*, services(title)`).eq("client_id", data.user.id).order("created_at", { ascending: false }).then(r => setReqs(r.data || []));
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
        <Link href="/request" className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="w-4 h-4"/> طلب خدمة</Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right"><thead className="bg-slate-50 border-b"><tr><th className="p-4">الخدمة</th><th className="p-4">التاريخ</th><th className="p-4">الحالة</th></tr></thead><tbody>
          {reqs.length === 0 ? <tr><td colSpan={3} className="p-8 text-center text-slate-400">لا توجد طلبات</td></tr> : reqs.map(r => (
            <tr key={r.id} className="border-b"><td className="p-4 font-bold">{r.services?.title}</td><td className="p-4 text-slate-500">{new Date(r.created_at).toLocaleDateString('ar-SA')}</td><td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{r.status}</span></td></tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
        }
