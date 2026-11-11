"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload, Building2, User } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RequestServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  
  const [selectedService, setSelectedService] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login?redirect=/request";
      setUser(user);
    };
    const getServices = async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true);
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
        client_id: user.id,
        service_id: selectedService,
        institution_id: selectedInstitution || null,
        beneficiary_id: selectedBeneficiary || null, // ربط العامل
        notes: notes,
        file_url: fileUrl,
        status: "جديد"
      }
    ]);
    
    setLoading(false);
    if (error) alert("حدث خطأ: " + error.message);
    else setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-white rounded-full shadow hover:bg-slate-100"><ArrowRight className="w-5 h-5 text-slate-600" /></Link>
          <h1 className="text-2xl font-bold text-slate-800">طلب خدمة جديدة</h1>
        </div>

        {success ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">تم إرسال طلبك بنجاح!</h2>
            <Link href="/portal" className="bg-[#0099cc] text-white px-6 py-2 rounded-lg font-bold mt-4 inline-block">العودة للبوابة</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اختر الخدمة المطلوبة</label>
              <select required value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] bg-white">
                <option value="">-- اختر من القائمة --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.title} {s.price ? `- ${s.price}` : ''}</option>)}
              </select>
            </div>

            {/* اختيار المؤسسة */}
            {institutions.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Building2 className="w-4 h-4"/> اختر المؤسسة (اختياري)</label>
                <select value={selectedInstitution} onChange={(e) => setSelectedInstitution(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] bg-white">
                  <option value="">طلب شخصي (بدون مؤسسة)</option>
                  {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                </select>
              </div>
            )}

            {/* اختيار العامل */}
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
