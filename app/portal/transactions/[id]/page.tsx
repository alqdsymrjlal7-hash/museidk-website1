"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, UserPlus, Phone, CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function InstitutionDetails() {
  const { id } = useParams();
  const [benefs, setBenefs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", national_id: "", phone: "" });

  const fetch = () => { supabase.from("beneficiaries").select("*").eq("institution_id", id).then(r => setBenefs(r.data || [])); };
  useEffect(() => { fetch(); }, [id]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("beneficiaries").insert([{ ...form, institution_id: id }]);
    setShowForm(false); setForm({ name: "", national_id: "", phone: "" }); fetch();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/portal/institutions" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للمؤسسات</Link>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold flex gap-2"><UserPlus className="w-4 h-4"/> إضافة عامل</button>
      </div>
      {showForm && (
        <form onSubmit={add} className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
          <input required placeholder="اسم العامل" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input required placeholder="رقم الهوية" value={form.national_id} onChange={e => setForm({...form, national_id: e.target.value})} className="w-full p-3 border rounded-lg" />
          <input placeholder="رقم الجوال" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
          <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold w-full">حفظ</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefs.map(b => (
          <div key={b.id} className="bg-white p-5 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg">{b.name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-2"><CreditCard className="w-4 h-4"/> {b.national_id}</p>
            {b.phone && <p className="text-sm text-slate-500 flex items-center gap-1"><Phone className="w-4 h-4"/> {b.phone}</p>}
          </div>
        ))}
      </div>
    </div>
  );
    }
