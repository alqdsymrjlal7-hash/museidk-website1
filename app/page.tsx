import { MessageCircle, Facebook, Instagram, MapPin, Phone } from "lucide-react";
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
      
      <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/images/logo.png" alt="شعار مساعدك الرقمي" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="font-bold text-lg text-[#0099cc] leading-none hidden sm:block">مساعدك</h1>
              <span className="text-xs text-slate-500 hidden sm:block">الرقمي</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 font-medium">
            <a href="#" className="text-[#0099cc] font-bold">الرئيسية</a>
            <a href="#services" className="text-slate-600 hover:text-[#0099cc] transition">خدماتنا</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-slate-500 hover:text-[#0099cc]">EN</button>
            <Link href="/login" className="bg-[#0099cc] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#007799] transition shadow-lg shadow-blue-200">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </nav>

      <section className="w-full mt-20 flex-grow flex items-center justify-center bg-white overflow-hidden">
        <img 
          src="/images/hero.jpg" 
          alt="مساعدك الرقمي للخدمات الإلكترونية" 
          className="w-full h-auto object-contain"
        />
      </section>

      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
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
                  {/* زر طلب الخدمة يوجه لتسجيل الدخول أولاً ثم لصفحة الطلب */}
                  <Link href="/login?redirect=/request" className="bg-white text-[#0099cc] border border-[#0099cc] px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-[#0099cc] hover:text-white transition">
                    طلب الخدمة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <a href="https://wa.me/966535717061" target="_blank" className="fixed bottom-6 left-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50"><MessageCircle className="w-8 h-8" /></a>
    </main>
  );
    }
