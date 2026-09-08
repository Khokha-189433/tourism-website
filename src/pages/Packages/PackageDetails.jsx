import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../API/axios'
import { PageLoader } from '../../components/Ui/Loading'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../components/utils/imageHelper'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import GradientText from '../../components/Ui/GradientText'
import ReviewsSection from '../../components/Ui/ReviewsSection' 
import FavoriteButton from '../../components/Ui/FavoriteButton'
import { BRAND, gradientButtonSx, statIconBoxSx } from '../../components/styles/animations'
import {
  Container, Grid, Box, Typography, Stack, Card, CardContent, Chip,
  Button, Divider, Alert, Fade, Grow, Paper,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as ClockIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  FlightTakeoff as FlightIcon,
  Hotel as HotelIcon,
  DirectionsBus as BusIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Shield as ShieldIcon,
  Share as ShareIcon,
  FavoriteBorder as FavoriteIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  Restaurant as RestaurantIcon,
  Pool as PoolIcon,
  Spa as SpaIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material'

export default function PackageDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPackage()
  }, [id])

  const fetchPackage = async () => {
    try {
      setLoading(true)
      setError(null)

      const numericId = /^\d+$/.test(id) ? id : null
      if (!numericId) {
        throw new Error('Invalid package ID')
      }

      const { data } = await api.get(`/packages/${numericId}`)
      setPkg(data.data || data.package || data)
    } catch (err) {
      console.error('Fetch package error:', err)
      if (err.response?.status === 404) {
        setError(t('packages.not_found', 'لم يتم العثور على الباقة'))
      } else {
        setError(t('packages.fetch_error', 'فشل تحميل تفاصيل الباقة'))
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader />

  if (error || !pkg) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <AnimatedBackground />
        <Container sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(239,68,68,0.15)' }}>
            {error || t('packages.not_found', 'لم يتم العثور على الباقة')}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/packages')}
            sx={{ ...gradientButtonSx, borderRadius: 2.5, textTransform: 'none', fontWeight: 700, px: 4, py: 1.3 }}
          >
            {t('packages.back_to_list', 'العودة للباقات')}
          </Button>
        </Container>
      </Box>
    )
  }

  const title = isRTL ? pkg.title_ar : pkg.title_en
  const description = isRTL ? pkg.description_ar : pkg.description_en
  const includedServices = isRTL ? pkg.included_services_ar : pkg.included_services_en
  const mainImage = pkg.image ? getImageUrl(pkg.image) : PLACEHOLDER_IMAGE

  const price = Number(pkg.discount_price || pkg.price || 0)
  const originalPrice = pkg.discount_price ? Number(pkg.price) : null
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const currency = pkg.currency || 'SYP'

  const seatsLeft = (pkg.max_participants || 0) - (pkg.current_participants || 0)
  const rating = Number(pkg.average_rating || 0)
  const reviewsCount = pkg.total_reviews || 0

  const servicesList = includedServices
    ? includedServices.split(/\n|,|،/).map(s => s.trim()).filter(Boolean)
    : []

  const amenityIcons = {
    wifi: WifiIcon, pool: PoolIcon, spa: SpaIcon,
    restaurant: RestaurantIcon, parking: ParkingIcon,
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: BRAND.pageBg,
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <AnimatedBackground />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>

        {/* زر العودة */}
        <Fade in={true}>
          <Button
            variant="text"
            onClick={() => navigate('/packages')}
            startIcon={<ArrowBackIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
            sx={{
              mb: 3, color: '#475569', fontWeight: 600, textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': { color: BRAND.primary, bgcolor: 'rgba(51,151,184,0.05)', transform: 'translateX(-4px)' },
            }}
          >
            {t('packages.back_to_list', 'العودة للباقات')}
          </Button>
        </Fade>

        {/* ✅ الشبكة الرئيسية بخاصية size */}
        <Grid container spacing={{ xs: 3, md: 4 }}>

          {/* ========== القسم الأيمن: المحتوى الرئيسي ========== */}
          <Grid size={{ xs: 12, md: 8 }}>

            <Fade in={true} timeout={600}>
              <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                {/* الصورة الرئيسية */}
                <Box sx={{ position: 'relative', height: { xs: 250, md: 400 }, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={mainImage}
                    alt={title}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,37,64,0.85) 0%, rgba(10,37,64,0.2) 50%, transparent 100%)',
                  }} />

                  {/* شارة الخصم */}
                  {discountPercent > 0 && (
                    <Chip
                      icon={<OfferIcon />}
                      label={`-${discountPercent}% ${t('packages.discount', 'خصم')}`}
                      sx={{
                        position: 'absolute', top: 20,
                        left: isRTL ? 'auto' : 20,
                        right: isRTL ? 20 : 'auto',
                        bgcolor: '#ef4444', color: 'white', fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
                      }}
                    />
                  )}

                  {/* أزرار المشاركة والمفضلة */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: isRTL ? 'auto' : 16,
                      left: isRTL ? 16 : 'auto',
                      zIndex: 2,
                    }}
                  >
                    {/* زر المفضلة ❤️ */}
                    <FavoriteButton type="package" id={pkg.id} />

                    {/* زر المشاركة */}
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: 40, width: 44, height: 44, p:0,
                        bgcolor: 'rgba(255,255,255,0.2)', color: 'white',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', transform: 'scale(1.08)' },
                      }}
                     >
                      <ShareIcon />
                    </Button>
                  </Stack>
                  {/* العنوان على الصورة */}
                  <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: 'white' }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                      {rating > 0 && (
                        <Chip
                          icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: 16 }} />}
                          label={`${rating.toFixed(1)} (${reviewsCount})`}
                          size="small"
                          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, backdropFilter: 'blur(10px)' }}
                        />
                      )}
                      <Chip
                        icon={<ClockIcon sx={{ fontSize: 16 }} />}
                        label={`${pkg.duration_days} ${t('common.days', 'أيام')}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, backdropFilter: 'blur(10px)' }}
                      />
                    </Stack>
                    <Typography variant="h3" fontWeight="900" sx={{
                      fontSize: { xs: '1.6rem', md: '2.2rem' },
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>
                      {title}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  {/* ✅ إحصائيات سريعة - Grid size المصححة */}
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <InfoStat
                        icon={<CalendarIcon sx={{ color: BRAND.primary }} />}
                        label={t('packages.start_date', 'تاريخ البدء')}
                        value={new Date(pkg.start_date).toLocaleDateString(isRTL ? 'ar-SY' : 'en-US', { day: 'numeric', month: 'short' })}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <InfoStat
                        icon={<ClockIcon sx={{ color: BRAND.primary }} />}
                        label={t('packages.duration', 'المدة')}
                        value={`${pkg.duration_days} ${t('common.days', 'أيام')}`}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <InfoStat
                        icon={<PeopleIcon sx={{ color: seatsLeft > 5 ? '#10b981' : '#ef4444' }} />}
                        label={t('packages.available_seats', 'المقاعد المتاحة')}
                        value={seatsLeft}
                        color={seatsLeft > 5 ? '#10b981' : '#ef4444'}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <InfoStat
                        icon={<FlightIcon sx={{ color: BRAND.primary }} />}
                        label={t('packages.included_trips', 'الرحلات')}
                        value={pkg.trips?.length || 0}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ mb: 3 }} />

                  {/* الوصف */}
                  <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom>
                    {t('packages.about', 'عن الباقة')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4, whiteSpace: 'pre-line' }}>
                    {description}
                  </Typography>

                  {/* الخدمات المضمنة */}
                  {servicesList.length > 0 && (
                    <>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckIcon sx={{ color: '#10b981' }} />
                        {t('packages.included_services', 'الخدمات المضمنة')}
                      </Typography>
                      {/* ✅ Grid size المصححة للخدمات */}
                      <Grid container spacing={1.5} sx={{ mb: 4 }}>
                        {servicesList.map((service, idx) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                            <Stack direction="row" spacing={1}  sx={{
                              alignItems:"center",
                              p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2,
                              border: '1px solid #bbf7d0',
                              transition: 'all 0.3s ease',
                              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(16,185,129,0.15)' },
                            }}>
                              <CheckIcon sx={{ fontSize: 18, color: '#10b981', flexShrink: 0 }} />
                              <Typography variant="body2" fontWeight="600" color="#065f46">
                                {service}
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}

                  {/* الرحلات المضمنة */}
                  {pkg.trips && pkg.trips.length > 0 && (
                    <>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlightIcon sx={{ color: BRAND.primary }} />
                        {t('packages.included_trips', 'الرحلات المضمنة')} ({pkg.trips.length})
                      </Typography>
                      <Stack spacing={2} sx={{ mb: 4 }}>
                        {pkg.trips.map((trip, idx) => {
                          const tripTitle = isRTL ? trip.title_ar : trip.title_en
                          const tripDesc = isRTL ? trip.short_description_ar || trip.description_ar : trip.short_description_en || trip.description_en
                          const tripImage = trip.images?.[0]?.image_url ? getImageUrl(trip.images[0].image_url) : null
                          const destination = isRTL ? trip.Destination?.name_ar : trip.Destination?.name_en

                          return (
                            <Paper
                              key={trip.id}
                              elevation={0}
                              sx={{
                                p: 2, borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)', borderColor: 'rgba(51,151,184,0.3)' },
                              }}
                              onClick={() => navigate(`/tours/${trip.id}`)}
                            >
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {tripImage && (
                                  <Box
                                    component="img"
                                    src={tripImage}
                                    alt={tripTitle}
                                    sx={{ width: { xs: '100%', sm: 100 }, height: { xs: 150, sm: 100 }, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                                  />
                                )}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                                    <Chip
                                      label={`${idx + 1}`}
                                      size="small"
                                      sx={{
                                        bgcolor: BRAND.gradient, color: 'white', fontWeight: 800,
                                        minWidth: 28, height: 28,
                                      }}
                                    />
                                    <Typography variant="subtitle1" fontWeight="700" color="#0f172a" sx={{
                                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                      {tripTitle}
                                    </Typography>
                                  </Stack>
                                  {destination && (
                                    <Stack direction="row" spacing={0.5}  sx={{ mb: 0.5 , alignItems:"center" }}>
                                      <LocationIcon sx={{ fontSize: 14, color: '#64748b' }} />
                                      <Typography variant="caption" color="text.secondary">{destination}</Typography>
                                    </Stack>
                                  )}
                                  <Typography variant="body2" color="text.secondary" sx={{
                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                  }}>
                                    {tripDesc}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          )
                        })}
                      </Stack>
                    </>
                  )}

                  {/* الفنادق */}
                  {pkg.hotels && pkg.hotels.length > 0 && (
                    <>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HotelIcon sx={{ color: BRAND.primary }} />
                        {t('packages.hotels', 'الفنادق')} ({pkg.hotels.length})
                      </Typography>
                      <Stack spacing={2} sx={{ mb: 4 }}>
                        {pkg.hotels.map((hotel) => {
                          const hotelName = isRTL ? hotel.name_ar : hotel.name_en
                          const hotelDesc = isRTL ? hotel.description_ar : hotel.description_en
                          const nights = hotel.PackageHotel?.nights || 0
                          const hotelImage = hotel.image ? getImageUrl(hotel.image) : null

                          return (
                            <Paper
                              key={hotel.id}
                              elevation={0}
                              sx={{
                                p: 2, borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.3s ease',
                                '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                              }}
                            >
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {hotelImage && (
                                  <Box
                                    component="img"
                                    src={hotelImage}
                                    alt={hotelName}
                                    sx={{ width: { xs: '100%', sm: 100 }, height: { xs: 150, sm: 100 }, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                                  />
                                )}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Stack direction={{ xs: 'column', sm: 'row' }}  sx={{ mb: 1, gap: 1 , alignItems:{ xs: 'flex-start', sm: 'flex-start' ,justifyContent:"space-between"}}}>
                                    <Box>
                                      <Typography variant="subtitle1" fontWeight="700" color="#0f172a">
                                        {hotelName}
                                      </Typography>
                                      <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                                        {[...Array(hotel.stars || 0)].map((_, i) => (
                                          <StarIcon key={i} sx={{ fontSize: 14, color: '#fbbf24' }} />
                                        ))}
                                      </Stack>
                                    </Box>
                                    <Chip
                                      label={`${nights} ${t('common.nights', 'ليالي')}`}
                                      size="small"
                                      sx={{ bgcolor: 'rgba(51,151,184,0.1)', color: BRAND.primary, fontWeight: 700 }}
                                    />
                                  </Stack>

                                  <Typography variant="body2" color="text.secondary" sx={{
                                    mb: 1.5,
                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                  }}>
                                    {hotelDesc}
                                  </Typography>

                                  {/* المرافق */}
                                  {hotel.amenities && hotel.amenities.length > 0 && (
                                    <Stack direction="row" spacing={0.5} sx={{flexWrap:"wrap"}} useFlexGap>
                                      {hotel.amenities.slice(0, 5).map((amenity) => {
                                        const Icon = amenityIcons[amenity.toLowerCase()] || CheckIcon
                                        return (
                                          <Chip
                                            key={amenity}
                                            icon={<Icon sx={{ fontSize: 14 }} />}
                                            label={amenity}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderColor: '#e2e8f0', fontSize: '0.75rem' }}
                                          />
                                        )
                                      })}
                                    </Stack>
                                  )}
                                </Box>
                              </Stack>
                            </Paper>
                          )
                        })}
                      </Stack>
                    </>
                  )}

                  {/* وسائل النقل */}
                  {pkg.transports && pkg.transports.length > 0 && (
                    <>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusIcon sx={{ color: BRAND.primary }} />
                        {t('packages.transports', 'وسائل النقل')} ({pkg.transports.length})
                      </Typography>
                      <Stack spacing={2}>
                        {pkg.transports.map((transport) => {
                          const transportName = isRTL ? transport.name_ar : transport.name_en
                          const route = isRTL ? transport.PackageTransport?.route_ar : transport.PackageTransport?.route_en
                          const transportDesc = isRTL ? transport.description_ar : transport.description_en

                          return (
                            <Paper
                              key={transport.id}
                              elevation={0}
                              sx={{
                                p: 2, borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.3s ease',
                                '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                              }}
                            >
                              <Stack direction="row" spacing={2} sx={{ alignItems:"center"}}>
                                <Box sx={{
                                  width: 50, height: 50, borderRadius: 2,
                                  bgcolor: 'rgba(51,151,184,0.1)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                }}>
                                  <BusIcon sx={{ fontSize: 28, color: BRAND.primary }} />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="subtitle1" fontWeight="700" color="#0f172a">
                                    {transportName}
                                  </Typography>
                                  {route && (
                                    <Typography variant="body2" color="text.secondary">
                                      {t('packages.route', 'المسار')}: {route}
                                    </Typography>
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {transport.company_name} • {t('packages.capacity', 'السعة')}: {transport.capacity}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          )
                        })}
                      </Stack>
                    </>
                  )}

                  {/* 👇👇👇 قسم التقييمات - الإضافة الجديدة 👇👇👇 */}
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 4 }} />
                    <ReviewsSection
                      reviewableType="package"
                      reviewableId={pkg.id}
                      title={t('packages.reviews_title', 'تقييمات الباقة')}
                    />
                  </Box>

                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* ========== القسم الأيسر: ملخص الحجز ========== */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Fade in={true} timeout={800}>
              <Card
                elevation={0}
                sx={{
                  position: 'sticky', top: 96,
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(10,37,64,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 15px 50px rgba(10,37,64,0.12)' },
                }}
              >
                <Box sx={{
                  p: 3,
                  background: BRAND.gradient,
                  color: 'white',
                }}>
                  <Typography variant="h6" fontWeight="800">
                    {t('packages.booking_summary', 'ملخص الحجز')}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {/* السعر */}
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    {originalPrice && (
                      <Typography
                        variant="body1"
                        sx={{ textDecoration: 'line-through', color: '#94a3b8' }}
                      >
                        {originalPrice.toLocaleString()} {currency}
                      </Typography>
                    )}
                    <Typography variant="h3" fontWeight="900" color={BRAND.primary}>
                      {price.toLocaleString()} <Typography component="span" variant="h6">{currency}</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('packages.per_person', 'للفرد')}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* معلومات أساسية */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Stack direction="row"  sx={{justifyContent:"space-between"}}>
                      <Typography color="text.secondary">{t('packages.duration', 'المدة')}</Typography>
                      <Typography fontWeight="700">{pkg.duration_days} {t('common.days', 'أيام')}</Typography>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent:"space-between"}}>
                      <Typography color="text.secondary">{t('packages.start_date', 'تاريخ البدء')}</Typography>
                      <Typography fontWeight="700">
                        {new Date(pkg.start_date).toLocaleDateString(isRTL ? 'ar-SY' : 'en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent:"space-between"}}>
                      <Typography color="text.secondary">{t('packages.available_seats', 'المقاعد المتاحة')}</Typography>
                      <Typography fontWeight="700" color={seatsLeft > 5 ? '#10b981' : '#ef4444'}>
                        {seatsLeft} {t('packages.seats', 'مقعد')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent:"space-between"}}>
                      <Typography color="text.secondary">{t('packages.trips', 'الرحلات')}</Typography>
                      <Typography fontWeight="700">{pkg.trips?.length || 0}</Typography>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent:"space-between"}}>
                      <Typography color="text.secondary">{t('packages.hotels', 'الفنادق')}</Typography>
                      <Typography fontWeight="700">{pkg.hotels?.length || 0}</Typography>
                    </Stack>
                  </Stack>

                  {/* زر الحجز */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={seatsLeft === 0}
                    onClick={() => navigate(`/booking/package/${pkg.id}`)}
                    startIcon={<ShieldIcon />}
                    sx={{
                      ...gradientButtonSx,
                      py: 2, fontWeight: 700, fontSize: '1.05rem', borderRadius: 2.5,
                    }}
                  >
                    {seatsLeft === 0
                      ? t('packages.sold_out', 'نفدت المقاعد')
                      : t('packages.book_now', 'احجز الآن 💳')}
                  </Button>

                  {/* رسالة الأمان */}
                  <Stack direction="row" spacing={1}  sx={{ mt: 2 , alignItems:"center", justifyContent:"center" }}>
                    <ShieldIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {t('packages.secure_booking', 'حجز آمن عبر بوابة SamaPay')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

// مكون InfoStat
const InfoStat = ({ icon, label, value, color = BRAND.primary }) => (
  <Stack direction="row" spacing={1} sx={{
     alignItems:"center",
    p: 1.5, borderRadius: 2,
    bgcolor: 'rgba(51,151,184,0.05)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': { bgcolor: 'rgba(51,151,184,0.1)', transform: 'translateY(-2px)' },
  }}>
    <Box sx={{ ...statIconBoxSx, width: 40, height: 40 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight="700" color={color}>{value}</Typography>
    </Box>
  </Stack>
)