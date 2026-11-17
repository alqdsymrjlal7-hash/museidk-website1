"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, Award, Crown, Shield, Building2 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientPlans() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("plans").select("*").eq("is_active", true).order("price", { ascending: true }).then(r => setPlans(r.data || []));
  }, []);

  const getPlanStyle = (name: string) => {
    if (name.includes("برونز")) return { icon: Award, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" };
    if (name.includes("ذهب")) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-400", popular: true };
    if (name.includes("بلاتين")) return { icon: Shield, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-300" };
    if (name.includes("مؤسس")) return { icon: Building2, color: "text-slate-800", bg: "bg-slate-100", border: "border-slate-800" };
    return { icon: CheckCircle, color: "text-[#0099cc]", bg: "bg-blue-50", border: "border-[#0099cc]" };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">باقات الاشتراك</h1>
          <p className="text-slate-600 text-lg">اختر الباقة التي تناسب حجم أعمالك</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(p => {
            const style = getPlanStyle(p.name);
            const Icon = style.icon;
            
            return (
              <div key={p.id} className={`bg-white p-8 rounded-3xl shadow-lg border-2 flex flex-col relative transition hover:-translate-y-2 ${style.border} ${style.popular ? 'scale-105 z-10' : ''}`}>
                {style.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-extrabold shadow-sm">الأكثر طلباً</span>
                )}
                
                <div className={`w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center mb-6 mx-auto`}>
                  <Icon className={`w-8 h-8 ${style.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">{p.name}</h3>
                <p className="text-4xl font-extrabold text-slate-900 mb-6 text-center">{p.price} <span className="text-sm font-normal text-slate-500">ريال / شهرياً</span></p>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className={`w-5 h-5 ${style.color}`}/> الطلبات: {p.features?.requests === "unlimited" ? "غير محدود" : p.features?.requests || 0}</li>
                  <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className={`w-5 h-5 ${style.color}`}/> المؤسسات: {p.features?.institutions === "unlimited" ? "غير محدود" : p.features?.institutions || 0}</li>
                  <li className="flex items-center gap-3 text-slate-600 text-sm"><CheckCircle className={`w-5 h-5 ${style.color}`}/> العمال: {p.features?.workers === "unlimited" ? "غير محدود" : p.features?.workers || 0}</li>
                </ul>
                
                <Link href={`/login?redirect=/subscribe?plan=${p.id}`} className={`w-full text-center py-3 rounded-xl font-bold transition ${style.popular ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  اشترك الآن
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
      }
