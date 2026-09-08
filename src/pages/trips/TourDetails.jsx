import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../API/axios'
import { PageLoader } from '../../components/Ui/Loading'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../components/utils/imageHelper'
import {
  Container, Grid, Box, Typography, Stack, IconButton, Button,
  Chip, Paper, Alert, Divider, Dialog, DialogContent
} from '@mui/material'
import {
  Star as StarIcon, LocationOn as MapPinIcon, AccessTime as ClockIcon,
  People as UsersIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon,
  Share as ShareIcon, FavoriteBorder as FavoriteBorderIcon, FlightTakeoff as FlightIcon,
  CheckCircle as CheckIcon, Cancel as CloseIcon,
  Event as EventIcon, Tour as TourIcon, Payments as PaymentsIcon,
  FreeBreakfast as BreakfastIcon, LunchDining as LunchIcon, DinnerDining as DinnerIcon
} from '@mui/icons-material'
import ReviewsSection from '../../components/Ui/ReviewsSection'
import FavoriteButton from '../../components/Ui/FavoriteButton'
const imageCollectionKeys = ['TripImages', 'tripImages', 'images', 'trip_images', 'photos', 'gallery', 'image_urls']
const imageValueKeys = ['image_url', 'imageUrl', 'image_path', 'imagePath', 'image', 'url', 'path', 'filename', 'file_url', 'src']

const unwrapApiData = (payload) => {
  const data = payload?.data ?? payload
  return data?.trip ?? data?.item ?? data
}

const getImageItems = (source, visited = new Set()) => {
  if (typeof source === 'string') {
    try {
      const parsed = JSON.parse(source)
      if (parsed && typeof parsed === 'object') return getImageItems(parsed, visited)
    } catch {
      // The value is a regular image url/path.
    }
    return source ? [source] : []
  }
  if (!source || typeof source !== 'object' || visited.has(source)) return []
  visited.add(source)

  if (Array.isArray(source)) {
    return source.flatMap((item) => getImageItems(item, visited))
  }

  const directImage = imageValueKeys.find((key) => source[key])
  if (directImage) {
    return typeof source[directImage] === 'object'
      ? getImageItems(source[directImage], visited)
      : [source]
  }

  return imageCollectionKeys.flatMap((key) => {
    const value = source[key]
    if (Array.isArray(value)) return getImageItems(value, visited)
    if (value && typeof value === 'object') return getImageItems(value, visited)
    return []
  })
}

export default function TourDetails() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRTL = i18n.language.startsWith('ar')

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true)
        const detailResponse = await api.get(`/trips/${id}`)
        const detailTrip = unwrapApiData(detailResponse.data)

        let listTrip = null
        try {
          const listResponse = await api.get('/trips?page=1&limit=10&status=published')
          const listData = unwrapApiData(listResponse.data)
          const trips = Array.isArray(listData) ? listData : listData?.rows || listData?.items || listData?.trips || []
          listTrip = trips.find((item) => String(item.id || item.trip_id) === String(id))
        } catch (listError) {
          console.warn('تعذر جلب معرض الصور من قائمة الرحلات:', listError)
        }

        const mergedImages = [...getImageItems(detailTrip), ...getImageItems(listTrip)]

        setTrip({ ...detailTrip, TripImages: mergedImages })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        console.error('فشل جلب الرحلة:', err)
        setError(t('tour_details.error_loading'))
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [id, t])

  if (loading) return <PageLoader />
  if (error || !trip) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error || t('tour_details.not_found')}</Alert>
        <Button variant="contained" onClick={() => navigate('/trips')} sx={{ borderRadius: 2, bgcolor: '#3397b8' }}>
          {t('tour_details.back_to_tours')}
        </Button>
      </Container>
    )
  }

  const title = isRTL ? trip.title_ar : trip.title_en
  const description = isRTL ? trip.description_ar : trip.description_en
  const destination = isRTL ? trip.Destination?.name_ar : trip.Destination?.name_en
  const included = isRTL ? trip.included_services_ar : trip.included_services_en
  const excluded = isRTL ? trip.excluded_services_ar : trip.excluded_services_en
  const programs = trip.programs || []
  
  const images = getImageItems(trip)
    .map((image) => getImageUrl(image))
    .filter(Boolean)
    .filter((image, index, allImages) => allImages.indexOf(image) === index)
  const galleryImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE]
  
  const price = Number(trip.discount_price || trip.price)
  const seats = Math.max(0, (trip.max_participants || 20) - (trip.current_participants || 0))
  const formatDate = (date) => date
    ? new Date(date).toLocaleDateString(isRTL ? 'ar-SY' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : t('tour_details.flexible')

  const quickFacts = [
    { icon: <ClockIcon />, label: t('tour_details.duration'), value: `${trip.duration_days} ${t('common.days')}`, color: '#3397b8', animated: true },
    { icon: <UsersIcon />, label: t('tour_details.group_size'), value: `${seats} ${t('tour_details.seats_left')}`, color: seats > 0 ? '#10b981' : '#ef4444', animated: true },
    { icon: <TourIcon />, label: t('tour_details.type'), value: destination || t('tour_details.tourist'), color: '#8b5cf6', animated: true },
    { icon: <EventIcon />, label: t('tour_details.start_date'), value: formatDate(trip.start_date), color: '#f59e0b' },
    { icon: <EventIcon />, label: t('tour_details.end_date'), value: formatDate(trip.end_date || trip.finish_date), color: '#ef7d5b' },
    { icon: <PaymentsIcon />, label: t('tour_details.cost'), value: `${price.toLocaleString()} ${t('common.currency')}`, color: '#0277bd' }
  ]

  const getMealValue = (program, mealKey) => {
    const mealData = program.meals || program.Meals || program.included_meals

    if (Array.isArray(mealData)) {
      const matchedMeal = mealData.find((meal) => {
        const mealName = typeof meal === 'string' ? meal : meal?.type || meal?.name || meal?.meal
        return mealName?.toLowerCase().includes(mealKey)
      })
      if (matchedMeal) {
        return typeof matchedMeal === 'string'
          ? true
          : matchedMeal.description || matchedMeal.details || true
      }
    }

    if (mealData && typeof mealData === 'object' && !Array.isArray(mealData)) {
      return mealData[mealKey]
    }

    if (typeof mealData === 'string' && mealData.toLowerCase().includes(mealKey)) {
      return true
    }

    return program[mealKey] ?? program[`${mealKey}_included`] ?? program[`${mealKey}_description`]
  }

  const mealDefinitions = [
    { key: 'breakfast', label: t('tour_details.breakfast'), icon: <BreakfastIcon />, color: '#f59e0b' },
    { key: 'lunch', label: t('tour_details.lunch'), icon: <LunchIcon />, color: '#10b981' },
    { key: 'dinner', label: t('tour_details.dinner'), icon: <DinnerIcon />, color: '#6366f1' }
  ]

  const handleBookClick = () => navigate(`/booking/${id}`)
  const handleShare = () => navigator.clipboard.writeText(window.location.href)

  const nextImage = () => setActiveImg((prev) => (prev + 1) % galleryImages.length)
  const prevImage = () => setActiveImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)

  const openImageViewer = (e, imageIndex = null) => {
    if (e?.currentTarget) e.currentTarget.blur()
    if (imageIndex !== null) setActiveImg(imageIndex)
    setIsImageViewerOpen(true)
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box>
          
          {/* ============ 1. HERO SECTION & GALLERY ============ */}
          <Box sx={{ position: 'relative', mb: { xs: 3, md: 5 }, px: { xs: 0, md: 2 } }}>
            <Box sx={{ position: 'relative', height: { xs: 300, sm: 400, md: 520 }, overflow: 'hidden', bgcolor: '#e2e8f0', borderRadius: { xs: 0, md: 4 }, boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)' }}>
              <Box 
                component="img" 
                src={galleryImages[activeImg]} 
                alt={title}
                onClick={(e) => openImageViewer(e)}
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', cursor: 'zoom-in', transition: 'opacity 0.3s ease' }} 
              />
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', background: 'linear-gradient(to top, rgba(10, 37, 64, 0.95) 0%, rgba(10, 37, 64, 0) 100%)' }} />
              
              {galleryImages.length > 1 && (
                <>
                  <IconButton onClick={prevImage} sx={{ position: 'absolute', top: '50%', [isRTL ? 'right' : 'left']: 20, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}>
                    {isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                  </IconButton>
                  <IconButton onClick={nextImage} sx={{ position: 'absolute', top: '50%', [isRTL ? 'left' : 'right']: 20, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}>
                    {isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                  </IconButton>
                </>
              )}

              <Container maxWidth="xl" sx={{ position: 'absolute', bottom: { xs: 20, md: 40 }, left: 0, right: 0, color: 'white', px: { xs: 2, md: 4 } }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  {destination && (
                    <Chip icon={<MapPinIcon sx={{ color: 'white !important' }} />} label={destination} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', fontWeight: 600 }} />
                  )}
                  <Chip 
                    icon={<StarIcon sx={{ color: '#fbbf24 !important' }} />} 
                    label={`${Number(trip.average_rating || 4.5).toFixed(1)} (${trip.total_reviews || 0})`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', fontWeight: 600 }} 
                  />
                </Stack>
                <Typography variant="h2" fontWeight="800" sx={{ fontSize: { xs: '1.8rem', md: '3rem' }, textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: 1.2, maxWidth: '800px' }}>
                  {title}
                </Typography>
              </Container>

              <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 20, [isRTL ? 'left' : 'right']: 20 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white' }}>
                  <ArrowBackIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
                <IconButton onClick={handleShare} sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white' }}>
                  <ShareIcon />
                </IconButton>
                <FavoriteButton type="trip" id={trip.id} />
              </Stack>
            </Box>

            {galleryImages.length > 1 && (
              <Container maxWidth="xl" sx={{ mt: { xs: -2, md: -4 }, position: 'relative', zIndex: 2, px: { xs: 2, md: 4 } }}>
                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1, px: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
                  {galleryImages.map((img, i) => (
                    <Box 
                      key={i} 
                      onClick={(e) => openImageViewer(e, i)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${t('tour_details.image') || 'الصورة'} ${i + 1}`}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          openImageViewer(event, i)
                        }
                      }}
                      sx={{
                        flexShrink: 0, width: { xs: 80, md: 120 }, height: { xs: 60, md: 80 }, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                        border: '3px solid', borderColor: activeImg === i ? '#3397b8' : 'transparent',
                        opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.3s ease', '&:hover': { opacity: 1 }
                      }}
                    >
                      <Box component="img" src={img} alt="" onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Stack>
              </Container>
            )}
          </Box>

          <Dialog
            open={isImageViewerOpen}
            onClose={() => setIsImageViewerOpen(false)}
            maxWidth="xl"
            fullWidth
            disableEnforceFocus
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: 'rgba(8, 15, 30, 0.96)',
                  borderRadius: { xs: 0, md: 2 },
                  overflow: 'hidden'
                }
              }
            }}
          >
            <DialogContent sx={{ position: 'relative', p: { xs: 1, md: 2 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: { xs: '70vh', md: '80vh' } }}>
              <IconButton
                aria-label={t('common.close') || 'إغلاق'}
                onClick={(e) => {
                  e.currentTarget.blur()
                  setIsImageViewerOpen(false)
                }}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: 'white', bgcolor: 'rgba(0,0,0,0.45)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <CloseIcon />
              </IconButton>
              <Box
                component="img"
                src={galleryImages[activeImg]}
                alt={title}
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                sx={{ maxWidth: '100%', maxHeight: '82vh', objectFit: 'contain', display: 'block' }}
              />
            </DialogContent>
          </Dialog>

          <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 }, px: { xs: 2, md: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3, md: 5 }} sx={{ alignItems: 'flex-start' }}>
              
              {/* ============ 2. القسم الرئيسي (التفاصيل) ============ */}
              <Grid size={{ xs: 12, lg: 8 }}>
                
                {/* شريط المعلومات السريعة */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: { xs: 4, md: 6 }, borderRadius: 3, border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                  <Grid container spacing={{ xs: 2, md: 2.5 }}>
                    {quickFacts.map((item, idx) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.label}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{
                            alignItems: "center",
                            minHeight: 82,
                            p: 1.5,
                            borderRadius: 2.5,
                            bgcolor: '#f8fafc',
                            border: '1px solid',
                            borderColor: 'rgba(15, 23, 42, 0.05)',
                            animation: item.animated ? 'tourFactIn 0.55s ease both' : 'none',
                            animationDelay: item.animated ? `${idx * 120}ms` : '0ms',
                            '@keyframes tourFactIn': {
                              from: { opacity: 0, transform: 'translateY(10px)' },
                              to: { opacity: 1, transform: 'translateY(0)' }
                            }
                          }}
                        >
                          <Box sx={{ bgcolor: `${item.color}15`, width: 48, height: 48, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                            {item.icon}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                            <Typography variant="subtitle1" fontWeight="700" noWrap sx={{ maxWidth: { xs: 220, sm: 240 } }}>{item.value}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                {/* الوصف */}
                <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, mb: { xs: 4, md: 6 }, borderRadius: 3, bgcolor: 'white', border: '1px solid', borderColor: 'rgba(15, 23, 42, 0.06)' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: "center" }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: '#3397b8', borderRadius: 2 }} />
                    <Typography variant="h5" fontWeight="800" color="#0f172a">{t('tour_details.about_trip')}</Typography>
                  </Stack>
                  <Typography color="#475569" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line', fontSize: '1.05rem' }}>
                    {description}
                  </Typography>
                </Paper>

                {/* البرنامج اليومي (Timeline) */}
                {programs.length > 0 && (
                  <Box sx={{ mb: { xs: 4, md: 6 } }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                      <Box sx={{ width: 4, height: 24, bgcolor: '#3397b8', borderRadius: 2 }} />
                      <Typography variant="h5" fontWeight="800" color="#0f172a">{t('tour_details.itinerary') || 'البرنامج اليومي'}</Typography>
                    </Stack>
                    <Stack spacing={1}>
                      {programs.map((item, index) => (
                        <Box key={item.day_number} sx={{ display: 'flex', gap: { xs: 2, md: 3 }, position: 'relative' }}>
                          {index < programs.length - 1 && (
                            <Box sx={{ position: 'absolute', top: 40, bottom: -10, [isRTL ? 'right' : 'left']: 19, width: 2, bgcolor: '#e2e8f0' }} />
                          )}
                          <Box sx={{ flexShrink: 0, width: 40, height: 40, bgcolor: '#3397b8', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, zIndex: 1, boxShadow: '0 4px 10px rgba(51, 151, 184, 0.3)' }}>
                            {item.day_number}
                          </Box>
                          <Paper elevation={0} sx={{ flex: 1, p: { xs: 2, md: 2.5 }, borderRadius: 2.5, bgcolor: 'white', border: '1px solid', borderColor: 'rgba(0,0,0,0.06)' }}>
                            <Typography fontWeight="700" sx={{ mb: 1, color: '#0f172a', fontSize: '1.1rem' }}>
                              {isRTL ? item.title_ar : item.title_en}
                            </Typography>
                            <Typography variant="body1" color="#64748b" sx={{ lineHeight: 1.8 }}>
                              {isRTL ? item.description_ar : item.description_en}
                            </Typography>

                            <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: '#e2e8f0' }}>
                              <Typography variant="caption" fontWeight="800" color="#475569" sx={{ display: 'block', mb: 1.25 }}>
                                {t('tour_details.meals')}
                              </Typography>
                              <Grid container spacing={1}>
                                {mealDefinitions.map((meal) => {
                                  const value = getMealValue(item, meal.key)
                                  const isUnavailable = value === false || value === 0 || value === 'false'
                                  const detail = typeof value === 'string' && value !== 'true' && value !== '1'
                                    ? value
                                    : isUnavailable
                                      ? t('tour_details.not_included')
                                      : value
                                        ? t('tour_details.included_meal')
                                        : t('tour_details.not_specified')

                                  return (
                                    <Grid size={{ xs: 12, sm: 4 }} key={meal.key}>
                                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", p: 1, minHeight: 54, borderRadius: 2, bgcolor: isUnavailable ? '#f8fafc' : `${meal.color}12`, border: '1px solid', borderColor: isUnavailable ? '#e2e8f0' : `${meal.color}35` }}>
                                        <Box sx={{ width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5, color: isUnavailable ? '#94a3b8' : meal.color, bgcolor: isUnavailable ? '#e2e8f0' : `${meal.color}20` }}>
                                          {meal.icon}
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                          <Typography variant="caption" fontWeight="800" color="#334155" display="block">{meal.label}</Typography>
                                          <Typography variant="caption" color={isUnavailable ? 'text.secondary' : '#475569'} noWrap>{detail}</Typography>
                                        </Box>
                                      </Stack>
                                    </Grid>
                                  )
                                })}
                              </Grid>
                            </Box>
                          </Paper>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* الخدمات المشمولة وغير المشمولة */}
                <Grid container spacing={3}>
                  {included && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, bgcolor: '#f0fdf4', border: '1px solid', borderColor: '#bbf7d0', height: '100%' }}>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, alignItems: "center" }}>
                          <CheckIcon sx={{ color: '#10b981', fontSize: 28 }} />
                          <Typography variant="h6" fontWeight="700" color="#065f46">{t('tour_details.included') || 'مشمول'}</Typography>
                        </Stack>
                        <Stack spacing={1.5}>
                          {included.split('\n').filter(Boolean).map((line, i) => (
                            <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                              <CheckIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                              <Typography variant="body2" color="#065f46" sx={{ lineHeight: 1.6 }}>{line}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                  )}
                  {excluded && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, bgcolor: '#fef2f2', border: '1px solid', borderColor: '#fecaca', height: '100%' }}>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, alignItems: "center" }}>
                          <CloseIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                          <Typography variant="h6" fontWeight="700" color="#991b1b">{t('tour_details.excluded') || 'غير مشمول'}</Typography>
                        </Stack>
                        <Stack spacing={1.5}>
                          {excluded.split('\n').filter(Boolean).map((line, i) => (
                            <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                              <CloseIcon sx={{ color: '#ef4444', fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                              <Typography variant="body2" color="#991b1b" sx={{ lineHeight: 1.6 }}>{line}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                {/* 👇👇👇 قسم التقييمات (الإضافة الوحيدة) 👇👇👇 */}
                <ReviewsSection
                  reviewableType="trip"
                  reviewableId={trip.id}
                  title={t('tour_details.reviews', 'التقييمات والمراجعات')}
                />

              </Grid>

              {/* ============ 3. القسم الجانبي: بطاقة الحجز ============ */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Paper sx={{ width: '100%', position: { xs: 'relative', lg: 'sticky' }, top: 96, borderRadius: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', overflow: 'hidden', bgcolor: 'white' }}>
                  <Box sx={{ background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)', p: { xs: 2.5, sm: 3 }, color: 'white' }}>
                    <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>{t('tour_details.starting_from')}</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '2.5rem', sm: '3rem' } }}>{price.toLocaleString()}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('common.currency')} / {t('tour_details.per_person')}</Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={2.5} sx={{ mb: 3 }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ bgcolor: '#f0f9ff', p: 1, borderRadius: 2, color: '#3397b8' }}><ClockIcon /></Box>
                        <Typography variant="body1">{trip.duration_days} {t('common.days')}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ bgcolor: seats > 0 ? '#f0fdf4' : '#fef2f2', p: 1, borderRadius: 2, color: seats > 0 ? '#10b981' : '#ef4444' }}><UsersIcon /></Box>
                        <Typography variant="body1" fontWeight="600" color={seats > 0 ? '#10b981' : '#ef4444'}>
                          {seats > 0 ? `${seats} ${t('tour_details.seats_left')}` : t('tour_details.sold_out')}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Button 
                      variant="contained" 
                      size="large" 
                      fullWidth 
                      onClick={handleBookClick}
                      disabled={seats === 0}
                      startIcon={<FlightIcon />}
                      sx={{ 
                        py: 1.8, fontWeight: 700, fontSize: '1.05rem', bgcolor: '#3397b8', borderRadius: 2, 
                        textTransform: 'none', boxShadow: '0 6px 20px rgba(51, 151, 184, 0.35)', 
                        '&:hover': { bgcolor: '#217490', transform: 'translateY(-2px)' },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {seats === 0 ? t('tour_details.sold_out') : t('tour_details.book_now')}
                    </Button>
                    
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
                      <CheckIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5, color: '#10b981' }} />
                      {t('tour_details.secure_booking') || 'حجز آمن ومضمون 100%'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
    </Box>
  )
}