"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
        
      if (data) setTransactions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  const getStatusColor = (status: string) => {
    if (status === 'منتهية') return 'bg-red-100 text-red-700';
    if (status === 'قاربت على الانتهاء') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/portal" className="p-2 bg-white rounded-full shadow hover:bg-slate-100">
            <ArrowRight className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">معاملاتي</h1>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">سجل المعاملات</div>
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[700px]">
              <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                <tr>
                  <th className="p-4 font-medium">المعاملة</th>
                  <th className="p-4 font-medium">تاريخ الإصدار</th>
                  <th className="p-4 font-medium">تاريخ الانتهاء</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">المستند</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      لا توجد لديك أي معاملات مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800">{tx.title}</td>
                      <td className="p-4 text-slate-500">{tx.issue_date || '-'}</td>
                      <td className="p-4 text-slate-500">{tx.expiry_date || '-'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(tx.status)}`}>
                          {tx.status || 'سارية'}
                        </span>
                      </td>
                      <td className="p-4">
                         <span className="text-slate-400 text-xs">متاح قريباً</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
      }
