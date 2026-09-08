import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, Box, Typography, Stack, Chip, Button } from '@mui/material'
import {
  FlightTakeoff as FlightIcon,
  Hotel as HotelIcon,
  DirectionsBus as BusIcon,
  AccessTime as ClockIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'
import { getImageUrl, PLACEHOLDER_IMAGE } from '../utils/imageHelper'

/**
 * بطاقة باقة مدمجة (Compact) — 4 بالصف على الديسكتوب
 */
export default function PackageCard({ package: pkg }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const title = isRTL ? pkg.title_ar : pkg.title_en
  const description = isRTL ? pkg.description_ar : pkg.description_en

  const mainImage = pkg.image
    ? getImageUrl(pkg.image)
    : (pkg.trips?.[0]?.images?.[0]?.image_url
      ? getImageUrl(pkg.trips[0].images[0].image_url)
      : PLACEHOLDER_IMAGE)

  const price = Number(pkg.discount_price || pkg.price || 0)
  const originalPrice = pkg.discount_price ? Number(pkg.price) : null
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0
  const currency = pkg.currency || 'SYP'

  const tripsCount = pkg.trips?.length || 0
  const hotelsCount = pkg.hotels?.length || 0
  const transportsCount = pkg.transports?.length || 0
  const totalNights = pkg.hotels?.reduce((s, h) => s + (h.PackageHotel?.nights || 0), 0) || 0

  const rating = Number(pkg.average_rating || 0)

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 32px rgba(10,37,64,0.12)',
          transform: 'translateY(-4px)',
          borderColor: 'rgba(51,151,184,0.3)',
          '& .pkg-image': { transform: 'scale(1.06)' },
        },
      }}
    >
      {/* ========== الصورة (مصغّرة 150px) ========== */}
      <Box sx={{ position: 'relative', height: 150, overflow: 'hidden' }}>
        <Box
          component="img"
          src={mainImage}
          alt={title}
          className="pkg-image"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,37,64,0.55) 0%, transparent 45%)',
        }} />

        {/* شارة المدة */}
        <Chip
          label={`${pkg.duration_days || 0} ${t('common.days', 'يوم')}`}
          size="small"
          sx={{
            position: 'absolute', top: 8,
            right: isRTL ? 'auto' : 8, left: isRTL ? 8 : 'auto',
            height: 22, fontSize: '0.68rem', fontWeight: 700,
            bgcolor: 'rgba(255,255,255,0.92)', color: '#0f172a',
          }}
        />

        {/* شارة الخصم */}
        {discountPercent > 0 && (
          <Chip
            icon={<OfferIcon sx={{ fontSize: 12 }} />}
            label={`-${discountPercent}%`}
            size="small"
            sx={{
              position: 'absolute', top: 8,
              left: isRTL ? 'auto' : 8, right: isRTL ? 8 : 'auto',
              height: 22, fontSize: '0.68rem', fontWeight: 800,
              bgcolor: '#ef4444', color: 'white',
            }}
          />
        )}

        {/* التقييم */}
        {rating > 0 && (
          <Stack
            direction="row" spacing={0.5}
            sx={{
              position: 'absolute', bottom: 8, left: 8,
              bgcolor: 'rgba(0,0,0,0.55)', px: 1, py: 0.25, borderRadius: 1.5,
               alignItems:"center"
            }}
          >
            <StarIcon sx={{ fontSize: 12, color: '#fbbf24' }} />
            <Typography sx={{ fontSize: '0.68rem', color: 'white', fontWeight: 700 }}>
              {rating.toFixed(1)}
            </Typography>
          </Stack>
        )}
      </Box>

      {/* ========== المحتوى المدمج ========== */}
      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', '&:last-child': { paddingBottom: 2 } }}>

        {/* العنوان */}
        <Typography
          variant="subtitle2"
          fontWeight={800}
          color="#0f172a"
          noWrap
          sx={{ mb: 0.5, fontSize: '0.95rem' }}
        >
          {title}
        </Typography>

        {/* وصف مختصر (سطران) */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 30,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* شرائح الإحصائيات المدمجة */}
        <Stack direction="row" spacing={0.75}  useFlexGap sx={{ mb: 1.5 , flexWrap:"wrap"}}>
          {tripsCount > 0 && (
            <Chip
              icon={<FlightIcon sx={{ fontSize: 12 }} />}
              label={tripsCount}
              size="small" variant="outlined"
              sx={{ height: 22, fontSize: '0.68rem', borderColor: '#e2e8f0', color: '#475569', '& .MuiChip-icon': { color: BRAND.primary } }}
            />
          )}
          {hotelsCount > 0 && (
            <Chip
              icon={<HotelIcon sx={{ fontSize: 12 }} />}
              label={totalNights > 0 ? `${hotelsCount} • ${totalNights}` : hotelsCount}
              size="small" variant="outlined"
              sx={{ height: 22, fontSize: '0.68rem', borderColor: '#e2e8f0', color: '#475569', '& .MuiChip-icon': { color: BRAND.primary } }}
            />
          )}
          {transportsCount > 0 && (
            <Chip
              icon={<BusIcon sx={{ fontSize: 12 }} />}
              label={transportsCount}
              size="small" variant="outlined"
              sx={{ height: 22, fontSize: '0.68rem', borderColor: '#e2e8f0', color: '#475569', '& .MuiChip-icon': { color: BRAND.primary } }}
            />
          )}
        </Stack>

        {/* السعر + الأزرار */}
        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row"  spacing={0.75} sx={{ mb: 1.25 , alignItems:"baseline"}}>
            <Typography variant="h6" fontWeight={800} color={BRAND.primary} sx={{ fontSize: '1.05rem' }}>
              {price.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">{currency}</Typography>
            {originalPrice && (
              <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                {originalPrice.toLocaleString()}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              onClick={() => navigate(`/packages/${pkg.id}`)}
              sx={{
                borderColor: BRAND.primary, color: BRAND.primary,
                fontWeight: 700, textTransform: 'none',
                borderRadius: 1.5, fontSize: '0.78rem', py: 0.5,
                '&:hover': { bgcolor: 'rgba(51,151,184,0.05)' },
              }}
            >
              {t('packages.details', 'التفاصيل')}
            </Button>
            <Button
              size="small"
              variant="contained"
              fullWidth
              onClick={() => navigate(`/booking/package/${pkg.id}`)}
              sx={{
                ...gradientButtonSx,
                fontWeight: 700, textTransform: 'none',
                borderRadius: 1.5, fontSize: '0.78rem', py: 0.5,
                boxShadow: '0 3px 10px rgba(51,151,184,0.3)',
              }}
            >
              {t('packages.book_now_short', 'احجز')}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}