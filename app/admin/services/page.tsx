"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Users, FileText, Settings, Plus, Trash2, Upload } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminServicesPage() {
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // نموذج إضافة خدمة جديدة
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ title: "", description: "", price: "", requires_renewal: false });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = "/login";
      setUser(user);

      const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = "";

    // رفع الصورة إن وجدت
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `service-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("attachments").upload(fileName, imageFile);
      
      if (uploadError) {
        alert("خطأ في رفع الصورة: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("attachments").getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    // إضافة الخدمة لقاعدة البيانات
    const { data, error } = await supabase.from("services").insert([
      {
        title: newService.title,
        description: newService.description,
        price: newService.price,
        requires_renewal: newService.requires_renewal,
        image_url: imageUrl
      }
    ]).select();

    setUploading(false);

    if (error) alert("خطأ: " + error.message);
    else {
      alert("تمت إضافة الخدمة بنجاح!");
      if (data) setServices([data[0], ...services]);
      setShowAddForm(false);
      setNewService({ title: "", description: "", price: "", requires_renewal: false });
      setImageFile(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) alert("خطأ في الحذف: " + error.message);
    else setServices(services.filter(s => s.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800"><h1 className="text-white font-bold text-xl">لوحة الإدارة</h1></div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <a href="/admin" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><LayoutDashboard className="w-5 h-5"/> نظرة عامة</a>
          <a href="/admin/transactions" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><FileText className="w-5 h-5"/> إدارة المعاملات</a>
          <a href="/admin/clients" className="flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg transition"><Users className="w-5 h-5"/> إدارة العملاء</a>
          <a href="/admin/services" className="flex items-center gap-3 bg-[#0099cc] text-white px-4 py-3 rounded-lg"><Settings className="w-5 h-5"/> إدارة الخدمات</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition w-full"><LogOut className="w-5 h-5" /> تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">إدارة الخدمات</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#0099cc] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#007799]">
            <Plus className="w-4 h-4"/> إضافة خدمة
          </button>
        </header>

        <div className="p-4 md:p-8">
          {showAddForm && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h3 className="font-bold text-lg mb-4">إضافة خدمة جديدة</h3>
              <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="اسم الخدمة (إجباري)" value={newService.title} onChange={(e) => setNewService({...newService, title: e.target.value})} className="p-3 border rounded-lg" />
                <input type="text" placeholder="السعر (اختياري، مثال: 50 ر.س)" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} className="p-3 border rounded-lg" />
                <textarea placeholder="وصف الخدمة (اختياري)" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="p-3 border rounded-lg md:col-span-2"></textarea>
                
                {/* رفع الصورة */}
                <div className="md:col-span-2 border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm text-slate-500">{imageFile ? imageFile.name : "اختر صورة للخدمة (اختياري)"}</p>
                </div>

                <label className="flex items-center gap-2 md:col-span-2">
                  <input type="checkbox" checked={newService.requires_renewal} onChange={(e) => setNewService({...newService, requires_renewal: e.target.checked})} className="w-5 h-5" />
                  <span>هذه الخدمة تتطلب تجديد (لها تاريخ انتهاء)</span>
                </label>
                <button type="submit" disabled={uploading} className="bg-slate-900 text-white rounded-lg py-3 font-bold md:col-span-2 disabled:opacity-50">
                  {uploading ? "جاري الحفظ..." : "حفظ الخدمة"}
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
                {service.image_url && (
                  <img src={service.image_url} alt={service.title} className="w-full h-32 object-cover" />
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{service.title}</h3>
                    {service.price && <span className="text-[#0099cc] font-extrabold whitespace-nowrap">{service.price}</span>}
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description || 'لا يوجد وصف'}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{service.requires_renewal ? "تتطلب تجديد" : "بدون تجديد"}</span>
                    <button onClick={() => handleDeleteService(service.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="حذف"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
        }
