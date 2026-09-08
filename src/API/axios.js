import axios from 'axios';

// ==================== إعدادات axios ====================
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ==================== متغيرات إدارة الـ Refresh ====================
let isRefreshing = false;
let failedQueue = [];

// ==================== endpoints لا تحتاج تجديد ====================
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

// ==================== دوال مساعدة ====================

/**
 * التحقق مما إذا كان المسار هو endpoint مصادقة
 */
const isAuthEndpoint = (url) => {
  if (!url) return false;
  return AUTH_ENDPOINTS.some(endpoint => url.endsWith(endpoint) || url.includes(endpoint));
};

/**
 * مسح بيانات الجلسة من المتصفح
 */
const clearSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // إطلاق حدث مخصص لإخطار باقي التطبيق
  window.dispatchEvent(new CustomEvent('auth:logout'));
  
  console.warn('🔒 [Auth] تم مسح الجلسة');
};

/**
 * معالجة الطلبات المعلقة في الطابور
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
  
  if (error) {
    console.error(`❌ [Auth] فشل تجديد التوكن لـ ${failedQueue.length} طلب`);
  } else {
    console.log(`✅ [Auth] تم تجديد التوكن بنجاح لـ ${failedQueue.length} طلب`);
  }
};

/**
 * تجديد التوكن باستخدام الـ refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    console.error('❌ [Auth] لا يوجد رمز تجديد للجلسة');
    throw new Error('لا يوجد رمز تجديد للجلسة');
  }

  try {
    console.log('🔄 [Auth] جاري تجديد التوكن...');
    
    const { data } = await axios.post(
      '/api/auth/refresh-token',
      { refresh_token: refreshToken },
      { 
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const authData = data.data || data;
    const accessToken = authData.access_token || authData.accessToken || authData.token;
    const newRefreshToken = authData.refresh_token || authData.refreshToken;

    if (!accessToken) {
      throw new Error('لم يتم استلام رمز دخول جديد من السيرفر');
    }

    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    console.log('✅ [Auth] تم تجديد التوكن بنجاح');
    return accessToken;
  } catch (error) {
    console.error('❌ [Auth] فشل تجديد التوكن:', error.response?.data || error.message);
    clearSession();
    throw error;
  }
};

// ==================== Interceptor للطلبات ====================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    //  Logging للطلبات (اختياري - يمكن تعطيله في الإنتاج)
    if (import.meta.env.DEV) {
      console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== Interceptor للاستجابات ====================
API.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`📥 [API] ${response.status} ${response.config?.url}`);
    }
    return response;
  },
  
  async (error) => {
    const originalRequest = error.config;

    //  Logging للأخطاء
    if (import.meta.env.DEV) {
      console.error(`❌ [API] ${error.response?.status || 'NETWORK'} ${originalRequest?.url}`, {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }

    //  1. لا توجد استجابة (مشكلة شبكة)
    if (!error.response) {
      console.error('🌐 [API] مشكلة في الاتصال بالسيرفر');
      return Promise.reject(error);
    }

    const status = error.response.status;

    //  2. معالجة 403 (لا صلاحية)
    if (status === 403) {
      console.warn('🚫 [API] لا توجد صلاحية للوصول:', originalRequest.url);
      return Promise.reject(error);
    }

    //  3. معالجة 500+ (خطأ في السيرفر)
    if (status >= 500) {
      console.error('💥 [API] خطأ في السيرفر:', error.response.data);
      return Promise.reject(error);
    }

    //  4. الخطأ ليس 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // من هنا: الخطأ هو 401 ونحاول التجديد

    // 5. الطلب هو endpoint مصادقة (لا نحتاج تجديد)
    if (isAuthEndpoint(originalRequest.url)) {
      console.warn('🔐 [Auth] فشل في endpoint مصادقة، لا نحاول التجديد');
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 6. تم محاولة التجديد مسبقاً لهذا الطلب
    if (originalRequest._retry) {
      console.warn('⚠️ [Auth] تم محاولة التجديد مسبقاً لهذا الطلب');
      return Promise.reject(error);
    }

    // 7. إذا كانت عملية التجديد جارية، نضع الطلب في الطابور
    if (isRefreshing) {
      console.log('⏳ [Auth] انتظار اكتمال التجديد الحالي...');
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    // ==================== بدء عملية التجديد ====================
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();
      
      processQueue(null, newAccessToken);
      
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      console.log('🔁 [Auth] إعادة إرسال الطلب الأصلي');
      return API(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // حفظ الصفحة الحالية للعودة إليها
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        console.log(`🔄 [Auth] إعادة توجيه إلى: ${redirectUrl}`);
        window.location.href = redirectUrl;
      }

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);
// ==================== 1) منع تكرار طلبات GET المتزامنة المتطابقة ====================
// يحل مشكلة StrictMode: الطلب الثاني المتطابق يحصل على نفس الـ Promise بدل طلب جديد
const inflightGets = new Map();
const originalGet = API.get.bind(API);

API.get = (url, config = {}) => {
  const key = `${url}|${JSON.stringify(config.params || {})}`;
  if (inflightGets.has(key)) {
    return inflightGets.get(key); // ♻️ إعادة استخدام نفس الطلب
  }
  const request = originalGet(url, config).finally(() => inflightGets.delete(key));
  inflightGets.set(key, request);
  return request;
};

// ==================== 2) تسجيل كل خطأ مرة واحدة فقط ====================
const loggedErrors = new Map();
const logErrorOnce = (key, message, extra) => {
  const now = Date.now();
  const last = loggedErrors.get(key);
  if (last && now - last < 5000) return; // تجاهل التكرار خلال 5 ثوانٍ
  loggedErrors.set(key, now);
  console.error(message, extra ?? '');
};

// ==================== 3) معالجة 429: انتظر وأعد المحاولة تلقائياً ====================

export default API;