"use client";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload, Building2, User, Phone, CreditCard } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

function RequestForm() {
  const [services, setServices] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  
  const [selectedService, setSelectedService] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientId, setClientId] = useState("");
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("service");
    if (serviceId) setSelectedService(serviceId);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login?redirect=/request";
      setUser(user);

      const { data: profile } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).single();
      if (profile) {
        if (profile.full_name) setClientName(profile.full_name);
        if (profile.phone) setClientPhone(profile.phone);
      }
    };
    const getServices = async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (data) setServices(data);
    };
    const getInstitutions = async () => {
      const { data } = await supabase.from("institutions").select("*").eq("owner_id", user?.id);
      if (data) setInstitutions(data);
    };
    const getBeneficiaries = async () => {
      const { data } = await supabase.from("beneficiaries").select("*");
      if (data) setBeneficiaries(data);
    };
    
    getUser();
    getServices();
    if (user) {
      getInstitutions();
      getBeneficiaries();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let fileUrl = "";

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("attachments").upload(filePath, file);
      if (uploadError) {
        alert("خطأ في رفع الملف: " + uploadError.message);
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("attachments").getPublicUrl(filePath);
      fileUrl = publicUrl;
    }

    const { error } = await supabase.from("requests").insert([
      {
        client_id: user.id, service_id: selectedService, institution_id: selectedInstitution || null,
        beneficiary_id: selectedBeneficiary || null, client_name: clientName, client_phone: clientPhone,
        client_national_id: clientId || null, notes: notes, file_url: fileUrl, status: "جديد"
      }
    ]);
    
    setLoading(false);
    if (error) alert("حدث خطأ: " + error.message);
    else setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/portal" className="p-2 bg-white rounded-full shadow hover:bg-slate-100"><ArrowRight className="w-5 h-5 text-slate-600" /></Link>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">طلب خدمة جديدة</h1>
          </div>
          <Link href="/"><img src="/images/logo.png" alt="Logo" className="h-12 md:h-14 w-auto mix-blend-multiply" /></Link>
        </div>

        {success ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">تم إرسال طلبك بنجاح!</h2>
            <Link href="/portal" className="bg-[#0099cc] text-white px-6 py-2 rounded-lg font-bold mt-4 inline-block">العودة للبوابة</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 mb-6">
              <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">بيانات مقدم الطلب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input required type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc]" placeholder="الاسم الكامل" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input required type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc]" dir="ltr" placeholder="05XXXXXXXX" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">رقم الهوية (اختياري)</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full pr-10 pl-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc]" dir="ltr" placeholder="أدخل رقم الهوية إن وجد" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اختر الخدمة المطلوبة</label>
              <select required value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] bg-white">
                <option value="">-- اختر من القائمة --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.title} {s.price ? `- ${s.price}` : ''}</option>)}
              </select>
            </div>

            {institutions.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Building2 className="w-4 h-4"/> اختر المؤسسة (اختياري)</label>
                <select value={selectedInstitution} onChange={(e) => setSelectedInstitution(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] bg-white">
                  <option value="">طلب شخصي (بدون مؤسسة)</option>
                  {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                </select>
              </div>
            )}

            {beneficiaries.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><User className="w-4 h-4"/> المستفيد من الخدمة (اختياري)</label>
                <select value={selectedBeneficiary} onChange={(e) => setSelectedBeneficiary(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] bg-white">
                  <option value="">لنفسي / للمؤسسة</option>
                  {beneficiaries.map(ben => <option key={ben.id} value={ben.id}>{ben.name} - {ben.national_id}</option>)}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات إضافية</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc]"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">رفع المستندات</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">{file ? file.name : "اضغط لاختيار ملف"}</p>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-[#0099cc] text-white font-bold py-3 rounded-lg hover:bg-[#007799] transition disabled:opacity-50">
              {loading ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RequestServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <RequestForm />
    </Suspense>
  );
    }
