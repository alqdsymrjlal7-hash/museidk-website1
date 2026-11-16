"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Eye, Search } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { 
    supabase.from("profiles").select("*").eq("role", "client").then(r => setClients(r.data || [])); 
  }, []);

  const filtered = clients.filter(c => c.email?.includes(search) || c.full_name?.includes(search));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc] transition"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      
      <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input type="text" placeholder="ابحث بالاسم أو البريد..." value={search} onChange={e => setSearch(e.target.value)} className="w-full outline-none text-slate-700" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b"><tr><th className="p-4">الاسم</th><th className="p-4">البريد</th><th className="p-4">الجوال</th><th className="p-4">الإجراء</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b">
                <td className="p-4 font-bold">{c.full_name || 'غير مسجل'}</td>
                <td className="p-4" dir="ltr">{c.email}</td>
                <td className="p-4" dir="ltr">{c.phone || '-'}</td>
                <td className="p-4">
                  <Link href={`/admin/clients/${c.id}`} className="text-[#0099cc] font-bold flex items-center gap-1 hover:underline"><Eye className="w-4 h-4"/> عرض الملف</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
      }
