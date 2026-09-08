import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// استيراد ملفات الترجمة الموحدة
import ar from './ar.json';
import en from './en.json';

i18n
  // اكتشاف لغة المتصفح تلقائياً
  .use(LanguageDetector)
  // دمج i18next مع React
  .use(initReactI18next)
  .init({
    // الموارد (ملفات الترجمة)
    resources: {
      ar: { translation: { ...ar, booking: ar.bookings } },
      en: { translation: { ...en, booking: en.bookings } },
    },
    // اللغة الافتراضية
    fallbackLng: 'ar',
    // اللغة الافتراضية عند التحميل الأول
    lng: localStorage.getItem('i18nextLng') || 'ar',
    // اكتشاف اللغة
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // عدم الهروب من القيم (للعربية)
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;