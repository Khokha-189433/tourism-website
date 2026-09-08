/**
 * 💳 SamaPay Payment Gateway Integration
 * ======================================
 * بناءً على ملف Merchant Integration.postman_collection.json
 *
 * التدفق الكامل:
 * 1. Frontend → POST /payments/initiate/{bookingId} (Backend)
 * 2. Backend يُرجع form_data + merchant_kit_url
 * 3. Frontend يبني form مخفي ويرسل البيانات لبوابة SamaPay
 * 4. SamaPay تعرض صفحة الدفع للمستخدم
 * 5. بعد الدفع → SamaPay ترسل callback للـ Backend
 * 6. SamaPay تعيد المستخدم لـ redirectBackUrl (Frontend)
 */

// ========== ثوابت بوابة SamaPay ==========

/** رابط بوابة الدفع (بيئة الاختبار) */
export const SAMAPAY_MERCHANT_KIT_URL =
  'https://ecomtst.samapay.sy:8080/ss-ecom-merchant-kit/buyForm/completeTransaction'

/** رابط بوابة الدفع (بيئة الإنتاج) - يُفعّل لاحقاً */
// export const SAMAPAY_MERCHANT_KIT_URL =
//   'https://ecom.samapay.sy:8080/ss-ecom-merchant-kit/buyForm/completeTransaction'

/** الحقول المطلوبة من بوابة SamaPay حسب Postman */
export const SAMAPAY_REQUIRED_FIELDS = [
  'pspId',                    // معرف مزود الخدمة: PSP_001
  'mpiId',                    // معرف MPI: mpi-test
  'cardAcceptor',             // رقم التاجر: 99000721
  'merchantKitId',            // معرف المتجر: mki-test
  'mcc',                      // كود التصنيف: 3505
  'authenticationToken',      // رمز المصادقة (يُولّد من Backend)
  'currency',                 // العملة: SYP
  'language',                 // اللغة: ar أو en
  'countryCode',              // رمز الدولة: SYP
  'transactionTypeIndicator', // نوع العملية: SS
  'callBackUrl',              // رابط الـ callback (Backend)
  'redirectBackUrl',          // رابط إعادة التوجيه (Frontend)
  'transactionReference',     // الرقم المرجعي للعملية
  'dateTimeBuyer',            // تاريخ ووقت المشتري: YYYYMMDDHHmmss
  'dateTimeSIC',              // تاريخ ووقت SIC: YYYYMMDDHHmmss
  'transactionAmount',        // المبلغ
  'cardHolderPhoneNumber',    // رقم هاتف حامل البطاقة
  'cardHolderIPAddress',      // عنوان IP
  'cardHolderMailAddress',    // البريد الإلكتروني
]

// ========== دوال مساعدة ==========

/**
 * تنسيق التاريخ بصيغة SamaPay: YYYYMMDDHHmmss
 * @param {Date} [date] - التاريخ (افتراضي: الآن)
 * @returns {string} مثال: "20260908143025"
 */
export const formatSamaPayDate = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  )
}

/**
 * الحصول على عنوان IP الخاص بالمستخدم (تقريبي)
 * @returns {Promise<string>}
 */
export const getClientIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) })
    const data = await res.json()
    return data.ip || '0.0.0.0'
  } catch {
    return '0.0.0.0'
  }
}

/**
 * التحقق من اكتمال بيانات الدفع قبل الإرسال
 * @param {object} formData - بيانات النموذج
 * @returns {{ valid: boolean, missing: string[] }}
 */
export const validateSamaPayData = (formData) => {
  const missing = SAMAPAY_REQUIRED_FIELDS.filter(
    (field) => !formData[field] && formData[field] !== 0
  )
  return {
    valid: missing.length === 0,
    missing,
  }
}

const resolveMerchantKitUrl = (value) => {
  if (!value) return SAMAPAY_MERCHANT_KIT_URL

  try {
    const url = new URL(value)
    const isKnownGateway = ['ecomtst.samapay.sy', 'ecom.samapay.sy'].includes(url.hostname)
    return isKnownGateway && url.pathname.includes('completeTransaction')
      ? url.toString()
      : SAMAPAY_MERCHANT_KIT_URL
  } catch {
    return SAMAPAY_MERCHANT_KIT_URL
  }
}

// ========== الدالة الرئيسية ==========

/**
 * إرسال بيانات الدفع إلى بوابة SamaPay
 *
 * تُنشئ نموذج HTML مخفي وترسله تلقائياً → المتصفح ينتقل لصفحة الدفع
 *
 * @param {object} paymentData - البيانات من Backend (POST /payments/initiate/{id})
 * @param {string} paymentData.merchant_kit_url - رابط بوابة الدفع (اختياري، يُستخدم الافتراضي)
 * @param {object} paymentData.form_data - حقول النموذج المطلوبة
 *
 * @example
 * // البيانات القادمة من Backend:
 * const paymentData = {
 *   merchant_kit_url: "https://ecomtst.samapay.sy:8080/...",
 *   form_data: {
 *     pspId: "PSP_001",
 *     mpiId: "mpi-test",
 *     cardAcceptor: "99000721",
 *     merchantKitId: "mki-test",
 *     mcc: "3505",
 *     authenticationToken: "34ED87AB7BF9DEE5...",
 *     currency: "SYP",
 *     language: "ar",
 *     countryCode: "SYP",
 *     transactionTypeIndicator: "SS",
 *     callBackUrl: "https://api.example.com/payments/samapay/callback",
 *     redirectBackUrl: "https://example.com/payment/result",
 *     transactionReference: "TXN-20260908-001",
 *     dateTimeBuyer: "20260908143025",
 *     dateTimeSIC: "20260908143025",
 *     transactionAmount: "150000",
 *     cardHolderPhoneNumber: "0990000000",
 *     cardHolderIPAddress: "5.134.255.20",
 *     cardHolderMailAddress: "user@example.com"
 *   }
 * }
 * submitToSamaPay(paymentData)
 */
export const submitToSamaPay = async (paymentData) => {
  const {
    merchant_kit_url,
    form_data,
  } = paymentData || {}
  const merchantKitUrl = resolveMerchantKitUrl(merchant_kit_url)

  // ========== التحقق من البيانات ==========
  if (!form_data || typeof form_data !== 'object') {
    console.error('[SamaPay] ❌ form_data مفقودة أو غير صالحة:', paymentData)
    throw new Error('بيانات بوابة الدفع غير مكتملة (form_data مفقودة)')
  }

  const now = formatSamaPayDate()
  const clientIP = form_data.cardHolderIPAddress || await getClientIP()
  const normalizedFormData = {
    ...form_data,
    countryCode: form_data.countryCode || 'SYP',
    transactionTypeIndicator: form_data.transactionTypeIndicator || 'SS',
    dateTimeBuyer: form_data.dateTimeBuyer || now,
    dateTimeSIC: form_data.dateTimeSIC || now,
    cardHolderIPAddress: clientIP || '0.0.0.0',
  }

  // التحقق من الحقول المطلوبة
  const { valid, missing } = validateSamaPayData(normalizedFormData)
  if (!valid) {
    console.warn('[SamaPay] حقول مفقودة:', missing)
    // لا نرمي خطأ — قد يكون Backend أرسل حقول بأسماء مختلفة
  }

  console.log('[SamaPay]  إرسال بيانات الدفع إلى:', merchantKitUrl)
  console.log('[SamaPay]  الحقول:', Object.keys(normalizedFormData))

  // ========== إنشاء نموذج HTML مخفي ==========
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = merchantKitUrl
  form.style.display = 'none'
  form.id = 'samapay-payment-form'

  // إضافة Accept-Charset لضمان الترميز الصحيح
  form.acceptCharset = 'UTF-8'

  // إضافة جميع الحقول كـ hidden inputs
  Object.entries(normalizedFormData).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = String(value ?? '')
    form.appendChild(input)
  })

  // ========== حذف أي نموذج سابق (في حال إعادة المحاولة) ==========
  const existingForm = document.getElementById('samapay-payment-form')
  if (existingForm) {
    existingForm.remove()
  }

  // ========== إضافة النموذج للـ DOM وإرساله ==========
  document.body.appendChild(form)
  form.submit()

  // تنظيف بعد الإرسال (المتصفح سينتقل تلقائياً)
  setTimeout(() => {
    try {
      if (form.parentNode) form.parentNode.removeChild(form)
    } catch (e) { /* تم الانتقال بالفعل */ }
  }, 2000)
}

/**
 * بناء بيانات SamaPay يدوياً (في حال لم يُرجعها Backend جاهزة)
 *  يُفضّل أن يبنيها Backend لأن authenticationToken يجب أن يكون سري
 *
 * @param {object} options
 * @returns {object} form_data جاهزة للإرسال
 */
export const buildSamaPayFormData = ({
  transactionReference,
  transactionAmount,
  currency = 'SYP',
  language = 'ar',
  cardHolderPhoneNumber = '',
  cardHolderIPAddress = '0.0.0.0',
  cardHolderMailAddress = '',
  callBackUrl = '',
  redirectBackUrl = '',
  authenticationToken = '',
  // القيم الافتراضية من Postman
  pspId = 'PSP_001',
  mpiId = 'mpi-test',
  cardAcceptor = '99000721',
  merchantKitId = 'mki-test',
  mcc = '3505',
  countryCode = 'SYP',
  transactionTypeIndicator = 'SS',
} = {}) => {
  const now = formatSamaPayDate()
  return {
    pspId,
    mpiId,
    cardAcceptor,
    merchantKitId,
    mcc,
    authenticationToken,
    currency,
    language,
    countryCode,
    transactionTypeIndicator,
    callBackUrl,
    redirectBackUrl,
    transactionReference: String(transactionReference),
    dateTimeBuyer: now,
    dateTimeSIC: now,
    transactionAmount: String(transactionAmount),
    cardHolderPhoneNumber: String(cardHolderPhoneNumber),
    cardHolderIPAddress,
    cardHolderMailAddress,
  }
}

// ========== التحقق من نتيجة الدفع (للصفحة المُعاد التوجيه إليها) ==========

/**
 * استخراج بيانات نتيجة الدفع من URL الحالي
 * يُستخدم في صفحة /payment/result
 *
 * @returns {{ transactionRef: string|null, status: string|null, raw: object }}
 */
export const parseSamaPayResult = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    transactionRef: params.get('idTransaction') || params.get('ref') || params.get('transactionReference'),
    status: params.get('transactionStat') || params.get('status'),
    // S = Success, F = Failed
    isSuccess: params.get('transactionStat') === 'S',
    isFailed: params.get('transactionStat') === 'F',
    raw: Object.fromEntries(params.entries()),
  }
}

export default submitToSamaPay