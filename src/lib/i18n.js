import { useState, useCallback, useEffect } from 'react';

const translations = {
  // Navigation
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.about": { en: "About", ar: "عن النادي" },
  "nav.programs": { en: "Programs", ar: "البرامج" },
  "nav.health": { en: "Health Programs", ar: "البرامج الصحية" },
  "nav.trainers": { en: "Trainers", ar: "المدربون" },
  "nav.plans": { en: "Plans", ar: "الخطط" },
  "nav.gallery": { en: "Gallery", ar: "المعرض" },
  "nav.testimonials": { en: "شهادات", ar: "الشهادات" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا" },
  "nav.join": { en: "Join Now", ar: "انضم الآن" },
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.admin": { en: "Admin", ar: "الإدارة" },
  "nav.profile": { en: "Profile", ar: "الملف الشخصي" },
  "nav.logout": { en: "Logout", ar: "تسجيل الخروج" },
  "nav.login": { en: "Login", ar: "تسجيل الدخول" },

  // Hero
  "hero.title": { en: "UNLEASH YOUR", ar: "أطلق العنان" },
  "hero.title2": { en: "INNER BEAST", ar: "لقوتك الداخلية" },
  "hero.subtitle": { en: "Premium fitness experience for Ladies & Gents in Ajman. Transform your body. Elevate your life.", ar: "تجربة لياقة بدنية متميزة للسيدات والرجال في عجمان. حوّل جسمك. ارتقِ بحياتك." },
  "hero.cta1": { en: "Join Now", ar: "انضم الآن" },
  "hero.cta2": { en: "Book Free Trial", ar: "احجز تجربة مجانية" },
  "hero.whatsapp": { en: "WhatsApp Us", ar: "تواصل واتساب" },

  // Why Choose Us
  "why.title": { en: "WHY CHOOSE", ar: "لماذا تختار" },
  "why.title2": { en: "LEO GYM", ar: "نادي ليو" },
  "why.subtitle": { en: "Ajman's premium fitness destination with world-class facilities", ar: "وجهة اللياقة البدنية المتميزة في عجمان بمرافق عالمية المستوى" },
  "why.female_trainer": { en: "Female Trainer", ar: "مدربة نسائية" },
  "why.shower": { en: "Shower Facilities", ar: "مرافق الاستحمام" },
  "why.cardio": { en: "Cardio Zone", ar: "منطقة الكارديو" },
  "why.nutrition": { en: "Nutrition Support", ar: "دعم التغذية" },
  "why.changing": { en: "Changing Rooms", ar: "غرف التبديل" },
  "why.studio": { en: "Full Gym & Studio", ar: "صالة رياضية كاملة" },
  "why.certified": { en: "Certified Trainers", ar: "مدربون معتمدون" },

  // Sections
  "section.programs": { en: "TRAINING PROGRAMS", ar: "برامج التدريب" },
  "section.programs_sub": { en: "Expert-led programs designed to transform", ar: "برامج بقيادة خبراء مصممة للتحويل" },
  "section.health": { en: "HEALTH PROGRAMS", ar: "البرامج الصحية" },
  "section.health_sub": { en: "Specialized health-focused fitness solutions", ar: "حلول لياقة بدنية متخصصة تركز على الصحة" },
  "section.trainers": { en: "ELITE TRAINERS", ar: "مدربون نخبة" },
  "section.trainers_sub": { en: "Meet our certified fitness professionals", ar: "تعرف على محترفي اللياقة البدنية المعتمدين" },
  "section.plans": { en: "MEMBERSHIP PLANS", ar: "خطط العضوية" },
  "section.plans_sub": { en: "Choose the plan that fits your goals", ar: "اختر الخطة التي تناسب أهدافك" },
  "section.gallery": { en: "OUR FACILITIES", ar: "مرافقنا" },
  "section.gallery_sub": { en: "Take a look inside LEO Gym", ar: "ألقِ نظرة داخل نادي ليو" },
  "section.testimonials": { en: "WHAT MEMBERS SAY", ar: "ماذا يقول الأعضاء" },
  "section.testimonials_sub": { en: "Real results from real members", ar: "نتائج حقيقية من أعضاء حقيقيين" },
  "section.ladies_gents": { en: "FOR EVERYONE", ar: "للجميع" },
  "section.ladies_gents_sub": { en: "Dedicated sections for Ladies & Gents", ar: "أقسام مخصصة للسيدات والرجال" },
  "section.contact": { en: "GET IN TOUCH", ar: "تواصل معنا" },
  "section.contact_sub": { en: "We'd love to hear from you", ar: "يسعدنا التواصل معك" },

  // CTA
  "cta.join": { en: "Join Now", ar: "انضم الآن" },
  "cta.trial": { en: "Book Free Trial", ar: "احجز تجربة مجانية" },
  "cta.whatsapp": { en: "WhatsApp Us", ar: "تواصل واتساب" },
  "cta.view_plans": { en: "View Plans", ar: "عرض الخطط" },
  "cta.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "cta.learn_more": { en: "Learn More", ar: "اعرف المزيد" },
  "cta.call": { en: "Call Us", ar: "اتصل بنا" },
  "cta.location": { en: "Visit Us", ar: "زورونا" },
  "cta.send": { en: "Send Message", ar: "إرسال رسالة" },
  "cta.book_class": { en: "Book Class", ar: "احجز حصة" },

  // Contact
  "contact.name": { en: "Full Name", ar: "الاسم الكامل" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.phone": { en: "Phone", ar: "الهاتف" },
  "contact.message": { en: "Message", ar: "الرسالة" },
  "contact.address": { en: "Shop #16, City Tower, Al Nuaimiya 3, Opp. Grand Mall, Ajman", ar: "المحل 16، سيتي تاور، النعيمية 3، مقابل جراند مول، عجمان" },
  "contact.hours": { en: "Open Daily: 6AM - 11PM", ar: "مفتوح يومياً: 6 صباحاً - 11 مساءً" },

  // Plans
  "plans.month": { en: "month", ar: "شهر" },
  "plans.months": { en: "months", ar: "أشهر" },
  "plans.aed": { en: "AED", ar: "د.إ" },
  "plans.popular": { en: "Most Popular", ar: "الأكثر شعبية" },
  "plans.select": { en: "Select Plan", ar: "اختر الخطة" },

  // Footer
  "footer.rights": { en: "All rights reserved", ar: "جميع الحقوق محفوظة" },
  "footer.tagline": { en: "Premium Fitness in Ajman", ar: "لياقة بدنية متميزة في عجمان" },

  // Member Dashboard
  "member.dashboard": { en: "Member Dashboard", ar: "لوحة تحكم العضو" },
  "member.status": { en: "Membership Status", ar: "حالة العضوية" },
  "member.plan": { en: "Current Plan", ar: "الخطة الحالية" },
  "member.schedule": { en: "Class Schedule", ar: "جدول الحصص" },
  "member.bookings": { en: "My Bookings", ar: "حجوزاتي" },
  "member.announcements": { en: "Announcements", ar: "الإعلانات" },
  "member.profile": { en: "My Profile", ar: "ملفي الشخصي" },
  "member.support": { en: "Support", ar: "الدعم" },
  "member.no_membership": { en: "No active membership", ar: "لا توجد عضوية نشطة" },
  "member.upgrade": { en: "Request Upgrade", ar: "طلب ترقية" },

  // Admin
  "admin.dashboard": { en: "Admin Dashboard", ar: "لوحة تحكم المدير" },
  "admin.users": { en: "Users", ar: "المستخدمون" },
  "admin.members": { en: "Members", ar: "الأعضاء" },
  "admin.trainers": { en: "Trainers", ar: "المدربون" },
  "admin.programs": { en: "Programs", ar: "البرامج" },
  "admin.health_programs": { en: "Health Programs", ar: "البرامج الصحية" },
  "admin.plans": { en: "Plans", ar: "الخطط" },
  "admin.schedules": { en: "Schedules", ar: "الجداول" },
  "admin.gallery": { en: "Gallery", ar: "المعرض" },
  "admin.homepage_media": { en: "Homepage Images", ar: "صور الصفحة الرئيسية" },
  "admin.testimonials": { en: "Testimonials", ar: "الشهادات" },
  "admin.inquiries": { en: "Inquiries", ar: "الاستفسارات" },
  "admin.announcements": { en: "Announcements", ar: "الإعلانات" },
  "admin.settings": { en: "Settings", ar: "الإعدادات" },
  "admin.total_members": { en: "Total Members", ar: "إجمالي الأعضاء" },
  "admin.active_memberships": { en: "Active Memberships", ar: "العضويات النشطة" },
  "admin.new_inquiries": { en: "New Inquiries", ar: "استفسارات جديدة" },
  "admin.revenue": { en: "Revenue", ar: "الإيرادات" },
  "admin.recent_inquiries": { en: "Recent Inquiries", ar: "أحدث الاستفسارات" },
  "admin.recent_signups": { en: "Recent Signups", ar: "أحدث التسجيلات" },

  // Common
  "common.loading": { en: "Loading...", ar: "جار التحميل..." },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.delete": { en: "Delete", ar: "حذف" },
  "common.edit": { en: "Edit", ar: "تعديل" },
  "common.create": { en: "Create", ar: "إنشاء" },
  "common.search": { en: "Search...", ar: "بحث..." },
  "common.filter": { en: "Filter", ar: "تصفية" },
  "common.all": { en: "All", ar: "الكل" },
  "common.active": { en: "Active", ar: "نشط" },
  "common.inactive": { en: "Inactive", ar: "غير نشط" },
  "common.status": { en: "Status", ar: "الحالة" },
  "common.actions": { en: "Actions", ar: "الإجراءات" },
  "common.name": { en: "Name", ar: "الاسم" },
  "common.email": { en: "Email", ar: "البريد" },
  "common.phone": { en: "Phone", ar: "الهاتف" },
  "common.no_data": { en: "No data available", ar: "لا توجد بيانات" },
  "common.confirm_delete": { en: "Are you sure you want to delete this?", ar: "هل أنت متأكد من الحذف؟" },
  "common.yes": { en: "Yes", ar: "نعم" },
  "common.no": { en: "No", ar: "لا" },
  "common.back": { en: "Back", ar: "رجوع" },

  // About
  "about.title": { en: "ABOUT LEO GYM", ar: "عن نادي ليو" },
  "about.subtitle": { en: "Ajman's Premier Fitness Destination", ar: "وجهة اللياقة البدنية الأولى في عجمان" },
  "about.desc1": { en: "LEO Body Building Gym is Ajman's premium fitness destination, offering world-class training facilities for both ladies and gentlemen. Our state-of-the-art equipment, certified trainers, and motivating atmosphere create the perfect environment for achieving your fitness goals.", ar: "نادي ليو لبناء الأجسام هو وجهة اللياقة البدنية المتميزة في عجمان، حيث يقدم مرافق تدريب عالمية المستوى لكل من السيدات والرجال. معداتنا الحديثة ومدربونا المعتمدون وأجواؤنا المحفزة تخلق البيئة المثالية لتحقيق أهدافك في اللياقة البدنية." },
  "about.desc2": { en: "With dedicated sections for both men and women, specialized health programs, and a passionate community of fitness enthusiasts, LEO Gym is more than just a gym — it's where transformations happen.", ar: "مع أقسام مخصصة لكل من الرجال والنساء، وبرامج صحية متخصصة، ومجتمع شغوف من محبي اللياقة البدنية، نادي ليو هو أكثر من مجرد صالة رياضية — إنه المكان الذي تحدث فيه التحولات." },
};

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('leo_lang') || 'en';
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    localStorage.setItem('leo_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  }, [lang]);

  const isRTL = lang === 'ar';

  const localizedField = useCallback((item, field) => {
    if (!item) return '';
    const arField = `${field}_ar`;
    const enField = `${field}_en`;
    if (lang === 'ar' && item[arField]) return item[arField];
    return item[enField] || item[arField] || '';
  }, [lang]);

  return { lang, setLang, t, isRTL, localizedField };
}

export const WHATSAPP_NUMBER = "971564360234";
export const PHONE_NUMBER = "+971 56 436 0234";
export const GYM_EMAIL = "leobodybuildinggym@gmail.com";
export const GYM_ADDRESS_EN = "Shop #16, City Tower, Al Nuaimiya 3, Opp. Grand Mall, Ajman";
export const GYM_ADDRESS_AR = "المحل 16، سيتي تاور، النعيمية 3، مقابل جراند مول، عجمان";
export const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Shop+16,+City+Tower,+Al+Nuaimiya+3,+Opp+Grand+Mall,+Ajman";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;