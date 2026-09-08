import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import api from '../../API/axios'
import { PageLoader } from '../../components/Ui/Loading'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../components/utils/imageHelper'
import { submitToSamaPay } from '../../components/utils/samapay'
import { BRAND, gradientTextSx, gradientButtonSx, statIconBoxSx, statusStripeSx } from '../../components/styles/animations'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import {
  Container, Grid, Box, Card, CardContent, Typography, Stack, TextField, InputAdornment,
  Button, Divider, Alert, CircularProgress, Paper, Chip, Fade, IconButton,
  Stepper, Step, StepLabel, Tooltip
} from '@mui/material'
import {
  Add as AddIcon, Remove as RemoveIcon,
  FlightTakeoff as FlightIcon, Security as SecurityIcon,
  Person as PersonIcon, Phone as PhoneIcon, CreditCard as CreditCardIcon,
  Badge as BadgeIcon, RemoveCircle as DeleteIcon, ArrowBack as ArrowBackIcon,
  AccessTime as ClockIcon, LocationOn as LocationIcon,
  CheckCircle as CheckIcon, Info as InfoIcon, People as PeopleIcon,
  Luggage as LuggageIcon, StickyNote2 as NotesIcon, Shield as ShieldIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material'

// ========== أنماط مشتركة (تقليل التكرار) ==========
const sectionCardSx = {
  borderRadius: 2,
  border: '1px solid rgba(0,0,0,0.06)',
  overflow: 'hidden',
  bgcolor: 'white',
}

const textFieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' },
}

// رأس البطاقة المتدرج
const headerBoxSx = {
  p: 3,
  background: BRAND.gradient,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
}

// ✅ مربع الأيقونة في الرأس (44×44 متناسق)
const headerIconSx = {
  width: 44,
  height: 44,
  bgcolor: 'rgba(255,255,255,0.2)',
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

// ========== مكونات فرعية قابلة لإعادة الاستخدام ==========

/** عنصر إحصائية مع أيقونة (المدة، الانطلاق، المقاعد) */
const InfoStat = ({ icon, label, value, color = BRAND.primary, valueSx = {} }) => (
  <Stack
    direction="row"
    spacing={1.5}
    sx={{ flex: 1, alignItems: 'center', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
  >
    <Box sx={statIconBoxSx}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography
        variant="body2"
        fontWeight="700"
        color={color}
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...valueSx }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
)

/** بطاقة مسافر واحدة مع شريط تقدم */
const PassengerCard = ({ passenger, index, total, t, onChange, onRemove }) => {
  const filledCount = [passenger.name, passenger.phone, passenger.id_number].filter(v => v?.trim()).length
  const isComplete = filledCount === 3

  // حقول المسافر (تقليل التكرار)
  const fields = [
    { field: 'name', label: t('booking.full_name', 'الاسم الكامل'), Icon: PersonIcon },
    { field: 'phone', label: t('booking.phone', 'رقم الهاتف'), Icon: PhoneIcon },
    { field: 'id_number', label: t('booking.id_number', 'رقم الهوية'), Icon: BadgeIcon },
  ]

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 }, borderRadius: 3,
          bgcolor: isComplete ? '#f0fdf4' : '#f8fafc',
          border: '1.5px solid',
          borderColor: isComplete ? '#bbf7d0' : 'rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
        }}
      >
        {/* شريط التقدم العلوي */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, height: 3,
          width: `${(filledCount / 3) * 100}%`,
          background: isComplete ? '#10b981' : BRAND.gradient,
          transition: 'width 0.4s ease'
        }} />

        {/* رأس البطاقة: الرقم + الاسم + زر الحذف */}
        <Stack direction="row" sx={{ mb: 2, mt: 0.5, alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{
              width: 32, height: 32,
              bgcolor: isComplete ? '#10b981' : BRAND.primary,
              color: 'white', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}>
              {isComplete ? <CheckIcon sx={{ fontSize: 18 }} /> : index + 1}
            </Box>
            <Typography fontWeight="700" color="#0f172a">
              {t('booking.passenger', 'المسافر')} {index + 1}
            </Typography>
            <Typography variant="caption" color="#64748b">({filledCount}/3)</Typography>
          </Stack>

          {total > 1 && (
            <Tooltip title={t('booking.remove', 'حذف')}>
              <IconButton
                onClick={() => onRemove(index)}
                size="small"
                sx={{ color: '#ef4444', transition: 'all 0.3s ease', '&:hover': { bgcolor: '#fef2f2', transform: 'rotate(90deg)' } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {/* حقول المسافر */}
        <Stack spacing={2}>
          {fields.map(({ field, label, Icon }) => (
            <TextField
              key={field}
              fullWidth
              required
              size="small"
              label={label}
              value={passenger[field]}
              onChange={(e) => onChange(index, field, e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon sx={{ color: passenger[field]?.trim() ? '#10b981' : '#94a3b8', transition: 'color 0.3s' }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={textFieldSx}
            />
          ))}
        </Stack>
      </Paper>
    </Grid>
  )
}

// ========== المكون الرئيسي ==========
export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const { user } = useApp()
  const isRTL = i18n.language?.startsWith('ar')

  // تحديد نوع المحجوز: رحلة أم باقة
  const bookableType = location.pathname.includes('/booking/package') || new URLSearchParams(location.search).get('type') === 'package'
    ? 'package' : 'trip'

  const [bookable, setBookable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // ========== حالات الحجز ==========
  const [participants, setParticipants] = useState(1)
  const [notes, setNotes] = useState('')
  const [passengerDetails, setPassengerDetails] = useState([{
    name: user?.first_name ? `${user.first_name} ${user.last_name}` : '',
    phone: user?.phone || '',
    id_number: ''
  }])

  // ========== جلب بيانات الرحلة/الباقة ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const endpoint = bookableType === 'package' ? 'packages' : 'trips'
        const { data } = await api.get(`/${endpoint}/${id}`)
        setBookable(data.data || data.package || data.trip || data)
      } catch (err) {
        setError(t('booking.error_loading', 'فشل تحميل البيانات'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, bookableType, t])

  // ========== شاشة التحميل ==========
  if (loading) return <PageLoader />

  // ========== شاشة الخطأ ==========
  if (error || !bookable) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <AnimatedBackground />
        <Container sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(239,68,68,0.15)' }}>
            {error || t('booking.not_found', 'لم يتم العثور على البيانات')}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate(bookableType === 'package' ? '/packages' : '/trips')}
            sx={{ ...gradientButtonSx, borderRadius: 2.5, textTransform: 'none', fontWeight: 700, px: 4, py: 1.3 }}
          >
            {t('common.back', 'العودة')}
          </Button>
        </Container>
      </Box>
    )
  }

  // ========== حسابات الأسعار ==========
  const price = Number(bookable.discount_price || bookable.price || bookable.amount || 0)
  const originalPrice = bookable.discount_price ? Number(bookable.price) : null
  const currency = bookable.currency || 'USD'
  const seats = Math.max(0, (bookable.max_participants || bookable.capacity || 20) - (bookable.current_participants || 0))
  const total = price * participants
  const discount = originalPrice ? ((originalPrice - price) * participants) : 0

  // ========== اكتمال بيانات المسافرين (لتقديم الخطوة في الـ Stepper) ==========
  const isInfoComplete = bookableType === 'package' ||
    passengerDetails.every(p => p.name?.trim() && p.phone?.trim() && p.id_number?.trim())
  const activeStep = isInfoComplete ? 1 : 0

  // ========== معالجات الأحداث ==========
  const handlePassengerChange = (index, field, value) => {
    setPassengerDetails((current) => current.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }

  const handleParticipantsChange = (nextValue) => {
    const nextParticipants = Math.max(1, Math.min(seats || 1, nextValue))
    setParticipants(nextParticipants)
    setPassengerDetails((current) =>
      Array.from({ length: nextParticipants }, (_, i) => current[i] || { name: '', phone: '', id_number: '' })
    )
  }

  const addPassenger = () => {
    if (passengerDetails.length < seats) handleParticipantsChange(participants + 1)
  }

  const removePassenger = (index) => {
    if (passengerDetails.length > 1) {
      const newList = passengerDetails.filter((_, i) => i !== index)
      setPassengerDetails(newList)
      setParticipants(newList.length)
    }
  }

  // ========== تأكيد الحجز + بدء الدفع عبر SamaPay ==========
  const handleConfirmBooking = async () => {
    // التحقق من اكتمال بيانات المسافرين (للرحلات فقط)
    if (bookableType === 'trip' && !isInfoComplete) {
      alert(t('booking.fill_passengers', 'يرجى إكمال بيانات جميع المسافرين'))
      return
    }

    setSubmitting(true)
    try {
      // 1) إنشاء الحجز في السيرفر
      const payload = {
        bookable_type: bookableType,
        bookable_id: Number(id),
        participants,
        ...(bookableType === 'trip' ? { notes, passenger_details: passengerDetails } : {})
      }
      const response = await api.post('/bookings', payload)
      const newBooking = response.data.data || response.data

      // 2) بدء عملية الدفع: POST /payments/initiate/{bookingId}
      try {
        const payRes = await api.post(`/payments/initiate/${newBooking.id}`)
        const paymentData = payRes.data.data || payRes.data

        // 3) إذا رجعت البوابة بيانات النموذج → إرسال تلقائي لـ SamaPay
        if (paymentData?.form_data) {
          await submitToSamaPay(paymentData)
          return // المتصفح سينتقل لبوابة الدفع
        }
      } catch (payErr) {
        console.error('Payment initiation failed:', payErr)
        // في حال فشل بدء الدفع نكمل لصفحة النجاح ليعيد المحاولة لاحقاً
      }

      // 4) Fallback: التوجيه لصفحة نجاح الحجز
      navigate('/booking-success', {
        state: { bookingId: newBooking.id, bookingRef: newBooking.booking_ref, total, currency }
      })
    } catch (err) {
      console.error('فشل الحجز:', err)
      alert(err.response?.data?.message || t('booking.failed', 'حدث خطأ أثناء الحجز'))
    } finally {
      setSubmitting(false)
    }
  }

  // ========== البيانات للعرض ==========
  const title = isRTL ? (bookable.title_ar || bookable.name_ar) : (bookable.title_en || bookable.name_en)
  const mainImages = bookable.TripImages || bookable.PackageImages || bookable.images || []
  const mainImage = Array.isArray(mainImages) && mainImages.length > 0
    ? getImageUrl(mainImages[0]?.image_url || mainImages[0]?.image || mainImages[0])
    : PLACEHOLDER_IMAGE
  const destination = isRTL ? bookable.Destination?.name_ar : bookable.Destination?.name_en
  const departure = isRTL ? bookable.departure_location_ar : bookable.departure_location_en

  // خطوات الحجز
  const steps = [
    t('booking.step_info', 'بيانات المسافرين'),
    t('booking.step_review', 'مراجعة الحجز'),
    t('booking.step_payment', 'الدفع')
  ]

  return (
    <Box dir={isRTL ? 'rtl' : 'ltr'} sx={{
      minHeight: '100vh',
      background: BRAND.pageBg,
      backgroundAttachment: 'fixed',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>

        {/* ========== زر العودة ========== */}
        <Fade in={true}>
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
            sx={{
              mb: 3, color: '#475569', fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': { color: BRAND.primary, bgcolor: 'rgba(51,151,184,0.05)', transform: 'translateX(-4px)' }
            }}
          >
            {t('booking.back_to_trip', 'العودة لتفاصيل الرحلة')}
          </Button>
        </Fade>

        {/* ========== العنوان الرئيسي ========== */}
        <Fade in={true}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h3"
              fontWeight="900"
              sx={{
                ...gradientTextSx,
                mb: 1,
                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              {bookableType === 'package'
                ? t('booking.package_booking', 'حجز باقة سياحية')
                : t('booking.trip_booking', 'حجز رحلة سياحية')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('booking.page_subtitle', 'أكمل خطوات الحجز بسهولة وأمان')}
            </Typography>
          </Box>
        </Fade>

        {/* ========== خطوات الحجز (Stepper) ========== */}
        <Paper elevation={0} sx={{
          p: { xs: 2, md: 3 }, mb: 4,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.06)',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'white'
        }}>
          {/* شريط التقدم العلوي */}
          <Box sx={statusStripeSx(BRAND.primary, BRAND.primaryDark, false)} />

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                 slotProps={{
                  icon: {
                  sx: {
                  color: index <= activeStep ? BRAND.primary : '#cbd5e1',
                  fontSize: '2rem',
                  transition: 'all 0.3s ease',
                  ...(index === activeStep && { transform: 'scale(1.15)' })
                  }
                  }
                }}
                >
                  <Typography sx={{
                    fontWeight: index === activeStep ? 700 : 500,
                    color: index <= activeStep ? BRAND.primary : '#64748b',
                    transition: 'all 0.3s ease'
                  }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* ========== ✅ الشبكة المصححة: 7 + 5 = 12 بدون flex override ========== */}
        <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>

          {/* ============ القسم الأيمن: نموذج الحجز ============ */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* ========== بطاقة معلومات الرحلة/الباقة ========== */}
            <Fade in={true} timeout={600}>
              <Card elevation={0} sx={{ ...sectionCardSx, mb: 3 }}>
                <Box sx={{
                  height: { xs: 160, md: 200 },
                  background: `linear-gradient(rgba(10,37,64,0.5), rgba(10,37,64,0.7)), url(${mainImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
                  <Box sx={{ p: 3, color: 'white', width: '100%' }}>
                    <Chip
                      icon={bookableType === 'package' ? <LuggageIcon /> : <FlightIcon />}
                      label={bookableType === 'package'
                        ? t('booking.package_booking', 'باقة سياحية')
                        : t('booking.trip_booking', 'رحلة سياحية')}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        mb: 1.5,
                        backdropFilter: 'blur(10px)',
                        fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    />
                    <Typography variant="h5" fontWeight="800" sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                      {title}
                    </Typography>
                    {destination && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
                        <LocationIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{destination}</Typography>
                      </Stack>
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
                  >
                    {bookable.duration_days && (
                      <InfoStat
                        icon={<ClockIcon sx={{ color: BRAND.primary, transition: 'color 0.3s' }} />}
                        label={t('booking.duration', 'المدة')}
                        value={`${bookable.duration_days} ${t('common.days', 'أيام')}`}
                      />
                    )}
                    {departure && (
                      <InfoStat
                        icon={<LocationIcon sx={{ color: BRAND.primary, transition: 'color 0.3s' }} />}
                        label={t('booking.departure', 'نقطة الانطلاق')}
                        value={departure}
                        valueSx={{ fontSize: '0.85rem' }}
                      />
                    )}
                    <InfoStat
                      icon={<PeopleIcon sx={{ color: seats > 5 ? '#10b981' : '#ef4444', transition: 'color 0.3s' }} />}
                      label={t('booking.available_seats', 'المقاعد المتاحة')}
                      value={`${seats} ${t('booking.seats', 'مقعد')}`}
                      color={seats > 5 ? '#10b981' : '#ef4444'}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Fade>

            {/* ========== بطاقة بيانات المسافرين ========== */}
            <Fade in={true} timeout={800}>
              <Card elevation={0} sx={sectionCardSx}>
                <Box sx={headerBoxSx}>
                  <Box sx={headerIconSx}><PeopleIcon /></Box>
                  <Box>
                    <Typography variant="h6" fontWeight="800">
                      {bookableType === 'package'
                        ? t('booking.package_booking', 'حجز الباقة')
                        : t('booking.passenger_info', 'بيانات المسافرين')}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {bookableType === 'package'
                        ? t('booking.package_desc', 'حدد عدد المشاركين لإتمام الحجز')
                        : t('booking.trip_desc', 'أدخل بيانات كل مسافر بشكل صحيح')}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack spacing={3}>

                    {/* ========== عداد المشاركين ========== */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700" sx={{
                        mb: 1.5, color: '#0f172a',
                        display: 'flex', alignItems: 'center', gap: 0.5
                      }}>
                        <PeopleIcon sx={{ fontSize: 18, color: BRAND.primary }} />
                        {t('booking.participants', 'عدد المشاركين')}
                      </Typography>
                      <Stack direction="row" sx={{
                        border: '2px solid #e2e8f0',
                        borderRadius: 2,
                        alignItems: 'center',
                        bgcolor: '#f8fafc',
                        maxWidth: 220,
                        overflow: 'hidden',
                        transition: 'border-color 0.3s ease',
                        '&:hover': { borderColor: BRAND.primary }
                      }}>
                        <IconButton
                          onClick={() => handleParticipantsChange(participants - 1)}
                          disabled={participants <= 1}
                          sx={{ borderRadius: 0, color: BRAND.primary, '&:hover': { bgcolor: 'rgba(51,151,184,0.1)' } }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{
                          flex: 1, textAlign: 'center', fontWeight: 800,
                          fontSize: '1.3rem', color: '#0f172a'
                        }}>
                          {participants}
                        </Typography>
                        <IconButton
                          onClick={() => handleParticipantsChange(participants + 1)}
                          disabled={participants >= seats}
                          sx={{ borderRadius: 0, color: BRAND.primary, '&:hover': { bgcolor: 'rgba(51,151,184,0.1)' } }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* ========== بطاقات المسافرين (للرحلات فقط) ========== */}
                    {bookableType === 'trip' && (
                      <>
                        <Grid container spacing={2}>
                          {passengerDetails.map((passenger, index) => (
                            <PassengerCard
                              key={index}
                              passenger={passenger}
                              index={index}
                              total={passengerDetails.length}
                              t={t}
                              onChange={handlePassengerChange}
                              onRemove={removePassenger}
                            />
                          ))}
                        </Grid>

                        {/* زر إضافة مسافر */}
                        {passengerDetails.length < seats && (
                          <Button
                            variant="outlined"
                            onClick={addPassenger}
                            startIcon={<AddIcon />}
                            sx={{
                              alignSelf: 'flex-start',
                              borderColor: BRAND.primary,
                              color: BRAND.primary,
                              fontWeight: 700,
                              textTransform: 'none',
                              borderWidth: 2,
                              borderRadius: 2.5,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: BRAND.primaryDark,
                                bgcolor: 'rgba(51,151,184,0.05)',
                                transform: 'translateY(-2px)',
                                borderWidth: 2,
                              }
                            }}
                          >
                            {t('booking.add_passenger', 'إضافة مسافر')}
                          </Button>
                        )}

                        {/* ========== ملاحظات إضافية ========== */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="700" sx={{
                            mb: 1.5, color: '#0f172a',
                            display: 'flex', alignItems: 'center', gap: 0.5
                          }}>
                            <NotesIcon sx={{ fontSize: 18, color: BRAND.primary }} />
                            {t('booking.additional_notes', 'ملاحظات إضافية')}
                            <Typography component="span" variant="caption" color="text.secondary">
                              ({t('common.optional', 'اختياري')})
                            </Typography>
                          </Typography>
                          <TextField
                            fullWidth
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            multiline rows={3}
                            placeholder={t('booking.notes_placeholder', 'اكتب أي متطلبات خاصة هنا...')}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Box>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* ============ القسم الأيسر: ملخص الحجز (md:5) ============ */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Fade in={true} timeout={1000}>
              <Card elevation={0} sx={{
                ...sectionCardSx,
                position: 'sticky',
                top: 96,
                boxShadow: '0 10px 40px rgba(10,37,64,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: '0 15px 50px rgba(10,37,64,0.12)' }
              }}>
                {/* رأس الملخص */}
                <Box sx={headerBoxSx}>
                  <Box sx={headerIconSx}><CreditCardIcon sx={{ fontSize: 26 }} /></Box>
                  <Typography variant="h6" fontWeight="800">
                    {t('booking.summary', 'ملخص الحجز')}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {/* صورة الرحلة + العنوان */}
                  <Box sx={{
                    display: 'flex', gap: 2, pb: 2.5, mb: 2.5,
                    borderBottom: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <Box
                      component="img"
                      src={mainImage}
                      sx={{
                        width: 80, height: 80, borderRadius: 2, objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight="700" sx={{
                        lineHeight: 1.3, mb: 0.5,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {title}
                      </Typography>
                      {bookable.duration_days && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          <ClockIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                          {bookable.duration_days} {t('common.days', 'أيام')}
                        </Typography>
                      )}
                      {destination && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                          <LocationIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                          {destination}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* تفاصيل السعر */}
                  <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                    {[
                      { label: t('booking.price_per_person', 'السعر للفرد'), value: `${price.toLocaleString()} ${currency}` },
                      { label: t('booking.participants', 'عدد المشاركين'), value: `× ${participants}` },
                      { label: t('booking.subtotal', 'المجموع الفرعي'), value: `${(price * participants).toLocaleString()} ${currency}` },
                    ].map((row, idx) => (
                      <Stack key={idx} direction="row" sx={{ justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">{row.label}</Typography>
                        <Typography fontWeight="600">{row.value}</Typography>
                      </Stack>
                    ))}

                    {/* صف الخصم (إن وجد) */}
                    {originalPrice && (
                      <Stack direction="row" sx={{
                        justifyContent: 'space-between',
                        p: 1.5, bgcolor: '#fef2f2', borderRadius: 2,
                        border: '1px solid #fecaca',
                        animation: 'pulseGlow 2s ease-in-out infinite'
                      }}>
                        <Typography sx={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                          <OfferIcon sx={{ fontSize: 16 }} />
                          {t('booking.discount', 'الخصم')}
                        </Typography>
                        <Typography sx={{ color: '#dc2626', fontWeight: 700 }}>
                          - {discount.toLocaleString()} {currency}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Divider sx={{ mb: 2.5 }} />

                  {/* الإجمالي مع لمعان */}
                  <Box sx={{
                    p: 2.5, borderRadius: 2,
                    background: BRAND.gradient,
                    color: 'white', mb: 3,
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <Box className="shimmer-effect" sx={{ position: 'absolute', inset: 0 }} />
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.95 }}>
                        {t('booking.total', 'الإجمالي')}
                      </Typography>
                      <Typography variant="h5" fontWeight="800">
                        {total.toLocaleString()} {currency}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* زر التأكيد والدفع */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleConfirmBooking}
                    disabled={submitting || seats === 0}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <ShieldIcon />}
                    sx={{
                      ...gradientButtonSx,
                      py: 2, fontWeight: 700, fontSize: '1.05rem',
                      borderRadius: 2.5, textTransform: 'none',
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {submitting
                        ? t('booking.processing', 'جاري المعالجة...')
                        : seats === 0
                          ? t('booking.sold_out', 'نفدت المقاعد')
                          : t('booking.confirm_and_pay', 'تأكيد الحجز والدفع 💳')}
                    </Box>
                  </Button>

                  {/* رسالة الأمان */}
                  <Stack direction="row" spacing={1} sx={{ mt: 2, px: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <SecurityIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {t('booking.secure_payment', 'بياناتك محمية عبر بوابة SamaPay الآمنة')}
                    </Typography>
                  </Stack>

                  {/* معلومات إضافية */}
                  <Box sx={{
                    mt: 2.5, p: 2, borderRadius: 2,
                    bgcolor: '#f0f9ff', border: '1px solid #bae6fd'
                  }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                      <InfoIcon sx={{ fontSize: 18, color: '#0284c7' }} />
                      <Typography variant="caption" fontWeight="700" color="#0c4a6e">
                        {t('booking.info_title', 'معلومات مهمة')}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="#0c4a6e" sx={{ display: 'block', lineHeight: 1.6 }}>
                      {t('booking.info_text', 'سيتم توجيهك لبوابة الدفع الآمنة (SamaPay) بعد تأكيد الحجز. يمكنك إلغاء الحجز مجاناً قبل 7 أيام من موعد الرحلة.')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}