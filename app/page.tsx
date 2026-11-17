"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { MessageCircle, Building2, Loader2, LayoutDashboard, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("is_active", true).then(({ data }) => { setServices(data || []); setLoading(false); });
    
    // التحقق مما إذا كان المتصفح هو المدير
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from("profiles").select("role").eq("id", data.user.id).single().then(({ data: p }) => {
          if (p?.role === 'admin') setIsAdmin(true);
        });
      }
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <nav className="fixed w-full top-0 z-50 bg-white border-b h-20 flex justify-between items-center px-8 shadow-sm">
        <Link href="/"><img src="/images/logo.png" alt="Logo" className="h-14 mix-blend-multiply" /></Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg">
              <LayoutDashboard className="w-5 h-5"/> لوحة الإدارة
            </Link>
          )}
          <Link href="/login" className="bg-[#0099cc] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#007799] shadow-md transition">تسجيل الدخول</Link>
        </div>
      </nav>

      <section className="mt-20 relative">
        <img src="/images/hero.jpg" alt="Hero" className="w-full max-h-[500px] object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">منصة مساعدك الرقمي</h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">بوابتك الشاملة للخدمات الإلكترونية والتعقيب</p>
          <div className="flex gap-4">
             <Link href="/login?redirect=/request" className="bg-[#0099cc] px-8 py-3 rounded-xl font-bold hover:bg-[#007799] shadow-lg transition transform hover:scale-105">طلب خدمة</Link>
             <Link href="/login" className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 shadow-lg transition transform hover:scale-105 flex items-center gap-2"><Building2 className="w-5 h-5"/> بوابة المؤسسات</Link>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-slate-800">خدماتنا الإلكترونية</h2>
        {loading ? <div className="flex justify-center"><Loader2 className="animate-spin text-[#0099cc] w-10 h-10" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl transition duration-300 flex flex-col group">
                {s.image_url && <img src={s.image_url} alt={s.title} className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition duration-300" />}
                <h3 className="text-lg font-bold mb-2 text-slate-800">{s.title}</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">{s.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <span className="text-[#0099cc] font-extrabold">{s.price || "حسب الطلب"}</span>
                  <Link href={`/login?redirect=/request?service=${s.id}`} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#007799] transition">طلب</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* فوتر الموقع مع إيميل المكتب التفاعلي */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t-4 border-[#0099cc]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <img src="/images/logo.png" className="h-16 mx-auto md:mx-0 mb-4 brightness-0 invert opacity-90" />
            <p className="text-sm text-slate-400">المنصة الرائدة للخدمات الإلكترونية في المملكة العربية السعودية.</p>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-[#0099cc] transition">الرئيسية</Link></li>
              <li><Link href="/login" className="hover:text-[#0099cc] transition">بوابة العملاء</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3"><MapPin className="w-5 h-5 text-[#0099cc]" /><span>السعودية - مكة المكرمة - القنفذة - المخيلف</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 text-[#0099cc]" />
                <a href="https://wa.me/966535717061" className="hover:text-[#0099cc] transition" dir="ltr">+966 53 571 7061</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-5 h-5 text-[#0099cc]" />
                {/* هنا الإيميل الذي يفتح تطبيق البريد */}
                <a href="mailto:museidkalraqmi@gmail.com" className="hover:text-[#0099cc] transition">museidkalraqmi@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © 2024 مساعدك الرقمي. جميع الحقوق محفوظة.
        </div>
      </footer>

      {/* زر الواتساب العائم */}
      <a href="https://wa.me/966535717061" target="_blank" className="fixed bottom-6 left-6 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition z-50 flex items-center justify-center">
        <MessageCircle className="w-8 h-8 text-white" />
      </a>
    </main>
  );
                         }
