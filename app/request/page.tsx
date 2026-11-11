"use client";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload, User, Phone, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

function RequestForm() {
  const [services, setServices] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNationalId, setClientNationalId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const presetService = searchParams.get("service");

  useEffect(() => {
    if (presetService) setSelectedService(presetService);

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = "/login?redirect=/request";
      else {
        setUser(data.user);
        supabase.from("profiles").select("full_name, phone").eq("id", data.user.id).single().then(({ data: profile }) => {
          if (profile) {
            if (profile.full_name) setClientName(profile.full_name);
            if (profile.phone) setClientPhone(profile.phone);
          }
        });
        supabase.from("services").select("*").eq("is_active", true).then(r => setServices(r.data || []));
        supabase.from("institutions").select("*").eq("owner_id", data.user.id).then(r => setInstitutions(r.data || []));
      }
    });
  }, [presetService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    let fileUrl = "";
    if (file) {
      const path = `${user.id}/${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from("attachments").upload(path, file);
      if (!error) fileUrl = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
    }
    
    await supabase.from("requests").insert([{ 
      client_id: user.id, 
      service_id: selectedService, 
      institution_id: selectedInstitution || null, 
      client_name: clientName,
      client_phone: clientPhone,
      client_national_id: clientNationalId || null,
      notes, 
      file_url: fileUrl, 
      status: "جديد" 
    }]);
    setLoading(false); setSuccess(true);
  };

  if (success) return <div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div><h2 className="text-2xl font-bold text-slate-800 mb-2">تم إرسال الطلب!</h2><Link href="/portal" className="bg-[#0099cc] text-white px-8 py-3 rounded-xl font-bold">العودة للبوابة</Link></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
           <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع</Link>
           <img src="/images/logo.png" alt="Logo" className="h-12 mix-blend-multiply" />
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border space-y-6">
           <h2 className="text-2xl font-bold text-slate-800">طلب خدمة جديدة</h2>
           
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
             <h3 className="font-bold text-slate-700">بيانات مقدم الطلب</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">الاسم</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full pr-10 p-3 border rounded-lg" placeholder="الاسم الكامل" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full pr-10 p-3 border rounded-lg text-right" dir="rtl" placeholder="05XXXXXXXX" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-600 mb-1">رقم الهوية (مطلوب لبعض الخدمات)</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input type="text" value={clientNationalId} onChange={e => setClientNationalId(e.target.value)} className="w-full pr-10 p-3 border rounded-lg text-right" dir="rtl" placeholder="أدخل رقم الهوية إن وجد" />
                  </div>
                </div>
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-slate-600 mb-1">الخدمة المطلوبة</label>
             <select required value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50">
               <option value="">اختر الخدمة...</option>
               {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
             </select>
           </div>

           {institutions.length > 0 && (
             <div>
               <label className="block text-sm font-bold text-slate-600 mb-1">المؤسسة (اختياري)</label>
               <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} className="w-full p-4 border rounded-xl bg-slate-50">
                 <option value="">طلب شخصي (بدون مؤسسة)</option>
                 {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
               </select>
             </div>
           )}

           <div>
             <label className="block text-sm font-bold text-slate-600 mb-1">ملاحظات إضافية</label>
             <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="اكتب أي تفاصيل هنا..." rows={3} className="w-full p-4 border rounded-xl bg-slate-50"></textarea>
           </div>

           <div>
             <label className="block text-sm font-bold text-slate-600 mb-1">المرفقات</label>
             <div className="border-2 border-dashed p-6 text-center rounded-xl relative hover:bg-slate-50 transition cursor-pointer">
               <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
               <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
               <p className="text-slate-500">{file ? file.name : "اضغط لرفع الملفات"}</p>
             </div>
           </div>

           <button type="submit" disabled={loading} className="w-full bg-[#0099cc] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#007799] transition disabled:opacity-50">
             {loading ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"}
           </button>
        </form>
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={<div>...</div>}><RequestForm /></Suspense>; }
