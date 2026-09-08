import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import api from '../../API/axios'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../components/utils/imageHelper'
import { submitToSamaPay } from '../../components/utils/samapay'
import {
  Container, Grid, Box, Typography, Card, CardContent, Chip,
  Stack, Button, CircularProgress, Alert, Paper, Fade, Divider,
  Snackbar, Pagination, Skeleton, Zoom, Grow
} from '@mui/material'
import {
  FlightTakeoff as FlightIcon,
  Luggage as PackageIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AccessTime as ClockIcon,
  Payment as PaymentIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  ArrowForward as ArrowIcon,
  Explore as ExploreIcon
} from '@mui/icons-material'

// ========== دوال مساعدة ==========
const formatDate = (dateStr, locale) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}

// ========== مكون Skeleton للبطاقة ==========
const BookingCardSkeleton = () => (
  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
    <Skeleton variant="rectangular" height={220} animation="wave" />
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="70%" height={32} animation="wave" />
      <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} animation="wave" />
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" spacing={2}>
        <Skeleton variant="circular" width={24} height={24} animation="wave" />
        <Skeleton variant="text" width="30%" animation="wave" />
        <Skeleton variant="circular" width={24} height={24} animation="wave" />
        <Skeleton variant="text" width="30%" animation="wave" />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Skeleton variant="rectangular" width="50%" height={40} sx={{ borderRadius: 2 }} animation="wave" />
        <Skeleton variant="rectangular" width="50%" height={40} sx={{ borderRadius: 2 }} animation="wave" />
      </Stack>
    </CardContent>
  </Card>
)

export default function MyBookings() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user } = useApp()
  const isRTL = i18n.language === 'ar'
  const locale = isRTL ? 'ar-SY' : 'en-US'

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [payingId, setPayingId] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/my-bookings' } } })
      return
    }
    fetchMyBookings(page)
  }, [user, navigate, page])

  const fetchBookableDetails = async (type, id) => {
    try {
      const endpoint = type === 'package' ? 'packages' : 'trips'
      const { data } = await api.get(`/${endpoint}/${id}`)
      return data.data || data.trip || data.package || data
    } catch {
      return null
    }
  }

  const fetchMyBookings = async (currentPage = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)

      const { data } = await api.get('/bookings/my', {
        params: { page: currentPage, limit: 10 }
      })

      const list = Array.isArray(data.data)
        ? data.data
        : (data.data?.bookings || data.bookings || [])

      setPagination(data.pagination || null)

      const cache = {}
      const enriched = await Promise.all(
        list.map(async (booking) => {
          const key = `${booking.bookable_type}-${booking.bookable_id}`
          if (!(key in cache)) {
            cache[key] = fetchBookableDetails(booking.bookable_type, booking.bookable_id)
          }
          const Bookable = await cache[key]
          return { ...booking, Bookable }
        })
      )

      setBookings(enriched)
      
      if (isRefresh) {
        setSnackbar({ open: true, message: t('bookings.refreshed') || 'تم التحديث بنجاح', severity: 'success' })
      }
    } catch (err) {
      console.error('Fetch bookings error:', err)
      if (err.response?.status === 401) { navigate('/login'); return }
      if (err.response?.status === 403) {
        setError(t('bookings.forbidden') || 'ليس لديك صلاحية لعرض الحجوزات')
        return
      }
      setError(err.response?.data?.message || t('bookings.fetch_error') || 'فشل تحميل الحجوزات')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => fetchMyBookings(page, true)

  const handlePay = async (booking) => {
    try {
      setPayingId(booking.id)
      const { data } = await api.post(`/payments/initiate/${booking.id}`)
      const payment = data.data || data
      if (payment.form_data) {
        await submitToSamaPay(payment)
        return
      }

      const payUrl = payment.payment_url || payment.redirect_url || payment.url
      if (payUrl) {
        window.open(payUrl, '_blank')
        setSnackbar({ open: true, message: t('bookings.payment_opened') || 'تم فتح بوابة الدفع في نافذة جديدة', severity: 'success' })
      } else {
        setSnackbar({ open: true, message: t('bookings.payment_no_url') || 'تعذر الحصول على رابط الدفع', severity: 'warning' })
      }
      await fetchMyBookings(page)
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || t('bookings.payment_failed') || 'فشلت عملية بدء الدفع',
        severity: 'error'
      })
    } finally {
      setPayingId(null)
    }
  }

  const statusConfig = {
    pending:   { color: '#f59e0b', bgcolor: '#fef3c7', label: t('bookings.status_pending') || 'قيد الانتظار', pulse: true },
    confirmed: { color: '#10b981', bgcolor: '#d1fae5', label: t('bookings.status_confirmed') || 'مؤكد', pulse: false },
    paid:      { color: '#0284c7', bgcolor: '#dbeafe', label: t('bookings.status_paid') || 'مدفوع', pulse: false },
    cancelled: { color: '#ef4444', bgcolor: '#fee2e2', label: t('bookings.status_cancelled') || 'ملغي', pulse: false },
    completed: { color: '#8b5cf6', bgcolor: '#ede9fe', label: t('bookings.status_completed') || 'مكتمل', pulse: false }
  }

  const paymentConfig = {
    paid:      { color: '#10b981', bgcolor: '#d1fae5', label: t('bookings.paid') || 'مدفوع', pulse: false },
    pending:   { color: '#f59e0b', bgcolor: '#fef3c7', label: t('bookings.payment_pending') || 'قيد الدفع', pulse: true },
    initiated: { color: '#0284c7', bgcolor: '#dbeafe', label: t('bookings.payment_initiated') || 'بدأت عملية الدفع', pulse: true },
    unpaid:    { color: '#ef4444', bgcolor: '#fee2e2', label: t('bookings.unpaid') || 'غير مدفوع', pulse: true },
    failed:    { color: '#ef4444', bgcolor: '#fee2e2', label: t('bookings.payment_failed') || 'فشلت العملية', pulse: false },
    refunded:  { color: '#8b5cf6', bgcolor: '#ede9fe', label: t('bookings.refunded') || 'مسترد', pulse: false }
  }

  const getStatusConfig = (s) => statusConfig[s] || statusConfig.pending
  const getPaymentConfig = (s) => paymentConfig[s] || paymentConfig.unpaid

  if (!user) return null

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%)',
      backgroundAttachment: 'fixed',
      py: { xs: 3, md: 6 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ========== أشكال خلفية متحركة ========== */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <Box sx={{
          position: 'absolute', top: '5%', right: '-5%',
          width: { xs: 200, md: 400 }, height: { xs: 200, md: 400 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(51, 151, 184, 0.12) 0%, transparent 70%)',
          animation: 'floatBg 15s ease-in-out infinite',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: { xs: 250, md: 500 }, height: { xs: 250, md: 500 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10, 37, 64, 0.08) 0%, transparent 70%)',
          animation: 'floatBg 18s ease-in-out infinite reverse',
        }} />
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 5 }, position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Box>
            {/* ========== رأس الصفحة ========== */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              sx={{ mb: 4 ,  justifyContent:"space-between" ,
              alignItems:{ xs: 'flex-start', sm: 'center' }}}
            >
              <Grow in={true} timeout={600}>
                <Box>
                  <Typography 
                    variant="h3" 
                    fontWeight="900" 
                    sx={{ 
                      mb: 1,
                      background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {t('bookings.my_bookings') || 'حجوزاتي'} ✈️
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                    {t('bookings.subtitle') || 'جميع رحلاتك وباقاتك المحجوزة في مكان واحد'}
                  </Typography>
                </Box>
              </Grow>

              <Grow in={true} timeout={800}>
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={
                    <RefreshIcon 
                      sx={{ 
                        fontSize: 20,
                        animation: refreshing ? 'spin 1s linear infinite' : 'none',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  }
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    mt: { xs: 2, sm: 0 },
                    px: 3, py: 1.2, borderRadius: 3,
                    borderColor: '#3397b8', color: '#217490', fontWeight: 700,
                    textTransform: 'none',
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      borderColor: '#217490', 
                      bgcolor: 'rgba(51,151,184,0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(51,151,184,0.2)'
                    }
                  }}
                >
                  {refreshing ? (t('bookings.refreshing') || 'جاري التحديث...') : (t('bookings.refresh') || 'تحديث')}
                </Button>
              </Grow>
            </Stack>

            {/* ========== رسائل الخطأ ========== */}
            {error && (
              <Zoom in={true}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(239,68,68,0.15)',
                    '& .MuiAlert-icon': { fontSize: 28 }
                  }}
                >
                  {error}
                </Alert>
              </Zoom>
            )}

            {/* ========== شاشة التحميل (Skeleton) ========== */}
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 12, md: 6 }} key={i}>
                <BookingCardSkeleton />
              </Grid>
                ))}
              </Grid>
            ) : bookings.length === 0 && !error ? (
              /* ========== الحالة الفارغة ========== */
              <Zoom in={true} timeout={600}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 6 }, 
                    textAlign: 'center', 
                    borderRadius: 4,
                    border: '2px dashed', 
                    borderColor: '#cbd5e1',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(224,242,254,0.5) 100%)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* شكل زخرفي */}
                  <Box sx={{
                    position: 'absolute', top: -50, right: -50,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(51,151,184,0.1) 0%, transparent 70%)',
                    animation: 'floatBg 10s ease-in-out infinite',
                  }} />

                  <Box sx={{
                    width: 100, height: 100, mx: 'auto', mb: 3,
                    background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 40px rgba(51,151,184,0.3)',
                    animation: 'floatIcon 3s ease-in-out infinite',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      position: 'absolute', inset: -8,
                      border: '2px dashed rgba(51,151,184,0.3)',
                      borderRadius: '50%',
                      animation: 'spin 20s linear infinite',
                    }} />
                    <FlightIcon sx={{ fontSize: 50, color: 'white' }} />
                  </Box>

                  <Typography variant="h5" fontWeight="800" color="#0f172a" gutterBottom>
                    {t('bookings.no_bookings') || 'لا توجد حجوزات حتى الآن'} 🌍
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                    {t('bookings.no_bookings_desc') || 'ابدأ رحلتك الأولى واستكشف أجمل الوجهات السياحية'}
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ExploreIcon />}
                    endIcon={<ArrowIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
                    onClick={() => navigate('/trips')}
                    sx={{
                      background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                      fontWeight: 700, textTransform: 'none', 
                      px: 5, py: 1.5, borderRadius: 3,
                      fontSize: '1.05rem',
                      boxShadow: '0 8px 24px rgba(51,151,184,0.35)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute', top: 0, left: '-100%',
                        width: '100%', height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.6s',
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 32px rgba(51,151,184,0.45)',
                        '&::before': { left: '100%' }
                      }
                    }}
                  >
                    {t('bookings.explore_trips') || 'استكشف الرحلات'}
                  </Button>
                </Paper>
              </Zoom>
            ) : (
              /* ========== قائمة الحجوزات ========== */
              <>
                <Grid container spacing={3}>
                  {bookings.map((booking, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={booking.id}>
                      <Grow 
                        in={true} 
                        timeout={400 + index * 120}
                        style={{ transformOrigin: '0 0 0' }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <BookingCard
                            booking={booking}
                            getStatusConfig={getStatusConfig}
                            getPaymentConfig={getPaymentConfig}
                            isRTL={isRTL}
                            locale={locale}
                            t={t}
                            navigate={navigate}
                            onPay={handlePay}
                            paying={payingId === booking.id}
                          />
                        </Box>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>

                {pagination && pagination.totalPages > 1 && (
                  <Fade in={true} timeout={600}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                      <Pagination
                        count={pagination.totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        size="large"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'scale(1.1)' }
                          },
                          '& .Mui-selected': { 
                            bgcolor: '#3397b8 !important', 
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(51,151,184,0.35)',
                            '&:hover': { bgcolor: '#217490 !important' }
                          }
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ========== CSS Animations ========== */}
      <style>{`
        @keyframes floatBg {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
          50% { box-shadow: 0 0 0 8px transparent; opacity: 0.85; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradientBorder {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  )
}

// ==================== مكون بطاقة الحجز ====================
const BookingCard = ({ booking, getStatusConfig, getPaymentConfig, isRTL, locale, t, navigate, onPay, paying }) => {
  const isTrip = booking.bookable_type === 'trip'
  const bookable = booking.Bookable || booking.Trip || booking.Package || {}

  const rawTitle = isRTL
    ? (bookable.title_ar || bookable.name_ar)
    : (bookable.title_en || bookable.name_en)
  const title = rawTitle || `${isTrip ? (t('bookings.trip') || 'رحلة') : (t('bookings.package') || 'باقة')} #${booking.bookable_id}`

  const images = bookable.TripImages || bookable.PackageImages || bookable.images || []
  const mainImage = images.length > 0
    ? (images[0]?.image_url || images[0]?.image || (typeof images[0] === 'string' ? images[0] : null))
    : null

  const destination = isRTL ? bookable.Destination?.name_ar : bookable.Destination?.name_en

  const status = getStatusConfig(booking.status)
  const payment = getPaymentConfig(booking.payment_status)

  const total = Number(booking.total_price ?? booking.total_amount ?? 0)
  const unitPrice = Number(booking.unit_price ?? 0)
  const currency = booking.currency || 'USD'
  const bookingDate = booking.createdAt || booking.created_at

  const canPay = booking.status !== 'cancelled' && booking.payment_status !== 'paid'

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: booking.status === 'cancelled' ? 'rgba(239,68,68,0.3)' : 'rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: booking.status === 'cancelled' ? 0.85 : 1,
        position: 'relative',
        background: 'white',
        '&:hover': { 
          boxShadow: '0 20px 50px rgba(10,37,64,0.15)', 
          transform: 'translateY(-6px)',
          borderColor: 'rgba(51,151,184,0.3)',
          '& .booking-image': { transform: 'scale(1.08)' },
          '& .booking-overlay': { opacity: 1 },
          '& .booking-chip': { transform: 'translateY(-2px)' }
        }
      }}
    >
      <Box sx={{
        height: 4,
        background: `linear-gradient(90deg, ${status.color} 0%, ${payment.color} 100%)`,
        backgroundSize: '200% 100%',
        animation: status.pulse || payment.pulse ? 'gradientBorder 3s ease infinite' : 'none',
      }} />

      <Stack sx={{ height: '100%' }}>

        {/* ========== الصورة ========== */}
        <Box sx={{ 
          width: '100%', 
          height: { xs: 180, sm: 220 }, 
          bgcolor: '#e2e8f0', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          {mainImage ? (
            <Box
              component="img"
              src={getImageUrl(mainImage)}
              onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
              alt={title}
              className="booking-image"
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          ) : (
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* زخارف متحركة في الخلفية */}
              <Box sx={{
                position: 'absolute', top: -50, right: -50,
                width: 200, height: 200, borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)',
                animation: 'floatBg 8s ease-in-out infinite',
              }} />
              <Box sx={{
                position: 'absolute', bottom: -50, left: -50,
                width: 180, height: 180, borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.08)',
                animation: 'floatBg 10s ease-in-out infinite reverse',
              }} />
              {isTrip ? <FlightIcon sx={{ fontSize: 80, color: 'white', opacity: 0.4, zIndex: 1 }} /> 
                       : <PackageIcon sx={{ fontSize: 80, color: 'white', opacity: 0.4, zIndex: 1 }} />}
            </Box>
          )}

          {/* Overlay gradient */}
          <Box 
            className="booking-overlay"
            sx={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(10,37,64,0.6) 0%, transparent 50%)',
              opacity: 0.7,
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* شارة النوع */}
          <Chip
            icon={isTrip ? <FlightIcon sx={{ fontSize: 16 }} /> : <PackageIcon sx={{ fontSize: 16 }} />}
            label={isTrip ? (t('bookings.trip') || 'رحلة') : (t('bookings.package') || 'باقة')}
            size="small"
            className="booking-chip"
            sx={{
              position: 'absolute', top: 12,
              left: isRTL ? 'auto' : 12,
              right: isRTL ? 12 : 'auto',
              bgcolor: 'rgba(255,255,255,0.95)',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          />

          {/* شارة السعر */}
          <Box sx={{
            position: 'absolute', bottom: 12,
            right: isRTL ? 'auto' : 12,
            left: isRTL ? 12 : 'auto',
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            px: 1.5, py: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <Typography variant="caption" fontWeight="800" color="#3397b8" sx={{ fontSize: '0.95rem' }}>
              {total.toLocaleString()} {currency}
            </Typography>
          </Box>
        </Box>

        {/* ========== المحتوى ========== */}
        <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ mb: 1.5 , justifyContent:"space-between" , alignItems:"flex-start" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                fontWeight="800" 
                color="#0f172a" 
                gutterBottom 
                sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '1.05rem', md: '1.15rem' }
                }}
              >
                {title}
              </Typography>
              <Stack direction="row" spacing={1} sx={{flexWrap:"wrap"}}  useFlexGap>
                {/* Chip الحالة */}
                <Chip 
                  label={status.label} 
                  size="small" 
                  sx={{ 
                    bgcolor: status.bgcolor, 
                    color: status.color, 
                    fontWeight: 700, 
                    border: `1px solid ${status.color}`,
                    animation: status.pulse ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)', bgcolor: status.bgcolor }
                  }} 
                />
                {/* Chip الدفع */}
                <Chip 
                  label={payment.label} 
                  size="small" 
                  sx={{ 
                    bgcolor: payment.bgcolor, 
                    color: payment.color, 
                    fontWeight: 700, 
                    border: `1px solid ${payment.color}`,
                    animation: payment.pulse ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)', bgcolor: payment.bgcolor }
                  }} 
                />
              </Stack>
            </Box>
          </Stack>

          {/* الرقم المرجعي */}
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'inline-block', 
              mb: 1.5, 
              fontFamily: 'monospace', 
              letterSpacing: 0.5,
              bgcolor: '#f8fafc',
              px: 1.5, py: 0.5,
              borderRadius: 1.5,
              color: '#475569',
              fontWeight: 600,
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#e0f2fe',
                borderColor: '#3397b8',
                color: '#3397b8',
              }
            }} 
            dir="ltr"
          >
            # {booking.booking_ref}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          {/* ========== التفاصيل ========== */}
          <Grid container spacing={2}>
            <Grid  size={{ xs: 6, md: 7 , sm : 3}} >
              <Stack direction="row" spacing={1}  sx={{
                alignItems:"center" ,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <Box sx={{
                  width: 32, height: 32,
                  bgcolor: 'rgba(51,151,184,0.1)',
                  borderRadius: 1.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#3397b8',
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }
                }}>
                  <PeopleIcon sx={{ fontSize: 18, color: '#3397b8', transition: 'color 0.3s' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('bookings.participants') || 'المشاركون'}</Typography>
                  <Typography variant="body2" fontWeight="700">{booking.participants}</Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, sm:3}} >
              <Stack direction="row" spacing={1}  sx={{
                alignItems:"center",
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <Box sx={{
                  width: 32, height: 32,
                  bgcolor: 'rgba(51,151,184,0.1)',
                  borderRadius: 1.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#3397b8',
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }
                }}>
                  <CalendarIcon sx={{ fontSize: 18, color: '#3397b8', transition: 'color 0.3s' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('bookings.booking_date') || 'تاريخ الحجز'}</Typography>
                  <Typography variant="body2" fontWeight="700">{formatDate(bookingDate, locale)}</Typography>
                </Box>
              </Stack>
            </Grid>

            {bookable.duration_days && (
              <Grid size={{ xs: 12, sm:3}} >
                <Stack direction="row" spacing={1} sx={{
                   alignItems:"center",
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }}>
                  <Box sx={{
                    width: 32, height: 32,
                    bgcolor: 'rgba(51,151,184,0.1)',
                    borderRadius: 1.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#3397b8',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }
                  }}>
                    <ClockIcon sx={{ fontSize: 18, color: '#3397b8', transition: 'color 0.3s' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t('bookings.duration') || 'المدة'}</Typography>
                    <Typography variant="body2" fontWeight="700">{bookable.duration_days} {t('common.days') || 'يوم'}</Typography>
                  </Box>
                </Stack>
              </Grid>
            )}

            {destination && (
              <Grid size={{ xs: 6, sm:3 }} >
                <Stack direction="row" spacing={1}  sx={{
                  alignItems:"center",
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }}>
                  <Box sx={{
                    width: 32, height: 32,
                    bgcolor: 'rgba(51,151,184,0.1)',
                    borderRadius: 1.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#3397b8',
                      '& .MuiSvgIcon-root': { color: 'white' }
                    }
                  }}>
                    <LocationIcon sx={{ fontSize: 18, color: '#3397b8', transition: 'color 0.3s' }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">{t('bookings.destination') || 'الوجهة'}</Typography>
                    <Typography variant="body2" fontWeight="700" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {destination}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            )}
          </Grid>

          {/* ========== سبب الإلغاء ========== */}
          {booking.status === 'cancelled' && booking.cancellation_reason && (
            <Zoom in={true}>
              <Alert 
                severity="warning" 
                icon={<CancelIcon fontSize="small" />} 
                sx={{ 
                  mt: 2, 
                  borderRadius: 2, 
                  py: 0.5,
                  border: '1px solid #fcd34d',
                  bgcolor: '#fffbeb',
                  '& .MuiAlert-icon': { color: '#f59e0b' }
                }}
              >
                <Typography variant="caption" fontWeight="600">
                  {t('bookings.cancellation_reason') || 'سبب الإلغاء'}: {booking.cancellation_reason}
                </Typography>
              </Alert>
            </Zoom>
          )}

          {/* ========== الأزرار ========== */}
          <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
            <Button
              size="medium"
              variant="outlined"
              startIcon={<ViewIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate(isTrip ? `/tours/${booking.bookable_id}` : `/packages/${booking.bookable_id}`)}
              sx={{ 
                flex: 1, 
                borderRadius: 2.5, 
                borderColor: '#3397b8', 
                color: '#3397b8', 
                fontWeight: 700, 
                textTransform: 'none', 
                py: 1.2,
                borderWidth: 2,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 0,
                },
                '& .MuiButton-startIcon, & .MuiButton-label': { position: 'relative', zIndex: 1 },
                '&:hover': { 
                  bgcolor: 'transparent',
                  borderColor: '#3397b8',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(51,151,184,0.3)',
                  '&::before': { opacity: 1 }
                }
              }}
            >
              {t('bookings.view_details') || 'عرض التفاصيل'}
            </Button>

            {canPay && (
              <Button
                size="medium"
                variant="contained"
                disabled={paying}
                startIcon={paying ? <CircularProgress size={18} color="inherit" /> : <PaymentIcon sx={{ fontSize: 18 }} />}
                onClick={() => onPay(booking)}
                sx={{
                  flex: 1, 
                  borderRadius: 2.5, 
                  fontWeight: 800, 
                  textTransform: 'none', 
                  py: 1.2,
                  background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                  boxShadow: '0 4px 16px rgba(51,151,184,0.35)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: '-100%',
                    width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2.5s infinite',
                  },
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(51,151,184,0.5)',
                  },
                  '&:disabled': {
                    background: '#cbd5e1',
                    boxShadow: 'none',
                    '&::before': { display: 'none' }
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {paying ? (t('bookings.processing') || 'جاري المعالجة...') : (t('bookings.pay_now') || 'ادفع الآن 💳')}
                </Box>
              </Button>
            )}
          </Stack>
        </CardContent>
      </Stack>
    </Card>
  )
}