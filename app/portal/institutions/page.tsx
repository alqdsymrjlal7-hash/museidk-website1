"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Building2, Plus, Home, FileText, FolderOpen, Bell, LogOut, Users } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function InstitutionsPage() {
  const [user, setUser] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", cr_number: "", phone: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data } = await supabase.from("institutions").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
      if (data) setInstitutions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from("institutions").insert([{ owner_id: user.id, name: formData.name, cr_number: formData.cr_number, phone: formData.phone }]).select();

    if (error) alert("حدث خطأ: " + error.message);
    else {
      alert("تمت إضافة المؤسسة بنجاح!");
      if (data) setInstitutions([data[0], ...institutions]);
      setShowForm(false);
      setFormData({ name: "", cr_number: "", phone: "" });
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
          <a href="/portal/institutions" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Building2 className="w-5 h-5"/> مؤسساتي</a>
          <a href="/portal/beneficiaries" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> المستفيدين</a>
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
              <h1 className="text-2xl font-bold text-slate-800">مؤسساتي</h1>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#007799]">
              <Plus className="w-4 h-4"/> إضافة مؤسسة
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-4">إضافة مؤسسة جديدة</h3>
              <form onSubmit={handleAddInstitution} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input required type="text" placeholder="اسم المؤسسة" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-3 border rounded-lg" />
                <input type="text" placeholder="رقم السجل التجاري" value={formData.cr_number} onChange={(e) => setFormData({...formData, cr_number: e.target.value})} className="p-3 border rounded-lg" />
                <input type="text" placeholder="رقم الهاتف" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-3 border rounded-lg" />
                <button type="submit" className="bg-slate-900 text-white rounded-lg py-3 font-bold md:col-span-3">حفظ المؤسسة</button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutions.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 col-span-2">
                <Building2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                لا توجد لديك مؤسسات مسجلة حالياً. اضغط على "إضافة مؤسسة" للبدء.
              </div>
            ) : (
              institutions.map((inst) => (
                <div key={inst.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-[#0099cc]"><Building2 className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{inst.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">س.ت: {inst.cr_number || 'غير مسجل'}</p>
                    <p className="text-sm text-slate-500">الهاتف: {inst.phone || 'غير مسجل'}</p>
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
