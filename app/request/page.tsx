"use client";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload, User, Phone, CreditCard, Car } from "lucide-react";
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
  
  // بيانات مقدم الطلب
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNationalId, setClientNationalId] = useState("");
  
  // بيانات ديناميكية (للسيارات)
  const [dynamicFields, setDynamicFields] = useState<any>({});
  
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

  // تحديد ما إذا كانت الخدمة تخص السيارات
  const isVehicleService = (serviceTitle: string) => {
    return serviceTitle?.includes("سيارة") || serviceTitle?.includes("رخصة") || serviceTitle?.includes("استمارة") || serviceTitle?.includes("نقل ملكية") || serviceTitle?.includes("فحص") || serviceTitle?.includes("تأمين");
  };

  const handleDynamicChange = (key: string, value: string) => {
    setDynamicFields((prev: any) => ({ ...prev, [key]: value }));
  };

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
      dynamic_data: dynamicFields,
      status: "جديد" 
    }]);
    setLoading(false); setSuccess(true);
  };

  const currentServiceTitle = services.find(s => s.id === selectedService)?.title || "";

  if (success) return <div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full"><div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div><h2 className="text-2xl font-bold text-slate-800 mb-2">تم إرسال الطلب!</h2><p className="text-slate-500 mb-6">سيقوم فريقنا بمراجعة طلبك قريباً.</p><Link href="/portal" className="bg-[#0099cc] text-white px-8 py-3 rounded-xl font-bold">العودة للبوابة</Link></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
           <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع</Link>
           <img src="/images/logo.png" alt="Logo" className="h-12 mix-blend-multiply" />
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border space-y-6">
           <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">طلب خدمة جديدة</h2>
           
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">الخدمة المطلوبة</label>
             <select required value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc] font-bold">
               <option value="">-- اختر الخدمة --</option>
               {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
             </select>
           </div>

           <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
             <h3 className="font-bold text-[#0099cc] text-sm">بيانات مقدم الطلب</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">الاسم</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full pr-10 p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0099cc]" placeholder="الاسم الكامل" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full pr-10 p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0099cc]" dir="rtl" placeholder="05XXXXXXXX" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهوية / الإقامة</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input type="text" value={clientNationalId} onChange={e => setClientNationalId(e.target.value)} className="w-full pr-10 p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0099cc]" dir="rtl" placeholder="أدخل رقم الهوية" />
                  </div>
                </div>
             </div>
           </div>

           {isVehicleService(currentServiceTitle) && (
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-4">
               <h3 className="font-bold text-orange-600 text-sm flex items-center gap-2"><Car className="w-5 h-5"/> بيانات المركبة</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم اللوحة</label>
                    <input required type="text" onChange={e => handleDynamicChange('plate_number', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500" placeholder="أ ب ج 1234" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">نوع / صنع السيارة</label>
                    <input required type="text" onChange={e => handleDynamicChange('car_make', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500" placeholder="تويوتا كامري 2023" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهيكل (الشاسيه)</label>
                    <input type="text" onChange={e => handleDynamicChange('vin_number', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500" placeholder="إذا وجد" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الاستمارة السابقة</label>
                    <input type="text" onChange={e => handleDynamicChange('registration_number', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500" placeholder="إذا وجد" />
                  </div>
               </div>
             </div>
           )}

           {institutions.length > 0 && (
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <label className="block text-sm font-bold text-slate-700 mb-2">طلب تابع لمؤسسة؟ (اختياري)</label>
               <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0099cc]">
                 <option value="">طلب شخصي (بدون مؤسسة)</option>
                 {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
               </select>
             </div>
           )}

           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات إضافية</label>
             <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="اكتب أي تفاصيل أخرى هنا..." rows={3} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc]"></textarea>
           </div>

           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">المرفقات (صورة الاستمارة أو الهوية)</label>
             <div className="border-2 border-dashed border-slate-300 p-6 text-center rounded-xl relative hover:bg-slate-50 transition cursor-pointer">
               <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
               <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
               <p className="text-slate-500 text-sm">{file ? file.name : "اضغط لرفع الملف"}</p>
             </div>
           </div>

           <button type="submit" disabled={loading} className="w-full bg-[#0099cc] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#007799] transition shadow-lg disabled:opacity-50">
             {loading ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"}
           </button>
        </form>
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={<div>...</div>}><RequestForm /></Suspense>; }
