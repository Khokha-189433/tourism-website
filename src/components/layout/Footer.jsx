import { Box, Container, Typography, Grid, Link, IconButton, Divider, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, LocationOn, Phone, Email, Language } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <Box component="footer" sx={{ 
      background: 'linear-gradient(135deg, #0a2540 0%, #1e5f74 100%)',
      color: 'white', 
      py: { xs: 5, md: 6 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* زخرفة خلفية ناعمة */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          
          {/* العمود 1: عن الشركة */}
          <Grid xs={12} md={4} lg={3}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mb: 2.5 
              }}>
                <Box sx={{
                  width: 45,
                  height: 45,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Language sx={{ fontSize: 24, color: '#4facfe' }} />
                </Box>
                <Typography variant="h6" fontWeight="700">
                  {t('footer.aboutTitle')}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ 
                opacity: 0.85, 
                lineHeight: 1.8,
                textAlign: 'justify'
              }}>
                {t('footer.aboutText')}
              </Typography>
            </Box>
          </Grid>

          {/* العمود 2: روابط سريعة */}
          <Grid xs={6} md={4} lg={3}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2.5, fontSize: '1.1rem' }}>
              {t('footer.quickLinks')}
            </Typography>
            <Stack spacing={1.5}>
              {[
                { label: t('footer.availableTrips'), to: '/trips', icon: '🗺️' },
                { label: t('footer.touristPackages'), to: '/packages', icon: '📦' },
                { label: t('footer.blogAndNews'), to: '/blog', icon: '📰' },
                { label: t('footer.contactUs'), to: '/contact', icon: '✉️' }
              ].map((item, index) => (
                <Link 
                  key={index}
                  component={RouterLink} 
                  to={item.to} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.85)', 
                    textDecoration: 'none', 
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: '#4facfe',
                      transform: 'translateX(5px)'
                    },
                    [i18n.language === 'ar' ? '&:hover' : '']: {
                      transform: 'translateX(-5px)'
                    }
                  }}
                >
                  <Box component="span" sx={{ fontSize: '1rem' }}>{item.icon}</Box>
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* العمود 3: خدمات إضافية */}
          <Grid xs={6} md={4} lg={3}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2.5, fontSize: '1.1rem' }}>
              {t('footer.services') || 'خدماتنا'}
            </Typography>
            <Stack spacing={1.5}>
              {[
                { label: 'حجوزات فنادق', icon: '🏨' },
                { label: 'تأجير سيارات', icon: '🚗' },
                { label: 'دليل سياحي', icon: '🎯' },
                { label: 'رحلات خاصة', icon: '✈️' }
              ].map((item, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    color: 'rgba(255,255,255,0.85)', 
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      color: '#4facfe',
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <Box component="span" sx={{ fontSize: '1rem' }}>{item.icon}</Box>
                  {item.label}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* العمود 4: التواصل */}
          <Grid xs={12} md={4} lg={3}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2.5, fontSize: '1.1rem' }}>
              {t('footer.contactTitle')}
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5}   sx={{ alignItems:"flex-start"}}  >
                <Box sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'rgba(79, 172, 254, 0.2)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <LocationOn sx={{ fontSize: 18, color: '#4facfe' }} />
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
                  {t('footer.address')}
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'rgba(79, 172, 254, 0.2)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone sx={{ fontSize: 18, color: '#4facfe' }} />
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85, direction: 'ltr', textAlign: 'left' }}>
                  +963 11 123 4567
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                <Box sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'rgba(79, 172, 254, 0.2)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Email sx={{ fontSize: 18, color: '#4facfe' }} />
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  info@syria-tourism.com
                </Typography>
              </Stack>
            </Stack>

            {/* أيقونات التواصل الاجتماعي */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 1.5 }}>
                {t('footer.followUs') || 'تابعنا على'}
              </Typography>
              <Stack direction="row" spacing={1}>
                {[Facebook, Twitter, Instagram].map((Icon, index) => (
                  <IconButton 
                    key={index} 
                    size="medium"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      color: 'white',
                      width: 40, 
                      height: 40,
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: '#4facfe', 
                        borderColor: '#4facfe',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)'
                      }
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* الخط الفاصل */}
        <Divider sx={{ 
          my: 4, 
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1
        }} />
        
        {/* حقوق النشر */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ 
            alignItems: 'center', 
            justifyContent: 'space-between',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} {t('footer.copyright')}
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link 
              href="/privacy" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
                '&:hover': { color: '#4facfe' }
              }}
            >
              {t('footer.privacy') || 'سياسة الخصوصية'}
            </Link>
            <Link 
              href="/terms" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
                '&:hover': { color: '#4facfe' }
              }}
            >
              {t('footer.terms') || 'شروط الاستخدام'}
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}