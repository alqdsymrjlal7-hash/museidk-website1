import { MessageCircle, Facebook, Instagram, MapPin, Phone, Building2, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const services = [
    { title: "تجديد الهوية الوطنية", price: "50 ر.س", desc: "إتمام إجراءات تجديد الهوية الوطنية بكل سهولة ويسر عبر منصتنا.", image: "/images/service-1.jpg" },
    { title: "فتح حسابات بنكية", price: "50 ر.س", desc: "خدمة فتح الحسابات في كافة البنوك السعودية بسرعة واحترافية عالية.", image: "/images/service-2.jpg" },
    { title: "إصدار وثيقة العمل الحر", price: "50 ر.س", desc: "استخراج وثيقة العمل الحر الخاصة بك بكل سهولة.", image: "/images/service-3.jpg" },
    { title: "فتح سجلات تجارية", price: "حسب الاشتراطات", desc: "فتح سجلات تجارية للجمعيات والمؤسسات حسب اشتراطات المركز الوطني ووزارة التجارة.", image: "/images/service-4.jpg" },
    { title: "حساب المواطن", price: "حسب الخدمة", desc: "تسجيل في حساب المواطن، تقديم اعتراض، ومتابعة الطلبات.", image: "/images/service-5.jpg" },
    { title: "تصميم موشن جرافكس", price: "1,200 ر.س", desc: "ابتكر فيديوهات تسويقية جذابة تزيد من تفاعل عملائك مع علامتك التجارية.", image: "/images/service-6.jpg" },
    { title: "تصميم شعارات احترافية", price: "450 ر.س", desc: "تصميم شعارات مبتكرة تعبر عن هوية علامتك التجارية.", image: "/images/service-7.jpg" },
    { title: "تصميم هوية بصرية", price: "1,200 ر.س", desc: "نتكفل بمساعدتكم في تحقيق رؤية علامتكم التجارية بالكامل.", image: "/images/service-8.jpg" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* 1. الشريط العلوي المحدث */}
      <nav className="fixed w-full top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          
          {/* الشعار - تمت إضافة mix-blend-multiply لإخفاء الخلفية البيضاء */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/images/logo.png" alt="شعار مساعدك الرقمي" className="h-14 md:h-16 w-auto object-contain mix-blend-multiply" />
            <div className="hidden sm:flex flex-col">
              <h1 className="font-bold text-lg text-[#0099cc] leading-tight">مساعدك</h1>
              <span className="text-xs text-slate-500 font-medium">الرقمي</span>
            </div>
          </div>
          
          {/* روابط الوسط */}
          <div className="hidden md:flex gap-8 font-medium">
            <a href="#" className="text-[#0099cc] font-bold">الرئيسية</a>
            <a href="#services" className="text-slate-600 hover:text-[#0099cc] transition">خدماتنا</a>
          </div>

          {/* أزرار الدخول واللغة */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-[#0099cc] px-2 py-1 rounded-md transition">
              <Globe className="w-4 h-4" /> EN
            </button>
            <Link href="/login" className="bg-[#0099cc] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold hover:bg-[#007799] transition shadow-md">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. البانر والأزرار الرئيسية */}
      <section className="w-full mt-20 flex-grow flex flex-col items-center bg-white overflow-hidden">
        
        {/* صورة البانر */}
        <img 
          src="/images/hero.jpg" 
          alt="مساعدك الرقمي للخدمات الإلكترونية" 
          className="w-full h-auto object-contain"
        />
        
        {/* أزرار الحركة (Call to Action) */}
        <div className="flex flex-col sm:flex-row gap-4 py-8 px-4 w-full max-w-4xl justify-center -mt-6 relative z-10">
           <Link href="/login?redirect=/request" className="flex-1 bg-[#0099cc] text-white text-center px-6 py-3.5 rounded-xl font-bold text-lg hover:bg-[#007799] transition shadow-lg flex items-center justify-center gap-2">
              طلب خدمة جديدة
           </Link>
           <Link href="/login?redirect=/portal/institutions" className="flex-1 bg-slate-900 text-white text-center px-6 py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2">
              <Building2 className="w-5 h-5" /> منصة أصحاب الأعمال
           </Link>
        </div>
      </section>

      {/* 3. قسم الخدمات */}
      <section id="services" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">خدماتنا الإلكترونية المميزة</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">اختر الخدمة التي تناسبك، ارفع مستنداتك، وتابع طلبك بكل شفافية.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-xl transition duration-300 group flex flex-col">
                <div className="w-full h-40 bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-500 text-xs mb-4 flex-grow">{service.desc}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                  <span className="text-[#0099cc] font-extrabold text-lg">{service.price}</span>
                  <Link href="/login?redirect=/request" className="bg-white text-[#0099cc] border border-[#0099cc] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#0099cc] hover:text-white transition">
                    طلب الخدمة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. التذييل */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">مساعدك الرقمي</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-[#0099cc] transition"><Facebook className="w-5 h-5 text-white" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-[#0099cc] transition"><Instagram className="w-5 h-5 text-white" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3"><MapPin className="w-5 h-5 text-[#0099cc]" /><span>السعودية - مكة المكرمة - القنفذة - المخيلف - دوقه - الشارع العام</span></li>
              <li className="flex items-center justify-center md:justify-start gap-3"><Phone className="w-5 h-5 text-[#0099cc]" /><a href="https://wa.me/966535717061" className="hover:text-[#0099cc] transition" dir="ltr">+966 53 571 7061</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* 5. زر الواتساب العائم */}
      <a href="https://wa.me/966535717061" target="_blank" className="fixed bottom-6 left-6 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#1EBE5D] hover:scale-110 transition z-50 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </main>
  );
}
