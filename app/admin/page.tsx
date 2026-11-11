"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Users, Download, Plus, X, FileText, Settings, Upload } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTx, setNewTx] = useState({ client_id: "", title: "", expiry_date: "" });
  const [txFile, setTxFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data: reqData } = await supabase.from("requests").select(`*, profiles (email), services (title, price)`).order("created_at", { ascending: false });
      if (reqData) setRequests(reqData);

      const { data: clientsData } = await supabase.from("profiles").select("id, email").eq("role", "client");
      if (clientsData) setClients(clientsData);

      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from("requests").update({ status: newStatus }).eq("id", id);
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileUrl = "";

    if (txFile) {
      const fileExt = txFile.name.split('.').pop();
      const fileName = `final-${Math.random()}.${fileExt}`;
      const filePath = `${newTx.client_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("attachments").upload(filePath, txFile);
      if (uploadError) {
        alert("خطأ في رفع الملف: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("attachments").getPublicUrl(filePath);
      fileUrl = publicUrl;
    }

    const { error } = await supabase.from("transactions").insert([{ client_id: newTx.client_id, title: newTx.title, expiry_date: newTx.expiry_date, file_url: fileUrl, status: "سارية" }]);
    setUploading(false);

    if (error) alert("خطأ: " + error.message);
    else {
      alert("تمت إضافة المعاملة والمستند بنجاح!");
      setShowAddForm(false);
      setNewTx({ client_id: "", title: "", expiry_date: "" });
      setTxFile(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <Link href="/" className="h-20 flex items-center justify-center border-b border-slate-800 hover:bg-slate-800 transition">
          <img src="/images/logo.png" alt="Logo" className="h-14 w-auto object-contain mix-blend-screen" />
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/admin" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
          <a href="/admin/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> إدارة المعاملات</a>
          <a href="/admin/clients" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> إدارة العملاء</a>
          <a href="/admin/services" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Settings className="w-5 h-5"/> إدارة الخدمات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">لوحة تحكم المدير</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#007799]">
            {showAddForm ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} {showAddForm ? "إلغاء" : "إضافة معاملة"}
          </button>
        </header>

        <div className="p-4 md:p-8">
          {showAddForm && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h3 className="font-bold text-lg mb-4">إضافة معاملة لعميل</h3>
              <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select required value={newTx.client_id} onChange={(e) => setNewTx({...newTx, client_id: e.target.value})} className="p-3 border rounded-lg md:col-span-3">
                  <option value="">اختر العميل...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.email}</option>)}
                </select>
                <input required type="text" placeholder="اسم المعاملة (مثال: رخصة عمل)" value={newTx.title} onChange={(e) => setNewTx({...newTx, title: e.target.value})} className="p-3 border rounded-lg md:col-span-2" />
                <input required type="date" value={newTx.expiry_date} onChange={(e) => setNewTx({...newTx, expiry_date: e.target.value})} className="p-3 border rounded-lg" />
                
                <div className="md:col-span-3 border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer relative hover:bg-slate-50 transition">
                  <input type="file" onChange={(e) => setTxFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm text-slate-500">{txFile ? txFile.name : "ارفع المستند النهائي (اختياري)"}</p>
                </div>

                <button type="submit" disabled={uploading} className="bg-slate-900 text-white rounded-lg py-3 font-bold md:col-span-3 disabled:opacity-50">
                  {uploading ? "جاري الحفظ..." : "حفظ المعاملة"}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800">الطلبات الواردة</div>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
                <thead className="text-sm text-slate-500 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="p-4 font-medium">مقدم الطلب</th>
                    <th className="p-4 font-medium">الخدمة</th>
                    <th className="p-4 font-medium">مرفق العميل</th>
                    <th className="p-4 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-slate-800" dir="ltr">{req.profiles?.email}</div>
                        <div className="text-xs text-slate-500 mt-1">{req.client_name} - {req.client_phone}</div>
                      </td>
                      <td className="p-4 text-slate-600">{req.services?.title}</td>
                      <td className="p-4">
                        {req.file_url ? (
                          <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            <Download className="w-4 h-4"/> تحميل
                          </a>
                        ) : <span className="text-slate-400 text-xs">لا يوجد</span>}
                      </td>
                      <td className="p-4">
                        <select value={req.status} onChange={(e) => handleStatusChange(req.id, e.target.value)} className="bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg block w-full p-2">
                          <option value="جديد">جديد</option>
                          <option value="قيد المراجعة">قيد المراجعة</option>
                          <option value="قيد التنفيذ">قيد التنفيذ</option>
                          <option value="مكتمل">مكتمل</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
