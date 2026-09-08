import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import api from '../../API/axios'
import { getImageUrl } from '../../components/utils/imageHelper'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'
import {
  Box, Typography, Stack, Card, CardContent, Avatar, Rating, Button,
  TextField, Fade, Grow, Paper, Chip, CircularProgress, IconButton,
  Collapse, Dialog, DialogContent
} from '@mui/material'
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  Edit as EditIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  ThumbUp as ThumbUpIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Sort as SortIcon,
  HourglassEmpty as PendingIcon,
  Lock as LockIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

// ==================== ثوابت ====================
const PAGE_SIZE = 5
const MAX_COMMENT = 500
const RATING_LABELS = { 5: 'ممتاز', 4: 'جيد جداً', 3: 'جيد', 2: 'مقبول', 1: 'ضعيف' }
const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'highest', label: 'الأعلى تقييماً' },
  { value: 'lowest', label: 'الأقل تقييماً' },
]
// ✅ الترتيب داخل الواجهة (الـ API يدعم page/limit فقط)
const SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  highest: (a, b) => Number(b.rating) - Number(a.rating),
  lowest: (a, b) => Number(a.rating) - Number(b.rating),
}

// ==================== دوال مساعدة ====================
const isUserReview = (r, user) => !!user && (r.user_id === user.id || r.User?.id === user.id)
const isApproved = (r) => r.status === 'approved' || !r.status

const formatDate = (d, isRTL) =>
  d ? new Date(d).toLocaleDateString(isRTL ? 'ar-SY' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : ''

const Stars = ({ value, size = 16 }) => {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <Stack direction="row" spacing={0.25}>
      {Array.from({ length: 5 }, (_, i) =>
        i < full ? <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: size }} />
        : i === full && half ? <StarHalfIcon key={i} sx={{ color: '#fbbf24', fontSize: size }} />
        : <StarBorderIcon key={i} sx={{ color: '#e2e8f0', fontSize: size }} />
      )}
    </Stack>
  )
}

// ==================== المكون الرئيسي ====================
/**
 * @param {'trip'|'package'} reviewableType
 * @param {number} reviewableId
 * @param {boolean} requireBooking - اشترط وجود حجز للتقييم (true افتراضياً)
 */
export default function ReviewsSection({ reviewableType, reviewableId, title, requireBooking = true }) {
  const { t, i18n } = useTranslation()
  const { user } = useApp()
  const isRTL = i18n.language === 'ar'

  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // نموذج الكتابة
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // حالة المستخدم
  const [userHasBooking, setUserHasBooking] = useState(false)
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [myPendingReview, setMyPendingReview] = useState(null)

  // Dialogs
  const [successDialog, setSuccessDialog] = useState(false)
  const [errorDialog, setErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // ========== جلب التقييمات: GET /reviews/{trip|package}/:id ==========
  useEffect(() => {
    fetchReviews()
    if (user && requireBooking) checkUserBooking()
  }, [reviewableType, reviewableId, user])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/reviews/${reviewableType}/${reviewableId}`, {
        params: { page: 1, limit: 100 }
      })

      // ✅ الاستجابة الحقيقية: data.data مصفوفة مباشرة
      const list = Array.isArray(data.data) ? data.data : (data.data?.reviews || [])
      setAllReviews(list)

      // ✅ تحديد حالة تقييم المستخدم الحالي (معتمد أو معلق)
      if (user) {
        const own = list.find(r => isUserReview(r, user))
        if (own) {
          setUserHasReviewed(true)
          if (!isApproved(own)) setMyPendingReview(own)
        }
      }
    } catch (err) {
      console.error('Fetch reviews error:', err)
      setAllReviews([])
    } finally {
      setLoading(false)
    }
  }

  // ========== التحقق من وجود حجز: GET /bookings/my ==========
  const checkUserBooking = async () => {
    try {
      const { data } = await api.get('/bookings/my', { params: { page: 1, limit: 100 } })
      const bookings = Array.isArray(data.data) ? data.data : (data.data?.bookings || [])
      setUserHasBooking(bookings.some(b =>
        b.bookable_type === reviewableType &&
        String(b.bookable_id) === String(reviewableId) &&
        (['confirmed', 'paid', 'completed'].includes(b.status) || b.payment_status === 'paid')
      ))
    } catch {
      setUserHasBooking(false)
    }
  }

  // ========== حسابات مشتقة ==========
  const approvedReviews = useMemo(() => allReviews.filter(isApproved), [allReviews])

  const sortedReviews = useMemo(
    () => [...approvedReviews].sort(SORTERS[sortBy] || SORTERS.newest),
    [approvedReviews, sortBy]
  )

  const stats = useMemo(() => {
    const total = approvedReviews.length
    const avg = total ? approvedReviews.reduce((s, r) => s + Number(r.rating), 0) / total : 0
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    approvedReviews.forEach(r => { dist[Math.round(Number(r.rating))] += 1 })
    return { total, average: avg, distribution: dist }
  }, [approvedReviews])

  const canWriteReview = user && !userHasReviewed && !showForm &&
    (!requireBooking || userHasBooking)

  const visibleReviews = sortedReviews.slice(0, visibleCount)

  // ========== إرسال تقييم: POST /reviews ==========
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || rating === 0 || !comment.trim()) return

    setSubmitting(true)
    try {
      const { data } = await api.post('/reviews', {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        rating,
        comment: comment.trim()
      })

      // ✅ عرض تقييمي المعلق فوراً (محلياً)
      const created = data.data || data
      setMyPendingReview({
        ...created,
        id: created.id || `temp-${Date.now()}`,
        rating,
        comment: comment.trim(),
        status: 'pending',
        User: user,
        createdAt: created.createdAt || new Date().toISOString()
      })

      setSuccessDialog(true)
      setRating(0)
      setComment('')
      setShowForm(false)
      setUserHasReviewed(true)
    } catch (err) {
      console.error('Submit review error:', err)
      if (err.response?.status === 409) {
        setErrorMessage(t('reviews.already_reviewed', 'لقد قمت بتقييم هذا العنصر من قبل'))
        setUserHasReviewed(true)
        setShowForm(false)
        fetchReviews()
      } else {
        setErrorMessage(err.response?.data?.message || t('reviews.submit_failed', 'فشل في إرسال التقييم'))
      }
      setErrorDialog(true)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => { setShowForm(false); setRating(0); setComment('') }

  // ==================== العرض ====================
  return (
    <Box sx={{ mt: 4 }}>
      {/* ===== العنوان + الإجراءات ===== */}
      <Stack direction="row" gap={2} sx={{ mb: 3 , justifyContent:"space-between", alignItems:"center" , flexWrap:"wrap" }}>
        <Stack direction="row" spacing={1.5}  sx={{alignItems:"center"}}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2, background: BRAND.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(51,151,184,0.3)'
          }}>
            <StarIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" color="#0f172a">
              {title || t('reviews.title', 'التقييمات والمراجعات')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.total > 0
                ? `${stats.total} ${t('reviews.review', 'تقييم')} • ${stats.average.toFixed(1)} ★`
                : t('reviews.no_reviews', 'لا توجد تقييمات بعد')}
            </Typography>
          </Box>
        </Stack>

        {/* زر الكتابة */}
        {canWriteReview && (
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setShowForm(true)}
            sx={{ ...gradientButtonSx, fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 3 }}>
            {t('reviews.write_review', 'اكتب تقييماً')}
          </Button>
        )}

        {/* شارة تقييمي (معلق أو معتمد) */}
        {user && userHasReviewed && !showForm && (
          <Chip
            icon={myPendingReview ? <PendingIcon /> : <CheckIcon />}
            label={myPendingReview
              ? t('reviews.your_review_pending', 'تقييمك قيد المراجعة')
              : t('reviews.already_reviewed_short', 'لقد قيّمت مسبقاً')}
            sx={myPendingReview
              ? { bgcolor: '#fffbeb', color: '#b45309', fontWeight: 700, border: '1px solid #fcd34d', px: 1 }
              : { bgcolor: '#f0fdf4', color: '#065f46', fontWeight: 700, border: '1px solid #bbf7d0', px: 1 }}
          />
        )}

        {/* شارة يجب الحجز أولاً */}
        {user && requireBooking && !userHasBooking && !userHasReviewed && (
          <Chip
            icon={<LockIcon sx={{ fontSize: 16 }} />}
            label={t('reviews.booking_needed_short', 'احجز أولاً للتقييم')}
            sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600, border: '1px solid #e2e8f0' }}
          />
        )}
      </Stack>

      {/* ===== لوحة الإحصائيات ===== */}
      {stats.total > 0 && (
        <Fade in>
          <Paper elevation={0} sx={{
            p: { xs: 2, md: 3 }, mb: 4, borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            background: 'linear-gradient(135deg, rgba(51,151,184,0.05) 0%, rgba(10,37,64,0.03) 100%)',
          }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}  sx={{alignItems:{ xs: 'flex-start', md: 'center' }}}>
              {/* المتوسط */}
              <Box sx={{ textAlign: 'center', p: 2.5, borderRadius: 2, bgcolor: 'white', minWidth: 140, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Typography variant="h2" fontWeight="900" color={BRAND.primary} sx={{ lineHeight: 1 }}>
                  {stats.average.toFixed(1)}
                </Typography>
                <Box sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
                  <Stars value={stats.average} size={20} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {t('reviews.based_on', 'بناءً على')} {stats.total} {t('reviews.review', 'تقييم')}
                </Typography>
              </Box>

              {/* توزيع النجوم */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack spacing={1}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats.distribution[star] || 0
                    const percent = stats.total ? (count / stats.total) * 100 : 0
                    return (
                      <Stack key={star} direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                        <Typography variant="caption" sx={{ minWidth: 15, fontWeight: 700, color: '#64748b' }}>{star} ★</Typography>
                        <Box sx={{ flex: 1, height: 8, bgcolor: '#e2e8f0', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
                          <Box sx={{
                            position: 'absolute', top: 0, left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto',
                            height: '100%', width: `${percent}%`, background: BRAND.gradient,
                            borderRadius: 1, transition: 'width 0.8s ease',
                          }} />
                        </Box>
                        <Typography variant="caption" sx={{ minWidth: 30, textAlign: isRTL ? 'left' : 'right', fontWeight: 600, color: '#64748b' }}>
                          {count}
                        </Typography>
                      </Stack>
                    )
                  })}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Fade>
      )}

      {/* ===== نموذج الكتابة ===== */}
      <Collapse in={showForm}>
        <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, background: BRAND.gradient, color: 'white', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EditIcon />
            <Typography variant="h6" fontWeight="700" sx={{ flex: 1 }}>
              {t('reviews.write_review', 'اكتب تقييمك')}
            </Typography>
            <IconButton onClick={resetForm} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
              <ExpandLessIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box component="form" onSubmit={handleSubmit}>
              {/* التقييم بالنجوم */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5, color: '#0f172a' }}>
                  {t('reviews.your_rating', 'تقييمك')} *
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems:"center"}}>
                  <Rating
                    value={rating}
                    onChange={(e, v) => setRating(v)}
                    size="large"
                    icon={<StarIcon sx={{ color: '#fbbf24', fontSize: 36 }} />}
                    emptyIcon={<StarBorderIcon sx={{ color: '#e2e8f0', fontSize: 36 }} />}
                  />
                  {rating > 0 && (
                    <Chip label={RATING_LABELS[rating]} size="small"
                      sx={{ bgcolor: 'rgba(251,191,36,0.1)', color: '#b45309', fontWeight: 700 }} />
                  )}
                </Stack>
              </Box>

              {/* التعليق */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5, color: '#0f172a' }}>
                  {t('reviews.your_comment', 'تعليقك')} *
                </Typography>
                <TextField
                  fullWidth multiline rows={4} value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                  placeholder={t('reviews.comment_placeholder', 'شاركنا تجربتك...')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {comment.length}/{MAX_COMMENT}
                </Typography>
              </Box>

              {/* الأزرار */}
              <Stack direction="row" spacing={2}>
                <Button
                  type="submit" variant="contained" size="large"
                  disabled={submitting || rating === 0 || !comment.trim()}
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                  sx={{ ...gradientButtonSx, py: 1.3, px: 4, fontWeight: 700, textTransform: 'none', borderRadius: 2.5 }}
                >
                  {submitting ? t('reviews.submitting', 'جاري الإرسال...') : t('reviews.submit_review', 'إرسال التقييم')}
                </Button>
                <Button variant="outlined" onClick={resetForm}
                  sx={{ borderColor: '#e2e8f0', color: '#64748b', fontWeight: 600, textTransform: 'none', borderRadius: 2.5 }}>
                  {t('common.cancel', 'إلغاء')}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* ===== الترتيب ===== */}
      {sortedReviews.length > 1 && (
        <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 3, alignItems: 'center'  ,  flexWrap:"wrap"}}>
          <SortIcon sx={{ color: '#64748b' }} />
          <Typography variant="body2" color="text.secondary" fontWeight="600">
            {t('reviews.sort_by', 'الترتيب حسب')}:
          </Typography>
          {SORT_OPTIONS.map(opt => (
            <Chip
              key={opt.value} label={opt.label} size="small" onClick={() => setSortBy(opt.value)}
              sx={{
                bgcolor: sortBy === opt.value ? BRAND.primary : 'rgba(51,151,184,0.05)',
                color: sortBy === opt.value ? 'white' : '#475569',
                fontWeight: 600, cursor: 'pointer',
                '&:hover': { bgcolor: sortBy === opt.value ? BRAND.primaryDark : 'rgba(51,151,184,0.1)' }
              }}
            />
          ))}
        </Stack>
      )}

      {/* ===== قائمة التقييمات ===== */}
      {loading ? (
        <Stack spacing={2}>{[...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)}</Stack>
      ) : (
        <Stack spacing={2}>
          {/* تقييمي قيد المراجعة (أعلى القائمة دائماً) */}
          {myPendingReview && (
            <Grow in>
              <Box>
                <ReviewCard review={myPendingReview} isOwn isPending isRTL={isRTL} t={t} />
              </Box>
            </Grow>
          )}

          {/* التقييمات المعتمدة */}
          {visibleReviews.map((review, i) => (
            <Grow in key={review.id} timeout={200 + i * 80}>
              <Box>
                <ReviewCard review={review} isOwn={isUserReview(review, user)} isRTL={isRTL} t={t} />
              </Box>
            </Grow>
          ))}

          {/* زر عرض المزيد */}
          {visibleCount < sortedReviews.length && (
            <Button
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              sx={{
                alignSelf: 'center', mt: 2, color: BRAND.primary, fontWeight: 700,
                textTransform: 'none', borderColor: BRAND.primary, borderWidth: 2, borderRadius: 2.5,
                '&:hover': { borderWidth: 2, bgcolor: 'rgba(51,151,184,0.05)' }
              }}
            >
              {t('reviews.show_more', 'عرض المزيد')} ({sortedReviews.length - visibleCount})
            </Button>
          )}

          {/* حالة فارغة */}
          {sortedReviews.length === 0 && !myPendingReview && (
            <Fade in>
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #cbd5e1', bgcolor: 'rgba(255,255,255,0.9)' }}>
                <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'rgba(251,191,36,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StarIcon sx={{ fontSize: 40, color: '#fbbf24' }} />
                </Box>
                <Typography variant="h6" fontWeight="700" color="#0f172a" gutterBottom>
                  {t('reviews.no_reviews', 'لا توجد تقييمات بعد')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('reviews.be_first', 'كن أول من يقيّم ويشارك تجربته!')}
                </Typography>
                {canWriteReview && (
                  <Button variant="contained" startIcon={<EditIcon />} onClick={() => setShowForm(true)}
                    sx={{ ...gradientButtonSx, fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4 }}>
                    {t('reviews.write_first_review', 'اكتب أول تقييم')}
                  </Button>
                )}
              </Paper>
            </Fade>
          )}
        </Stack>
      )}

      {/* ===== Dialog نجاح (أخضر) ===== */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' } } }}>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon sx={{ fontSize: 50 }} />
          </Box>
          <Typography variant="h5" fontWeight="800" gutterBottom>
            {t('reviews.success_title', 'تم بنجاح!')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, lineHeight: 1.6 }}>
            {t('reviews.review_pending_approval', 'تم إضافة تقييمك بنجاح! سيتم عرضه بعد موافقة الإدارة عليه.')}
          </Typography>
          <Button variant="contained" onClick={() => setSuccessDialog(false)}
            sx={{ bgcolor: 'white', color: '#10b981', fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
            {t('common.ok', 'حسناً')}
          </Button>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog خطأ (أحمر) ===== */}
      <Dialog open={errorDialog} onClose={() => setErrorDialog(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' } } }}>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ErrorIcon sx={{ fontSize: 50 }} />
          </Box>
          <Typography variant="h5" fontWeight="800" gutterBottom>
            {t('reviews.error_title', 'تنبيه')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, lineHeight: 1.6 }}>
            {errorMessage}
          </Typography>
          <Button variant="contained" onClick={() => setErrorDialog(false)}
            sx={{ bgcolor: 'white', color: '#ef4444', fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
            {t('common.ok', 'حسناً')}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

// ==================== بطاقة تقييم ====================
const ReviewCard = ({ review, isOwn = false, isPending = false, isRTL, t }) => {
  const userName = review.User
    ? `${review.User.first_name || ''} ${review.User.last_name || ''}`.trim()
    : (review.user_name || t('reviews.anonymous', 'مستخدم'))

  // ✅ صورة المستخدم من المسار الحقيقي /uploads/avatars/...
  const avatarUrl = review.User?.avatar ? getImageUrl(review.User.avatar) : undefined

  return (
    <Paper elevation={0} sx={{
      p: { xs: 2, md: 3 }, borderRadius: 3, position: 'relative', overflow: 'hidden',
      border: '1px solid', borderColor: isOwn ? BRAND.primary : 'rgba(0,0,0,0.06)',
      bgcolor: isOwn ? 'rgba(51,151,184,0.03)' : 'white',
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' }
    }}>
      {/* شريط علوي لتقييمي */}
      {isOwn && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: BRAND.gradient }} />}

      {/* شارة قيد المراجعة */}
      {isPending && (
        <Box sx={{
          position: 'absolute', top: isOwn ? 3 : 0, left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto',
          bgcolor: '#fef3c7', color: '#92400e', px: 2, py: 0.5,
          borderBottomLeftRadius: isRTL ? 0 : 8, borderBottomRightRadius: isRTL ? 8 : 0,
          display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', fontWeight: 700,
        }}>
          <PendingIcon sx={{ fontSize: 14 }} />
          {t('reviews.pending_approval', 'قيد المراجعة')}
        </Box>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 2, mt: isPending ? 3 : 0 }}>
        <Avatar src={avatarUrl}
          sx={{ bgcolor: isOwn ? BRAND.primary : '#64748b', width: 48, height: 48, fontWeight: 700 }}>
          {userName.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{justifyContent:"space-between" , alignItems:"flex-start", flexWrap:"wrap"}} gap={1}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems:"center", flexWrap:"wrap"}}>
                <Typography variant="subtitle1" fontWeight="700" color="#0f172a">{userName}</Typography>
                {isOwn && (
                  <Chip label={t('reviews.your_review', 'تقييمك')} size="small"
                    sx={{ bgcolor: BRAND.primary, color: 'white', fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {formatDate(review.createdAt, isRTL)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}sx={{ alignItems:"center"}}>
              <Stars value={Number(review.rating)} />
              <Chip label={`${review.rating}/5`} size="small"
                sx={{ bgcolor: 'rgba(251,191,36,0.1)', color: '#b45309', fontWeight: 700, height: 24, fontSize: '0.7rem' }} />
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {/* نص التقييم */}
      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
        {review.comment}
      </Typography>

      {/* ✅ رد الإدارة + تاريخ الرد */}
      {review.admin_reply && (
        <Box sx={{
          mt: 2, p: 2, borderRadius: 2, bgcolor: '#f0f9ff', border: '1px solid #bae6fd',
          borderLeft: isRTL ? 'none' : '4px solid #0284c7',
          borderRight: isRTL ? '4px solid #0284c7' : 'none',
        }}>
          <Stack direction="row" spacing={1}  sx={{ mb: 1 , alignItems:"center" , flexWrap:"wrap"}} >
            <ThumbUpIcon sx={{ fontSize: 16, color: '#0284c7' }} />
            <Typography variant="caption" fontWeight="700" color="#0c4a6e">
              {t('reviews.admin_reply', 'رد الإدارة')}
            </Typography>
            {review.replied_at && (
              <Typography variant="caption" color="#64748b">
                • {formatDate(review.replied_at, isRTL)}
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" color="#0c4a6e" sx={{ lineHeight: 1.6 }}>
            {review.admin_reply}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

// ==================== Skeleton ====================
const ReviewSkeleton = () => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 16, bgcolor: '#e2e8f0', borderRadius: 1, width: '40%', mb: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <Box sx={{ height: 12, bgcolor: '#e2e8f0', borderRadius: 1, width: '25%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </Box>
    </Stack>
    {[100, 90, 70].map((w, i) => (
      <Box key={i} sx={{ height: 14, bgcolor: '#e2e8f0', borderRadius: 1, width: `${w}%`, mb: 1, animation: 'pulse 1.5s ease-in-out infinite' }} />
    ))}
  </Paper>
)