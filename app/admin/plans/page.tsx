"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Plus, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", requests: "", institutions: "", workers: "" });
  const [loading, setLoading] = useState(false);

  const fetchPlans = () => {
    supabase.from("plans").select("*").order("price", { ascending: true }).then(r => setPlans(r.data || []));
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const features = {
      requests: form.requests === "unlimited" ? "unlimited" : parseInt(form.requests) || 0,
      institutions: form.institutions === "unlimited" ? "unlimited" : parseInt(form.institutions) || 0,
      workers: form.workers === "unlimited" ? "unlimited" : parseInt(form.workers) || 0,
    };

    const { error } = await supabase.from("plans").insert([{ 
      name: form.name, 
      price: parseFloat(form.price) || 0, 
      features: features 
    }]);

    setLoading(false);
    if (error) alert("حدث خطأ: " + error.message);
    else {
      setShowForm(false); setForm({ name: "", price: "", requests: "", institutions: "", workers: "" }); fetchPlans();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return;
    await supabase.from("plans").delete().eq("id", id);
    fetchPlans();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#007799] transition">
          <Plus className="w-4 h-4"/> إضافة باقة
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h3 className="font-bold text-lg mb-2 text-slate-800">إضافة باقة جديدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="اسم الباقة (مثال: الباقة الذهبية)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 border rounded-lg" />
            <input required type="number" placeholder="السعر (ريال)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="p-3 border rounded-lg" />
            <input placeholder="عدد الطلبات (أو unlimited)" value={form.requests} onChange={e => setForm({...form, requests: e.target.value})} className="p-3 border rounded-lg" />
            <input placeholder="عدد المؤسسات (أو unlimited)" value={form.institutions} onChange={e => setForm({...form, institutions: e.target.value})} className="p-3 border rounded-lg" />
            <input placeholder="عدد العمال (أو unlimited)" value={form.workers} onChange={e => setForm({...form, workers: e.target.value})} className="p-3 border rounded-lg md:col-span-2" />
          </div>
          <button type="submit" disabled={loading} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold w-full disabled:opacity-50">
            {loading ? "جاري الحفظ..." : "حفظ الباقة"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#0099cc]"></div>
            <h3 className="font-bold text-lg text-slate-800">{p.name}</h3>
            <p className="text-2xl font-extrabold text-[#0099cc] my-2">{p.price} <span className="text-sm font-normal text-slate-500">ريال / شهر</span></p>
            <ul className="text-sm text-slate-600 space-y-2 mb-4 flex-grow">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> الطلبات: {p.features?.requests === "unlimited" ? "غير محدود" : p.features?.requests || 0}</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> المؤسسات: {p.features?.institutions === "unlimited" ? "غير محدود" : p.features?.institutions || 0}</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> العمال: {p.features?.workers === "unlimited" ? "غير محدود" : p.features?.workers || 0}</li>
            </ul>
            <button onClick={() => handleDelete(p.id)} className="text-red-500 text-sm flex items-center gap-1 self-start hover:bg-red-50 px-2 py-1 rounded transition"><Trash2 className="w-4 h-4"/> حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
                                   }
