"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => { supabase.from("profiles").select("*").eq("role", "client").then(r => setClients(r.data || [])); }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right"><thead className="bg-slate-50 border-b"><tr><th className="p-4">الاسم</th><th className="p-4">الايميل</th><th className="p-4">الجوال</th></tr></thead><tbody>
          {clients.map(c => <tr key={c.id} className="border-b"><td className="p-4 font-bold">{c.full_name}</td><td className="p-4">{c.email}</td><td className="p-4">{c.phone}</td></tr>)}
        </tbody></table>
      </div>
    </div>
  );
}
