"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export default function ClientNotifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) supabase.from("notifications").select("*").eq("user_id", data.user.id).order("created_at", { ascending: false }).then(r => setNotifs(r.data || []));
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link href="/portal" className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#0099cc]"><ArrowRight className="w-5 h-5"/> رجوع للوحة التحكم</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {notifs.length === 0 ? <div className="p-8 text-center text-slate-400"><Bell className="w-12 h-12 mx-auto mb-2"/>لا توجد تنبيهات</div> : notifs.map(n => (
          <div key={n.id} className="p-4 border-b"><h4 className="font-bold">{n.title}</h4><p className="text-sm text-slate-500 mt-1">{n.message}</p></div>
        ))}
      </div>
    </div>
  );
                                                                                                                                                            }
