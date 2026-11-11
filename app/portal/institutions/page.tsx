"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Building2, Plus, Users } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientInstitutions() {
  const [insts, setInsts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", cr_number: "" });

  const fetch = () => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from("institutions").select("*").eq("owner_id", data.user.id).then(r => setInsts(r.data || []));
    });
  };
  useEffect(() => { fetch(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("institutions").insert([{ ...form, owner_id: user?.id }]);
    setShowForm(false); setForm({ name: "", cr_number: "" }); fetch();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold flex gap-2"><Plus className="w-4 h-4"/> إضافة مؤسسة</button>
      </div>
      {showForm && (
        <form onSubmit={add} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4">
          <input required placeholder="اسم المؤسسة" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 border rounded-lg flex-1" />
          <input placeholder="السجل التجاري" value={form.cr_number} onChange={e => setForm({...form, cr_number: e.target.value})} className="p-3 border rounded-lg flex-1" />
          <button className="bg-slate-900 text-white px-6 rounded-lg font-bold">حفظ</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insts.map(i => (
          <div key={i.id} className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-bold text-lg flex items-center gap-2"><Building2 className="text-[#0099cc]"/> {i.name}</h3>
            <p className="text-sm text-slate-500 mb-4">س.ت: {i.cr_number || 'غير مسجل'}</p>
            <Link href={`/portal/institutions/${i.id}`} className="bg-slate-50 border px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 flex items-center gap-2 w-max"><Users className="w-4 h-4"/> إدارة العمال</Link>
          </div>
        ))}
      </div>
    </div>
  );
      }
