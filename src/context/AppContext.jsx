import { createContext, useContext, useState, useEffect } from 'react'
import api from '../API/axios'
import i18n from '../Translate/i18n' // استيراد إعدادات الترجمة

// 1. إنشاء السياق (Context)
const AppContext = createContext()

// 2. مزود السياق (Provider) - يغلف التطبيق ويوفر البيانات
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // التحقق من وجود مستخدم مسجل عند فتح التطبيق لأول مرة
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (token) {
        try {
          // جلب بيانات المستخدم من الـ API
          const { data } = await api.get('/auth/profile')
          setUser(data.data || data.user || data) // حفظ بيانات المستخدم في الحالة
        } catch (error) {
          console.error('فشل جلب بيانات المستخدم (ربما انتهت الجلسة):', error)
          // إذا فشل الطلب، نمسح التوكن لأنّه غير صالح
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          setUser(null)
        }
      }
      setLoading(false) // إنهاء حالة التحميل المبدئي
    }
    
    checkUser()
  }, [])

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      await api.post('/auth/logout') // إبلاغ السيرفر بتسجيل الخروج
    } catch (error) {
      console.error('خطأ أثناء تسجيل الخروج من السيرفر:', error)
    } finally {
      // مسح البيانات محلياً في جميع الحالات
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  // دالة تغيير اللغة
  const changeLanguage = (newLang) => {
    i18n.changeLanguage(newLang) // تحديث مكتبة الترجمة
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr' // تغيير اتجاه الصفحة
    document.documentElement.lang = newLang === 'ar' ? 'ar' : 'en'
  }

  // 3. القيم التي سنوفرها لجميع المكونات
  const value = {
    user,
    setUser, // للسماح لصفحة Login بتحديث حالة المستخدم بعد النجاح
    loading,
    logout,
    lang: i18n.language, // اللغة الحالية
    changeLanguage,
  }

  // عرض شاشة تحميل بسيطة ريثما نتحقق من حالة المستخدم
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>جاري تحميل التطبيق...</p>
      </div>
    )
  }

  // 4. تغليف المكونات الأبناء بمزود السياق
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// 5. هوك (Hook) مخصص لاستخدام السياق بسهولة في أي مكون
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}