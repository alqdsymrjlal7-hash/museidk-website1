"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function AdminStaff() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { supabase.from("profiles").select("*").then(r => setUsers(r.data || [])); }, []);

  const change = async (id: string, role: string) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <Link href="/admin" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right"><thead className="bg-slate-50 border-b"><tr><th className="p-4">الاسم</th><th className="p-4">الايميل</th><th className="p-4">الصلاحية</th></tr></thead><tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-4 font-bold">{u.full_name || 'غير مسجل'}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">
                <select value={u.role} onChange={e => change(u.id, e.target.value)} className="p-2 border rounded-lg bg-slate-50 font-bold">
                  <option value="client">عميل</option><option value="data_entry">إدخال</option><option value="follow_up">متابعة</option><option value="admin">مدير</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
      }
