"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Download, MessageCircle, Car, User, Phone } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminRequests() {
  const [reqs, setReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: requestsData } = await supabase.from("requests").select(`*, services(title)`).order("created_at", { ascending: false });
      if (requestsData) {
        const clientIds = [...new Set(requestsData.map(r => r.client_id))];
        const { data: profilesData } = await supabase.from("profiles").select("id, email, full_name, phone").in("id", clientIds);
        const merged = requestsData.map(req => ({ ...req, clientProfile: profilesData?.find(p => p.id === req.client_id) }));
        setReqs(merged);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const update = async (id: string, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setReqs(reqs.map(r => r.id === id ? { ...r, status } : r));
  };

  const sendWhatsApp = (phone: string, name: string, service: string) => {
    if (!phone) return alert("لا يوجد رقم جوال");
    let formatted = phone.replace(/\s+/g, '');
    if (formatted.startsWith('05')) formatted = '966' + formatted.substring(1);
    const message = `مرحباً ${name || 'عميلنا العزيز'}، نود تذكيركم بخصوص طلبكم (${service}). يرجى التواصل معنا. مساعدك الرقمي.`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="p-8 text-center text-slate-500">جاري تحميل الطلبات...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc] transition">
          <ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم
        </Link>
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">{reqs.length} طلب</span>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-bold text-slate-700">العميل</th>
              <th className="p-4 font-bold text-slate-700">الخدمة / التفاصيل</th>
              <th className="p-4 font-bold text-slate-700">المرفقات</th>
              <th className="p-4 font-bold text-slate-700">الحالة</th>
              <th className="p-4 font-bold text-slate-700">تواصل</th>
            </tr>
          </thead>
          <tbody>
            {reqs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">لا توجد طلبات حالياً.</td></tr>
            ) : reqs.map(r => (
              <tr key={r.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4">
                  <p className="font-bold text-slate-800" dir="ltr">{r.clientProfile?.email || 'غير معروف'}</p>
                  <div className="flex flex-col gap-1 mt-2 text-xs text-slate-500">
                    <p className="flex items-center gap-1"><User className="w-3 h-3"/> {r.client_name || 'غير مسجل'}</p>
                    <p className="flex items-center gap-1" dir="ltr"><Phone className="w-3 h-3"/> {r.client_phone || 'لا يوجد'}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-[#0099cc] block mb-1">{r.services?.title || 'خدمة'}</span>
                  {r.client_national_id && <span className="text-xs text-slate-500 block">هوية: {r.client_national_id}</span>}
                  
                  {/* عرض بيانات السيارات إذا وجدت */}
                  {r.dynamic_data && Object.keys(r.dynamic_data).length > 0 && (
                    <div className="mt-2 bg-orange-50 p-2 rounded-lg border border-orange-100 text-xs text-orange-800">
                      <p className="flex items-center gap-1 font-bold mb-1"><Car className="w-3 h-3"/> بيانات المركبة:</p>
                      {r.dynamic_data.plate_number && <p>اللوحة: {r.dynamic_data.plate_number}</p>}
                      {r.dynamic_data.car_make && <p>السيارة: {r.dynamic_data.car_make}</p>}
                      {r.dynamic_data.vin_number && <p>الهيكل: {r.dynamic_data.vin_number}</p>}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {r.file_url ? (
                    <a href={r.file_url} target="_blank" className="text-blue-600 flex items-center gap-1 font-bold hover:underline">
                      <Download className="w-4 h-4"/> تحميل
                    </a>
                  ) : <span className="text-slate-400 text-sm">لا يوجد</span>}
                </td>
                <td className="p-4">
                  <select value={r.status} onChange={e => update(r.id, e.target.value)} className="bg-slate-100 border border-slate-200 p-2 rounded-lg font-bold text-sm focus:outline-none focus:border-[#0099cc]">
                    <option value="جديد">جديد</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتمل">مكتمل</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => sendWhatsApp(r.client_phone || r.clientProfile?.phone, r.client_name || r.clientProfile?.full_name, r.services?.title)} className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#1EBE5D] transition shadow-sm" title="مراسلة واتساب">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
      }
