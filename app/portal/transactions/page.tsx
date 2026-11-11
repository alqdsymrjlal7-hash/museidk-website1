"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientTransactions() {
  const [txs, setTxs] = useState<any[]>([]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from("transactions").select("*").eq("client_id", data.user.id).then(r => setTxs(r.data || []));
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right"><thead className="bg-slate-50 border-b"><tr><th className="p-4">المعاملة</th><th className="p-4">تاريخ الانتهاء</th><th className="p-4">الحالة</th><th className="p-4">الإجراء</th></tr></thead><tbody>
          {txs.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-400">لا توجد معاملات</td></tr> : txs.map(t => (
            <tr key={t.id} className="border-b"><td className="p-4 font-bold">{t.title}</td><td className="p-4 text-slate-500">{t.expiry_date || '-'}</td><td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">{t.status}</span></td><td className="p-4"><Link href="/request" className="text-[#0099cc] flex items-center gap-1 font-bold"><RefreshCcw className="w-4 h-4"/> تجديد</Link></td></tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
      }
