"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, UserPlus, Users, Phone, CreditCard, Building2, Home, FileText, FolderOpen, Bell, LogOut } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function BeneficiariesPage() {
  const [user, setUser] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", national_id: "", phone: "", institution_id: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data: instData } = await supabase.from("institutions").select("id, name").eq("owner_id", user.id);
      if (instData) setInstitutions(instData);

      const { data: benData } = await supabase.from("beneficiaries").select(`*, institutions (name)`).order("created_at", { ascending: false });
      if (benData) setBeneficiaries(benData);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution_id) return alert("يجب اختيار مؤسسة أولاً.");

    const { data, error } = await supabase.from("beneficiaries").insert([{ name: formData.name, national_id: formData.national_id, phone: formData.phone, institution_id: formData.institution_id }]).select(`*, institutions (name)`);

    if (error) alert("حدث خطأ: " + error.message);
    else {
      alert("تمت إضافة المستفيد بنجاح!");
      if (data) setBeneficiaries([data[0], ...beneficiaries]);
      setShowForm(false);
      setFormData({ name: "", national_id: "", phone: "", institution_id: "" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <Link href="/" className="h-20 flex items-center justify-center border-b border-slate-800 hover:bg-slate-800 transition">
          <img src="/images/logo.png" alt="Logo" className="h-14 w-auto object-contain mix-blend-screen" />
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/portal" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Home className="w-5 h-5"/> ملخص الحساب</a>
          <a href="/portal/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FolderOpen className="w-5 h-5"/> معاملاتي</a>
          <a href="/portal/institutions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Building2 className="w-5 h-5"/> مؤسساتي</a>
          <a href="/portal/beneficiaries" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Users className="w-5 h-5"/> المستفيدين</a>
          <a href="/portal/documents" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> المستندات</a>
          <a href="/portal/notifications" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Bell className="w-5 h-5"/> التنبيهات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/portal" className="p-2 bg-white rounded-full shadow hover:bg-slate-100 md:hidden"><ArrowRight className="w-5 h-5 text-slate-600" /></Link>
              <h1 className="text-2xl font-bold text-slate-800">المستفيدين (العمال)</h1>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#007799]">
              <UserPlus className="w-4 h-4"/> إضافة مستفيد
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-4">إضافة مستفيد جديد</h3>
              {institutions.length === 0 ? (
                <div className="bg-orange-50 text-orange-700 p-4 rounded-lg text-sm mb-4">يجب عليك إضافة مؤسسة واحدة على الأقل من صفحة "مؤسساتي" قبل إضافة عمال.</div>
              ) : (
                <form onSubmit={handleAddBeneficiary} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select required value={formData.institution_id} onChange={(e) => setFormData({...formData, institution_id: e.target.value})} className="p-3 border rounded-lg md:col-span-2 bg-white">
                    <option value="">اختر المؤسسة التابع لها العامل...</option>
                    {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                  </select>
                  <input required type="text" placeholder="اسم العامل" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-3 border rounded-lg" />
                  <input required type="text" placeholder="رقم الهوية / الإقامة" value={formData.national_id} onChange={(e) => setFormData({...formData, national_id: e.target.value})} className="p-3 border rounded-lg" />
                  <input type="text" placeholder="رقم الجوال (اختياري)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-3 border rounded-lg md:col-span-2" />
                  <button type="submit" className="bg-slate-900 text-white rounded-lg py-3 font-bold md:col-span-2">حفظ المستفيد</button>
                </form>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficiaries.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 col-span-2">
                <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                لا يوجد مستفيدين مسجلين حالياً.
              </div>
            ) : (
              beneficiaries.map((ben) => (
                <div key={ben.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-slate-800">{ben.name}</h3>
                    <span className="text-xs bg-blue-50 text-[#0099cc] px-2 py-1 rounded-md">{ben.institutions?.name}</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400"/> {ben.national_id}</p>
                    {ben.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/> {ben.phone}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
    }
