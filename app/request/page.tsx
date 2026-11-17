"use client";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload, User, Phone, CreditCard, Car, CheckCircle, AlertCircle } from "lucide-react";
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
  
  // حالة التنبيهات (Toast)
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const searchParams = useSearchParams();
  const presetService = searchParams.get("service");

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000); // يختفي تلقائياً بعد 4 ثوانٍ
  };

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

  const isVehicleService = (serviceTitle: string) => {
    return serviceTitle?.includes("سيارة") || serviceTitle?.includes("رخصة") || serviceTitle?.includes("استمارة") || serviceTitle?.includes("نقل ملكية") || serviceTitle?.includes("فحص") || serviceTitle?.includes("تأمين");
  };

  const handleDynamicChange = (key: string, value: string) => {
    setDynamicFields((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return showToast('error', 'الرجاء اختيار الخدمة المطلوبة أولاً');

    setLoading(true);
    let fileUrl = "";
    
    if (file) {
      const path = `${user.id}/${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from("attachments").upload(path, file);
      if (!error) fileUrl = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
    }
    
    const { error } = await supabase.from("requests").insert([{ 
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

    setLoading(false); 
    if (error) {
      showToast('error', "حدث خطأ: " + error.message);
    } else {
      setSuccess(true);
    }
  };

  const currentServiceTitle = services.find(s => s.id === selectedService)?.title || "";

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">تم إرسال الطلب بنجاح!</h2>
        <p className="text-slate-500 mb-8">سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.</p>
        <Link href="/portal" className="bg-[#0099cc] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#007799] transition w-full block">العودة للبوابة</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative" dir="rtl">
      
      {/* نظام التنبيهات العائم (Toast) */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
           <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc] transition"><ArrowRight className="w-5 h-5"/> رجوع</Link>
           <img src="/images/logo.png" alt="Logo" className="h-10 mix-blend-multiply" />
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 space-y-8">
           <div className="border-b border-slate-100 pb-4 text-center">
             <h2 className="text-2xl font-extrabold text-slate-800">طلب خدمة جديدة</h2>
             <p className="text-slate-500 text-sm mt-2">يرجى تعبئة البيانات بدقة لضمان إنجاز طلبك بسرعة</p>
           </div>
           
           {/* اختيار الخدمة */}
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-3">الخدمة المطلوبة <span className="text-red-500">*</span></label>
             <div className="relative">
               <select required value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full p-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc] focus:bg-white font-bold text-slate-800 transition-all appearance-none cursor-pointer">
                 <option value="" disabled>-- اختر الخدمة المطلوبة --</option>
                 {services.map(s => <option key={s.id} value={s.id} className="p-3">{s.title}</option>)}
               </select>
               <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
             </div>
           </div>

           {/* بيانات مقدم الطلب */}
           <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
             <h3 className="font-bold text-[#0099cc] text-sm flex items-center gap-2"><User className="w-4 h-4"/> بيانات مقدم الطلب</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">الاسم</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-4" />
                    <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full pr-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0099cc] transition" placeholder="الاسم الكامل" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-4" />
                    <input required type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full pr-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0099cc] transition" dir="rtl" placeholder="05XXXXXXXX" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهوية / الإقامة</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-4" />
                    <input type="text" value={clientNationalId} onChange={e => setClientNationalId(e.target.value)} className="w-full pr-10 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0099cc] transition" dir="rtl" placeholder="أدخل رقم الهوية" />
                  </div>
                </div>
             </div>
           </div>

           {/* بيانات السيارات (تظهر تلقائياً) */}
           {isVehicleService(currentServiceTitle) && (
             <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 space-y-4 animate-fadeIn">
               <h3 className="font-bold text-orange-600 text-sm flex items-center gap-2"><Car className="w-4 h-4"/> بيانات المركبة</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم اللوحة</label>
                    <input required type="text" onChange={e => handleDynamicChange('plate_number', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition" placeholder="أ ب ج 1234" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">نوع / صنع السيارة</label>
                    <input required type="text" onChange={e => handleDynamicChange('car_make', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition" placeholder="تويوتا كامري 2023" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهيكل (الشاسيه)</label>
                    <input type="text" onChange={e => handleDynamicChange('vin_number', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition" placeholder="إذا وجد" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الاستمارة السابقة</label>
                    <input type="text" onChange={e => handleDynamicChange('registration_number', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition" placeholder="إذا وجد" />
                  </div>
               </div>
             </div>
           )}

           {/* المؤسسات */}
           {institutions.length > 0 && (
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
               <label className="block text-sm font-bold text-slate-700 mb-2">طلب تابع لمؤسسة؟ (اختياري)</label>
               <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#0099cc] transition">
                 <option value="">طلب شخصي (بدون مؤسسة)</option>
                 {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
               </select>
             </div>
           )}

           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات إضافية</label>
             <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="اكتب أي تفاصيل أخرى هنا..." rows={3} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc] transition"></textarea>
           </div>

           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">المرفقات</label>
             <div className="border-2 border-dashed border-slate-300 p-6 text-center rounded-xl relative hover:bg-slate-50 transition cursor-pointer group">
               <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
               <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400 group-hover:text-[#0099cc] transition" />
               <p className="text-slate-500 text-sm font-bold">{file ? file.name : "اضغط لرفع الملفات (صورة الهوية أو الاستمارة)"}</p>
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
