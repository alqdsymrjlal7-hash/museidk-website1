"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Plus, Upload, Trash2 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = () => {
    supabase.from("services").select("*").order("created_at", { ascending: false }).then(r => setServices(r.data || []));
  };

  useEffect(() => { fetchServices(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = null;

    if (file) {
      const path = `services/${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from("attachments").upload(path, file);
      if (!uploadError) imageUrl = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      else alert("تم حفظ الخدمة، ولكن فشل رفع الصورة.");
    }

    const { error } = await supabase.from("services").insert([{ 
      title: form.title, description: form.description, price: form.price || "حسب الطلب", image_url: imageUrl, is_active: true
    }]);

    setLoading(false);
    if (error) alert("حدث خطأ: " + error.message);
    else {
      setShowForm(false); setForm({ title: "", description: "", price: "" }); setFile(null); fetchServices();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    await supabase.from("services").delete().eq("id", id);
    fetchServices();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#007799] transition">
          <Plus className="w-4 h-4"/> إضافة خدمة
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h3 className="font-bold text-lg mb-2">إضافة خدمة جديدة</h3>
          <input required placeholder="اسم الخدمة (إجباري)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-lg" />
          <textarea placeholder="وصف الخدمة" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border rounded-lg" rows={3}></textarea>
          <input placeholder="السعر (اختياري)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-3 border rounded-lg" />
          <div className="border-2 border-dashed p-4 text-center rounded-lg relative bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
            <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
            <p className="text-sm text-slate-500">{file ? file.name : "اختر صورة للخدمة (اختياري)"}</p>
          </div>
          <button type="submit" disabled={loading} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold w-full disabled:opacity-50">
            {loading ? "جاري الحفظ..." : "حفظ الخدمة"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            {s.image_url ? <img src={s.image_url} className="w-full h-32 object-cover" alt={s.title} /> : <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400">لا توجد صورة</div>}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-slate-500 text-sm mb-2">{s.description}</p>
              <p className="text-[#0099cc] font-bold mb-4 mt-auto">{s.price}</p>
              <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm flex items-center gap-1 self-start hover:bg-red-50 px-2 py-1 rounded transition"><Trash2 className="w-4 h-4"/> حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
                                                }
