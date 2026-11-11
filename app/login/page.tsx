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
    else { setStep(2); alert("تم إرسال رمز التحقق."); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setLoading(false);
    if (error) alert("رمز غير صحيح.");
    else { window.location.href = redirectUrl; }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <Link href="/" className="absolute top-6 right-6 flex items-center gap-2 text-slate-500 font-bold"><ArrowRight className="w-5 h-5"/> العودة للرئيسية</Link>
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border">
        <img src="/images/logo.png" alt="Logo" className="h-20 mx-auto mix-blend-multiply mb-6" />
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">تسجيل الدخول / إنشاء حساب</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل" className="w-full p-3 border rounded-xl bg-slate-50" required />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الجوال (05...)" className="w-full p-3 border rounded-xl bg-slate-50 text-right" dir="rtl" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full p-3 border rounded-xl bg-slate-50 text-left" dir="ltr" required />
            <button type="submit" disabled={loading} className="w-full bg-[#0099cc] text-white py-3 rounded-xl font-bold">{loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">أدخل رمز التحقق</h2>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="w-full p-3 border rounded-xl text-center tracking-[1em] font-bold text-2xl" required />
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">{loading ? "جاري التحقق..." : "دخول"}</button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-slate-500 font-bold">تغيير البيانات</button>
          </form>
        )}
      </div>
    </div>
  );
}
export default function LoginPage() { return <Suspense fallback={<div>...</div>}><LoginForm /></Suspense>; }
