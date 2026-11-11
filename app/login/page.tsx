"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

function LoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/portal");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) setRedirectUrl(redirect);
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) alert("خطأ: " + error.message);
    else {
      setStep(2);
      alert("تم إرسال رمز التحقق إلى بريدك الإلكتروني.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setLoading(false);
    if (error) alert("رمز غير صحيح: " + error.message);
    else {
      alert("تم تسجيل الدخول بنجاح!");
      window.location.href = redirectUrl;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="hover:opacity-80 transition">
            <img src="/images/logo.png" alt="Logo" className="h-20 w-auto object-contain mix-blend-multiply mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[#0099cc]">مساعدك الرقمي</h1>
          <p className="text-slate-500 text-sm mt-2">
            {step === 1 ? "أدخل بريدك الإلكتروني لاستلام رمز التحقق" : "أدخل رمز التحقق المرسل إلى بريدك"}
          </p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] text-left" dir="ltr" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#0099cc] text-white font-bold py-3 rounded-lg hover:bg-[#007799] transition disabled:opacity-50">
              {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">رمز التحقق (OTP)</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="أدخل الرمز هنا" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0099cc] text-center text-xl tracking-widest" dir="ltr" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50">
              {loading ? "جاري التحقق..." : "تأكيد الدخول"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}
