import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';

// ========== الاستيرادات ==========
import createAppTheme from './theme';                          // إعدادات Theme الخاصة بـ MUI
import App from './App';                                        // المكون الرئيسي (Routes)
import i18n from './Translate/i18n';                            // إعدادات i18next (الترجمة)
import { AppProvider } from './context/AppContext';             // سياق المستخدم + الحالة العامة
import { FavoritesProvider } from './context/FavoritesContext'; // ✅ سياق المفضلة (جديد)

// ========== استيراد الأنيميشن المركزي (مرة واحدة) ==========
import './components/styles/animations.css';
import { NotificationsProvider } from './context/NotificationsContext'
/**
 * ==================== المكون الجذر (AppRoot) ====================
 * 
 * وظيفته:
 * 1. تتبع تغيير اللغة (ar/en) من i18next
 * 2. تحديث `dir` و `lang` على عنصر `<html>` 
 * 3. تطبيق Theme المناسب للاتجاه (RTL/LTR)
 */
function AppRoot() {
  const { i18n: translation } = useTranslation();
  const isArabic = translation.language.startsWith('ar');
  const direction = isArabic ? 'rtl' : 'ltr';

  // تحديث الـ dir والـ lang على <html> عند تغيير اللغة
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [direction, isArabic]);

  return (
    // ThemeProvider: يطبّق إعدادات MUI (ألوان، خطوط، اتجاه RTL/LTR)
    <ThemeProvider theme={createAppTheme(direction)}>
      {/* CssBaseline: يعيد ضبط الأنماط الافتراضية للمتصفح (reset CSS) */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

/**
 * ==================== نقطة بداية التطبيق ====================
 * 
 * ترتيب الـ Providers مهم جداً (من الأعم إلى الأخص):
 * 
 * 1. React.StrictMode
 *    └─ يساعد في اكتشاف المشاكل أثناء التطوير
 * 
 * 2. BrowserRouter  
 *    └─ يوفر routing لجميع المكونات (useNavigate, useParams, ...)
 * 
 * 3. AppProvider  
 *    └─ يوفر: user, setUser, isAuthenticated
 *    └─ يجب أن يكون فوق FavoritesProvider لأنه يستخدمه
 * 
 * 4. FavoritesProvider  ✅
 *    └─ يوفر: favorites, isFavorite, toggleFavorite, count
 *    └─ يعتمد على AppProvider للحصول على user
 * 
 * 5. ThemeProvider (داخل AppRoot)
 *    └─ يوفر Theme لـ MUI
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        {/* ✅ FavoritesProvider داخل AppProvider لأنه يحتاج user */}
        <FavoritesProvider>
         <NotificationsProvider>
          <AppRoot />
         </NotificationsProvider>
        </FavoritesProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

/**
 * ==================== ملاحظات مهمة ====================
 * 
 *  لماذا هذا الترتيب بالذات؟
 * 
 *  FavoritesContext يستخدم useApp() للحصول على user
 *    → لذلك يجب أن يكون داخل AppProvider
 * 
 *  AppContext لا يستخدم router
 *    → لكن من الأفضل وضعه داخل BrowserRouter ليكون جاهزاً لأي توسع مستقبلي
 * 
 *  ThemeProvider داخل AppRoot
 *    → لأنه يعتمد على اللغة (direction) المتغيرة ديناميكياً
 * 
 *  إذا أردت إضافة Provider آخر (مثل NotificationsProvider لاحقاً):
 *    ضعه بجانب FavoritesProvider (داخل AppProvider)
 */