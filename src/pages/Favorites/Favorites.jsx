import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../../context/FavoritesContext'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../components/utils/imageHelper'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import GradientText from '../../components/Ui/GradientText'
import FavoriteButton from '../../components/Ui/FavoriteButton'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'
import {
  Container, Grid, Box, Typography, Stack, Chip, Button, Paper,
  Fade, Grow, Skeleton, Card, CardContent
} from '@mui/material'
import {
  FavoriteBorder as HeartIcon,
  FlightTakeoff as TripIcon,
  Luggage as PackageIcon,
  AccessTime as ClockIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material'

export default function Favorites() {
  const { t, i18n } = useTranslation()
  const { favorites, loading } = useFavorites()
  const navigate = useNavigate()
  const isRTL = i18n.language === 'ar'

  const [tab, setTab] = useState('all')

  // ========== استخراج الكيان من سجل المفضلة ==========
  const getEntity = (f) => f.Trip || f.Package || f.favorable || f.item || f

  const items = useMemo(() => {
    const mapped = favorites.map(f => {
      const e = getEntity(f)
      const type = f.favorable_type
      const id = f.favorable_id
      return {
        key: `${type}-${id}`,
        type,
        id,
        title: isRTL ? (e.title_ar || e.name_ar) : (e.title_en || e.name_en),
        image: e.image
          ? getImageUrl(e.image)
          : (e.images?.[0]?.image_url ? getImageUrl(e.images[0].image_url) : PLACEHOLDER_IMAGE),
        price: Number(e.discount_price || e.price || 0),
        currency: e.currency || 'SYP',
        duration: e.duration_days,
      }
    })
    return tab === 'all' ? mapped : mapped.filter(m => m.type === tab)
  }, [favorites, tab, isRTL])

  const counts = useMemo(() => ({
    all: favorites.length,
    trip: favorites.filter(f => f.favorable_type === 'trip').length,
    package: favorites.filter(f => f.favorable_type === 'package').length,
  }), [favorites])

  const tabs = [
    { value: 'all', label: t('favorites.all', 'الكل'), icon: <HeartIcon sx={{ fontSize: 16 }} />, count: counts.all },
    { value: 'trip', label: t('favorites.trips', 'الرحلات'), icon: <TripIcon sx={{ fontSize: 16 }} />, count: counts.trip },
    { value: 'package', label: t('favorites.packages', 'الباقات'), icon: <PackageIcon sx={{ fontSize: 16 }} />, count: counts.package },
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: BRAND.pageBg, position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>

        {/* ========== الرأس ========== */}
        <Fade in>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <GradientText variant="h3" fontWeight="900" sx={{ mb: 1, fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
              {t('favorites.title', 'مفضلتي')} ❤️
            </GradientText>
            <Typography variant="body1" color="text.secondary">
              {t('favorites.subtitle', 'الرحلات والباقات التي حفظتها للرجوع إليها لاحقاً')}
            </Typography>
          </Box>
        </Fade>

        {/* ========== التبويبات ========== */}
        <Stack direction="row" spacing={1}  useFlexGap sx={{ mb: 4 , justifyContent:"center" , flexWrap:"wrap"}}>
          {tabs.map(tb => (
            <Chip
              key={tb.value}
              icon={tb.icon}
              label={`${tb.label} (${tb.count})`}
              onClick={() => setTab(tb.value)}
              sx={{
                px: 1.5, height: 38, fontWeight: 700, cursor: 'pointer',
                bgcolor: tab === tb.value ? BRAND.primary : 'white',
                color: tab === tb.value ? 'white' : '#475569',
                border: '1px solid', borderColor: tab === tb.value ? BRAND.primary : 'rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: tab === tb.value ? BRAND.primaryDark : 'rgba(51,151,184,0.08)' },
                '& .MuiChip-icon': { color: tab === tb.value ? 'white' : BRAND.primary },
              }}
            />
          ))}
        </Stack>

        {/* ========== المحتوى ========== */}
        {loading ? (
          <Grid container spacing={2.5}>
            {[...Array(4)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={160} animation="wave" />
                  <Box sx={{ p: 2 }}>
                    <Skeleton height={20} width="80%" animation="wave" sx={{ mb: 1 }} />
                    <Skeleton height={14} width="50%" animation="wave" />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : items.length === 0 ? (
          /* ========== حالة فارغة ========== */
          <Fade in>
            <Paper elevation={0} sx={{
              p: 6, textAlign: 'center', borderRadius: 4,
              border: '2px dashed #cbd5e1', bgcolor: 'rgba(255,255,255,0.9)',
            }}>
              <Box sx={{
                width: 90, height: 90, mx: 'auto', mb: 2,
                bgcolor: 'rgba(239,68,68,0.08)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'floatIcon 3s ease-in-out infinite',
                '@keyframes floatIcon': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}>
                <HeartIcon sx={{ fontSize: 44, color: '#ef4444' }} />
              </Box>
              <Typography variant="h6" fontWeight="700" color="#0f172a" gutterBottom>
                {t('favorites.empty_title', 'لا توجد مفضلات بعد')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                {t('favorites.empty_desc', 'ابدأ بإضافة الرحلات والباقات التي تعجبك بالضغط على زر القلب ❤️')}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/trips')}
                endIcon={<ArrowIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
                sx={{ ...gradientButtonSx, fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4 }}
              >
                {t('favorites.explore', 'استكشف الرحلات')}
              </Button>
            </Paper>
          </Fade>
        ) : (
          /* ========== شبكة العناصر ========== */
          <Grid container spacing={2.5}>
            {items.map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.key}>
                <Grow in timeout={200 + i * 80}>
                  <Card elevation={0} sx={{
                    borderRadius: 3, overflow: 'hidden', height: '100%',
                    border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(10,37,64,0.12)',
                      '& .fav-img': { transform: 'scale(1.06)' },
                    },
                  }}>
                    {/* الصورة + زر القلب */}
                    <Box sx={{ position: 'relative', height: 160, overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => navigate(item.type === 'trip' ? `/tours/${item.id}` : `/packages/${item.id}`)}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        className="fav-img"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      />
                      <Chip
                        icon={item.type === 'trip' ? <TripIcon sx={{ fontSize: 14 }} /> : <PackageIcon sx={{ fontSize: 14 }} />}
                        label={item.type === 'trip' ? t('favorites.trip', 'رحلة') : t('favorites.package', 'باقة')}
                        size="small"
                        sx={{
                          position: 'absolute', top: 10,
                          left: isRTL ? 'auto' : 10, right: isRTL ? 10 : 'auto',
                          bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 700, height: 24, fontSize: '0.7rem',
                        }}
                      />
                    </Box>

                    {/* زر القلب (إزالة) */}
                    <FavoriteButton
                      type={item.type}
                      id={item.id}
                      variant="default"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: isRTL ? 'auto' : 8, left: isRTL ? 8 : 'auto', bgcolor: 'rgba(255,255,255,0.92)' }}
                    />

                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight="700" color="#0f172a" noWrap sx={{ mb: 0.5 }}>
                        {item.title}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 1.5 ,  alignItems:"center" }}>
                        {item.duration && (
                          <Stack direction="row" spacing={0.5}  sx={{alignItems:"center"}}>
                            <ClockIcon sx={{ fontSize: 14, color: '#64748b' }} />
                            <Typography variant="caption" color="text.secondary">
                              {item.duration} {t('common.days', 'أيام')}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Stack direction="row" sx={{justifyContent:"space-between", alignItem:"center"}}>
                        <Typography variant="subtitle1" fontWeight="800" color={BRAND.primary}>
                          {item.price.toLocaleString()}
                          <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{item.currency}</Typography>
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => navigate(item.type === 'trip' ? `/tours/${item.id}` : `/packages/${item.id}`)}
                          sx={{
                            color: BRAND.primary, fontWeight: 700, textTransform: 'none',
                            borderColor: BRAND.primary, borderRadius: 1.5, fontSize: '0.75rem',
                            '&:hover': { bgcolor: 'rgba(51,151,184,0.08)' },
                          }}
                          variant="outlined"
                        >
                          {t('favorites.view', 'عرض')}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}