import {
  CheckCircle as BookingOkIcon,
  Cancel as CancelIcon,
  Payments as PaymentIcon,
  Star as ReviewIcon,
  FlightTakeoff as TripIcon,
  Campaign as GeneralIcon,
} from '@mui/icons-material'

/**
 * 🎨 تحديد أيقونة ولون الإشعار حسب نوعه
 */
export const getNotificationMeta = (n) => {
  const type = String(n.type || n.notification_type || 'general').toLowerCase()

  if (type.includes('cancel')) return { Icon: CancelIcon, color: '#ef4444' }
  if (type.includes('payment') || type.includes('refund')) return { Icon: PaymentIcon, color: '#8b5cf6' }
  if (type.includes('review')) return { Icon: ReviewIcon, color: '#f59e0b' }
  if (type.includes('booking')) return { Icon: BookingOkIcon, color: '#10b981' }
  if (type.includes('trip') || type.includes('package')) return { Icon: TripIcon, color: '#3397b8' }
  return { Icon: GeneralIcon, color: '#64748b' }
}

/**
 * ⏰ وقت نسبي بلغتين: "منذ 5 دقائق" / "5 minutes ago"
 */
export const timeAgo = (dateStr, isRTL) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const rtf = new Intl.RelativeTimeFormat(isRTL ? 'ar' : 'en', { numeric: 'auto' })

  if (mins < 1) return isRTL ? 'الآن' : 'Just now'
  if (mins < 60) return rtf.format(-mins, 'minute')
  const hours = Math.floor(mins / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')
  const days = Math.floor(hours / 24)
  if (days < 30) return rtf.format(-days, 'day')
  return rtf.format(-Math.floor(days / 30), 'month')
}

/**
 * 📝 استخراج العنوان والنص بدعم الحقول المحتملة
 */
export const getNotificationText = (n, isRTL) => ({
  title: isRTL
    ? (n.title_ar || n.title_en || n.title || '')
    : (n.title_en || n.title_ar || n.title || ''),
  message: isRTL
    ? (n.message_ar || n.message_en || n.message || n.body || n.content || '')
    : (n.message_en || n.message_ar || n.message || n.body || n.content || ''),
})