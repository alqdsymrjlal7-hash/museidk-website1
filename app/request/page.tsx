"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Upload } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RequestServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [notes, setNotes] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // جلب بيانات المستخدم
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
      setUser(user);
    };
    // جلب الخدمات من قاعدة البيانات
    const getServices = async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true);
      if (data) setServices(data);
    };
    getUser();
    getServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // إرسال الطلب إلى قاعدة البيانات
    const { error } = await supabase.from("requests").insert([
      {
        client_id: user.id,
        service_id: selectedService,
        notes: notes,
        status: "جديد"
      }
    ]);

    setLoading(false);
    if (error) {
      alert("حدث خطأ: " + error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-white rounded-full shadow hover:bg-slate-100">
            <ArrowRight className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">طلب خدمة جديدة</h1>
        </div>

        {success ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">تم إرسال طلبك بنجاح!</h2>
            <p className="text-slate-500 mb-6">سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.</p>
            <Link href="/portal" className="bg-[#0099cc] text-white px-6 py-2 rounded-lg font-bold">العودة للبوابة</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اختر الخدمة المطلوبة</label>
              <select 
                required
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] bg-white"
              >
                <option value="">-- اختر من القائمة --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.title} - {s.price}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات إضافية (اختياري)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc]"
                placeholder="اكتب أي تفاصيل تود إضافتها هنا..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">المرفقات (اختياري)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">اضغط لرفع الملفات (قريباً)</p>
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
