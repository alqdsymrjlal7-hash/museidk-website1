"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { MessageCircle, Building2, Loader2 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").eq("is_active", true).then(({ data }) => { setServices(data || []); setLoading(false); });
  }, []);

  return (
    <main className="min-h-screen flex flex-col" dir="rtl">
      <nav className="fixed w-full top-0 z-50 bg-white border-b h-20 flex justify-between items-center px-8 shadow-sm">
        <Link href="/"><img src="/images/logo.png" alt="Logo" className="h-14 mix-blend-multiply" /></Link>
        <Link href="/login" className="bg-[#0099cc] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#007799] shadow-md transition">تسجيل الدخول</Link>
      </nav>

      <section className="mt-20 relative">
        <img src="/images/hero.jpg" alt="Hero" className="w-full max-h-[500px] object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">منصة مساعدك الرقمي</h1>
          <p className="text-lg md:text-xl mb-8">بوابتك الشاملة للخدمات الإلكترونية والتعقيب</p>
          <div className="flex gap-4">
             <Link href="/login?redirect=/request" className="bg-[#0099cc] px-8 py-3 rounded-xl font-bold hover:bg-[#007799] shadow-lg transition">طلب خدمة</Link>
             <Link href="/login" className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 shadow-lg transition flex items-center gap-2"><Building2 className="w-5 h-5"/> بوابة المؤسسات</Link>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-extrabold text-center mb-10">خدماتنا الإلكترونية</h2>
        {loading ? <div className="flex justify-center"><Loader2 className="animate-spin text-[#0099cc] w-10 h-10" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-xl transition flex flex-col">
                {s.image_url && <img src={s.image_url} alt={s.title} className="w-full h-32 object-cover rounded-xl mb-4" />}
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">{s.description}</p>
                <div className="flex justify-between items-center pt-4 border-t mt-auto">
                  <span className="text-[#0099cc] font-extrabold">{s.price || "حسب الطلب"}</span>
                  <Link href={`/login?redirect=/request?service=${s.id}`} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#007799]">طلب</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <a href="https://wa.me/966535717061" target="_blank" className="fixed bottom-6 left-6 bg-[#25D366] p-4 rounded-full shadow-2xl z-50"><MessageCircle className="w-8 h-8 text-white" /></a>
    </main>
  );
                          }
