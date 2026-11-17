"use client";
import { useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

function LoginForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/portal";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { data: { full_name: name, phone: phone } } });
    setLoading(false);
    if (error) alert("خطأ: " + error.message);
    else { setStep(2); alert("تم إرسال رمز التحقق إلى بريدك."); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setLoading(false);
    if (error) {
      alert("رمز التحقق غير صحيح أو منتهي الصلاحية. الرجاء المحاولة مرة أخرى أو طلب رمز جديد.");
    } else { 
      window.location.href = redirectUrl; 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <Link href="/" className="absolute top-6 right-6 flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc] transition"><ArrowRight className="w-5 h-5"/> العودة للرئيسية</Link>
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <img src="/images/logo.png" alt="Logo" className="h-20 mx-auto mix-blend-multiply mb-6" />
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">تسجيل الدخول</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل (للعملاء الجدد)" className="w-full p-4 border rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc] transition" />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الجوال (للعملاء الجدد)" className="w-full p-4 border rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc] transition text-right" dir="rtl" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full p-4 border rounded-xl bg-slate-50 focus:outline-none focus:border-[#0099cc] transition text-left" dir="ltr" required />
            <button type="submit" disabled={loading} className="w-full bg-[#0099cc] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#007799] shadow-lg transition">{loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">أدخل رمز التحقق</h2>
            <p className="text-center text-sm text-slate-500 mb-6">تم إرسال رمز إلى: {email}</p>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="أدخل الرمز المكون من 6 أرقام" className="w-full p-4 border rounded-xl text-center tracking-[1em] font-bold text-2xl bg-slate-50 focus:outline-none focus:border-[#0099cc] transition" required />
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 shadow-lg transition">{loading ? "جاري التحقق..." : "تأكيد الدخول"}</button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-slate-500 font-bold hover:text-[#0099cc] transition">تغيير البريد الإلكتروني</button>
          </form>
        )}
      </div>
    </div>
  );
}
export default function LoginPage() { return <Suspense fallback={<div>...</div>}><LoginForm /></Suspense>; }
