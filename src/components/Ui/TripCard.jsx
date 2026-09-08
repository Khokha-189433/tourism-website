import {
  Card, CardContent, CardMedia, Typography, Box, Chip, IconButton, Button
} from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn, CalendarToday } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { getMainImage, PLACEHOLDER_IMAGE } from '../utils/imageHelper';

const LONDON_TRIP_IMAGE = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=85';

export default function TripCard({ trip, isFavorite = false, onToggleFavorite }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const title = lang === 'ar' ? trip.title_ar : trip.title_en;
  const description = lang === 'ar' ? trip.short_description_ar : trip.short_description_en;
  const departureLocation = lang === 'ar' ? trip.departure_location_ar : trip.departure_location_en;

  const hasTripImages = Array.isArray(trip.images) && trip.images.length > 0;
  const isLondonTrip = trip.slug?.includes('london') || trip.title_en?.toLowerCase().includes('london');
  const imageUrl = hasTripImages
    ? getMainImage(trip.images)
    : isLondonTrip
      ? LONDON_TRIP_IMAGE
      : PLACEHOLDER_IMAGE;
  const price = trip.discount_price || trip.price;
  const hasDiscount = trip.discount_price && trip.discount_price < trip.price;

  return (
    <Card 
      sx={{ 
        height: '400px',
        width: '100%',
        maxWidth: { xs: '340px', sm: '380px', md: '420px' },
        mx: 'auto',
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden', // ✅ يمنع أي محتوى من الخروج عن الحدود
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* زر المفضلة */}
      {onToggleFavorite && (
        <IconButton
          onClick={(e) => { e.preventDefault(); onToggleFavorite(trip.id); }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            width: 32,
            height: 32,
            '&:hover': { bgcolor: 'white', color: 'error.main' },
            zIndex: 2,
          }}
        >
          {isFavorite ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
        </IconButton>
      )}

      {/* صورة الرحلة: ارتفاع ثابت تماماً */}
      <Box sx={{ position: 'relative', width: '100%', height: '170px', flexShrink: 0 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover', 
          }}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
        />
        {/* شارة الخصم */}
        {hasDiscount && (
          <Chip
            label={`-${Math.round(((trip.price - trip.discount_price) / trip.price) * 100)}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
              height: 24,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 1.5, minHeight: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* العنوان: ارتفاع ثابت وحاسم (سطرين) */}
        <Typography 
          variant="subtitle1" 
          fontWeight="700" 
          gutterBottom 
          sx={{ 
            lineHeight: 1.3, 
            height: '2.6em', // ✅ استخدام height بدلاً من minHeight لمنع التمدد
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
        >
          {title}
        </Typography>

        {/* الوصف المختصر: ارتفاع ثابت وحاسم (سطرين) */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            mb: 1.5, 
            height: '2.8em', // ✅ استخدام height بدلاً من minHeight لمنع التمدد
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden', 
            lineHeight: 1.4 
          }}
        >
          {description || 'لا يوجد وصف متاح لهذه الرحلة.'}
        </Typography>

        {/* المعلومات (الموقع والمدة) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {departureLocation}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {trip.duration_days} {t('common.days') || 'أيام'}
            </Typography>
          </Box>
        </Box>

        {/* السعر والزر: دائماً في الأسفل بفضل mt: 'auto' */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <Box>
            {hasDiscount && (
              <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block', lineHeight: 1 }}>
                {trip.price.toLocaleString()}
              </Typography>
            )}
            <Typography variant="h6" color="primary.main" fontWeight="800" sx={{ lineHeight: 1.1, fontSize: '1.1rem' }}>
              {price.toLocaleString()} 
              <Typography component="span" variant="caption" color="text.secondary" fontWeight="500">
                {' '}{t('common.currency') || 'ل.س'}
              </Typography>
            </Typography>
          </Box>
          
          <Button
            component={RouterLink}
            to={`/tours/${trip.id}`}
            variant="contained"
            size="small"
            sx={{ 
              display: 'inline-flex',
              visibility: 'visible',
              borderRadius: 1.5, 
              px: 2, 
              py: 0.75,
              textTransform: 'none', 
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 2px 6px rgba(25, 118, 210, 0.25)',
              '&:hover': { boxShadow: '0 4px 10px rgba(25, 118, 210, 0.35)' }
            }}
          >
            {t('bookings.viewDetails') || 'عرض التفاصيل'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}