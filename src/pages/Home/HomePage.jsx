import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Grid, TextField, InputAdornment,
  CircularProgress, Alert, Paper, useTheme, useMediaQuery
} from '@mui/material';
import { Search, Category, Star, LocationOn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import API from '../../API/axios';
import TripCard from '../../components/Ui/TripCard';
import { getImageUrl, PLACEHOLDER_IMAGE } from '../../components/utils/imageHelper';
import LatestArticles from '../Articles/LatestArticles';
import HeroSlideshow from './/HeroSlideshow'; // ✅ خلفية الهيرو المتحركة
export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const language = i18n.language === 'en' ? 'en' : 'ar';
  
  // ✅ اكتشاف أحجام الشاشات
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // ✅ نمط محدث للعناوين
  const sectionTitleSx = {
    color: '#334155',
    fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.9rem', lg: '2.2rem' },
    fontWeight: '800',
    textShadow: '0 0 20px rgba(79, 172, 254, 0.25), 0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
    '&:hover': {
      textShadow: '0 0 30px rgba(79, 172, 254, 0.4), 0 4px 12px rgba(0, 0, 0, 0.08)',
      color: '#1e293b'
    }
  };

  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tripsRes, categoriesRes, destinationsRes] = await Promise.all([
        API.get('/trips/featured?limit=8'),
        API.get('/categories'),
        API.get('/destinations'),
      ]);

      setFeaturedTrips(Array.isArray(tripsRes.data.data) ? tripsRes.data.data : []);
      setCategories(Array.isArray(categoriesRes.data.data) ? categoriesRes.data.data : []);
      setDestinations(Array.isArray(destinationsRes.data.data) ? destinationsRes.data.data : []);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/trips?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress size={50} sx={{ color: '#3397b8' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      
      {/* ========== 1. HERO SECTION ========== */}
      {/* ========== 1. HERO SECTION (خلفية صور متحركة) ========== */}
    <Box
      className="full-width-hero"
      sx={{
        
        borderRadius:0.4
       , color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mt: { xs: -1, sm: 0 }, // ✅ تعويض المسافة مع Navbar
        minHeight: { xs: '7vh', sm: '8vh', md: '10vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 8, sm: 10, md: 12 },
        pb: { xs: 6, sm: 1, md: 10 },
      }}
    >
      {/*  الخلفية المتحركة: سلايدشو + Ken Burns + نقاط تنقل  */}
      <HeroSlideshow />

      {/* ========== المحتوى فوق الخلفية (zIndex: 3) ========== */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>

          {/* العنوان الرئيسي */}
          <Typography
            variant="h1"
            fontWeight="800"
            gutterBottom
            sx={{
              fontSize: {
                xs: '1.5rem',
                sm: '1.8rem',
                md: '2.3rem',
                lg: '2.7rem',
                xl: '3rem'
              },
              letterSpacing: '-0.5px',
              color: '#ffffff',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.35), 0 4px 15px rgba(0, 0, 0, 0.55)',
              lineHeight: { xs: 1.2, md: 1.3 },
              mb: { xs: 2, md: 3 }
            }}
          >
            {t('home.heroTitle')}
          </Typography>

          {/* العنوان الفرعي */}
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 1.5, md: 2, lg: 3 },
              opacity: 0.95,
              fontSize: {
                xs: '0.85rem',
                sm: '0.95rem',
                md: '1.05rem',
                lg: '1.1rem'
              },
              fontWeight: 400,
              maxWidth: '750px',
              mx: 'auto',
              color: '#e2eef7',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
              lineHeight: { xs: 1.5, md: 1.6 },
              px: { xs: 1, sm: 0 }
            }}
          >
            {t('home.heroSubtitle')}
          </Typography>

          {/* صندوق البحث */}
          <Paper
            elevation={8}
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'stretch',
              gap: { xs: 1, sm: 1.5 },
              p: { xs: 1, sm: 1.5 },
              borderRadius: { xs: 2, sm: 3, md: 4 },
              bgcolor: 'white',
              width: '100%',
              maxWidth: { xs: '94%', sm: '480px', md: '560px', lg: '600px' },
              mx: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          >
            <TextField
              fullWidth
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" sx={{
                        fontSize: { xs: 22, sm: 24, md: 28 }
                      }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: { xs: 2, sm: 3 },
                  pl: 1,
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1.3, sm: 1.5 },
                borderRadius: { xs: 2, sm: 3 },
                fontWeight: 700,
                textTransform: 'none',
                fontSize: { xs: '0.95rem', md: '1rem' },
                minWidth: { sm: '140px', md: '160px' },
                bgcolor: '#3397b8',
                '&:hover': {
                  bgcolor: '#217490'
                }
              }}
            >
              {t('common.search')}
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>

      {/* ========== 2. الرحلات المميزة ========== */}
        <Container maxWidth="xl" sx={{ 
        py: { xs: 3, sm: 4, md: 6, lg: 7 }, 
        px: { xs: 3, sm: 4, md: 5 } 
      }}>
          <Box sx={{ mb: { xs: 2.5, md: 3.5, lg: 4 }, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="800" gutterBottom sx={sectionTitleSx}>
            {t('home.featuredTrips')}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '650px', 
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            {t('home.featuredTripsSubtitle')}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5 }}>
          {featuredTrips.map((trip) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={trip.id} sx={{ display: 'flex' }}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>

        {featuredTrips.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'grey.50', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">{t('common.noData')}</Typography>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 5, lg: 6 } }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/trips')}
            sx={{ 
              borderRadius: 3, 
              px: { xs: 4, md: 5 }, 
              py: { xs: 1.2, md: 1.5 }, 
              fontWeight: 600, 
              borderWidth: 2,
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            {t('home.viewAllTrips')}
          </Button>
        </Box>
      </Container>

      {/* ========== 3. الفئات ========== */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, sm: 7, md: 9, lg: 10 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h4" 
            fontWeight="800" 
            sx={{ 
              mb: { xs: 4, md: 5, lg: 6 }, 
              ...sectionTitleSx, 
              textAlign: 'center' 
            }}
          >
            {t('home.categoriesTitle')}
          </Typography>
          
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }} sx={{ justifyContent: 'center' }}>
            {categories.slice(0, 6).map((category) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={category.id}>
                <Box
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/trips?category_id=${category.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/trips?category_id=${category.id}`);
                    }
                  }}
                  sx={{
                    bgcolor: 'white', 
                    p: { xs: 2, sm: 2.5, md: 3 }, 
                    borderRadius: 3, 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                    height: '100%',
                    minHeight: { xs: '120px', sm: '140px', md: '150px' },
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    '&:hover': { 
                      transform: 'translateY(-5px)', 
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)', 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      '& .MuiSvgIcon-root, & .MuiTypography-root': { color: 'white' } 
                    }
                  }}
                >
                  <Category sx={{ 
                    fontSize: { xs: 32, sm: 36, md: 40 }, 
                    color: 'primary.main', 
                    mb: 1.5, 
                    transition: 'color 0.3s' 
                  }} />
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="700" 
                    sx={{ 
                      transition: 'color 0.3s', 
                      textAlign: 'center',
                      fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                      lineHeight: 1.3
                    }}
                  >
                    {category[`name_${language}`] || category.name_ar || category.name_en}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ========== 4. الوجهات الشهيرة ========== */}
      <Container maxWidth="xl" sx={{ 
        py: { xs: 5, sm: 6, md: 8, lg: 10 }, 
        px: { xs: 2, sm: 3, md: 4 } 
      }}>
        <Typography 
          variant="h4" 
          fontWeight="800" 
          sx={{ 
            mb: { xs: 4, md: 5, lg: 6 }, 
            ...sectionTitleSx, 
            textAlign: 'center' 
          }}
        >
          {t('home.destinationsTitle')}
        </Typography>
        
        {destinations.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5 }} sx={{ justifyContent: 'center' }}>
            {destinations.slice(0, 6).map((destination) => {
              const destinationName = destination[`name_${language}`] || destination.name_ar || destination.name_en || t('common.noData');
              const countryName = destination[`country_${language}`] || destination.country_ar || destination.country_en;
              const destinationImage = destination.image_url || destination.image || destination.imageUrl || destination.photo;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={destination.id}>
                  <Box
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/trips?destination_id=${destination.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/trips?destination_id=${destination.id}`);
                      }
                    }}
                    sx={{ 
                      position: 'relative', 
                      height: { xs: 180, sm: 200, md: 220, lg: 240 }, 
                      borderRadius: 3, 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      bgcolor: 'grey.200', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                      '&:hover img': { transform: 'scale(1.08)' },
                      '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
                    }}
                  >
                    <Box 
                      component="img" 
                      src={getImageUrl(destinationImage)} 
                      alt={destinationName} 
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }} 
                      sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'block', 
                        objectFit: 'cover', 
                        transition: 'transform 0.6s ease' 
                      }} 
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)', 
                      color: 'white', 
                      p: { xs: 2, md: 2.5 } 
                    }}>
                      <Typography 
                        variant="h6" 
                        fontWeight="700" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          fontSize: { xs: '1rem', md: '1.15rem' }
                        }}
                      >
                        <LocationOn fontSize="small" /> 
                        {destinationName}
                      </Typography>
                      {countryName && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            opacity: 0.9, 
                            mt: 0.25,
                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                          }}
                        >
                          {countryName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'grey.50', borderRadius: 3 }}>
            <Typography color="text.secondary">{t('common.noData')}</Typography>
          </Box>
        )}
      </Container>

      {/* ========== 5. لماذا تختارنا ========== */}
      <Box className="full-width-hero" sx={{ 
        background: 'linear-gradient(135deg, #0a2540 0%, #1e5f74 100%)',
        color: 'white', 
        py: { xs: 4, sm: 5, md: 6, lg: 7 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* زخارف خلفية */}
        <Box sx={{ 
          position: 'absolute', 
          top: { xs: -30, md: -50 }, 
          right: { xs: -30, md: -50 }, 
          width: { xs: 200, md: 300 }, 
          height: { xs: 200, md: 300 }, 
          bgcolor: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '50%' 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: { xs: -50, md: -80 }, 
          left: { xs: -50, md: -80 }, 
          width: { xs: 250, md: 400 }, 
          height: { xs: 250, md: 400 }, 
          bgcolor: 'rgba(255, 255, 255, 0.04)', 
          borderRadius: '50%' 
        }} />

        <Container maxWidth="lg" sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 }
        }}>
          
          <Typography 
            variant="h4" 
            fontWeight="800" 
            sx={{ 
              mb: { xs: 3, md: 4, lg: 5 }, 
              color: '#ecf5fc', 
              textShadow: '0 0 20px rgba(255,255,255,0.5), 0 4px 15px rgba(0, 0, 0, 0.4)',
              textAlign: 'center',
              fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.9rem', lg: '2.1rem' }
            }}
          >
            {t('home.whyChooseUs')}
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ justifyContent: 'center' }}>
            {[1, 2, 3].map((num) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={num}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: { xs: 2, sm: 2.5, md: 3 }, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.08)', 
                  backdropFilter: 'blur(10px)', 
                  border: '1px solid rgba(255,255,255,0.15)',
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderColor: 'rgba(255,255,255,0.25)'
                  }
                }}>
                  <Box sx={{ 
                    bgcolor: 'white', 
                    color: '#1e5f74', 
                    width: { xs: 60, sm: 65, md: 70 }, 
                    height: { xs: 60, sm: 65, md: 70 }, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mx: 'auto', 
                    mb: { xs: 2, md: 3 }, 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)' 
                  }}>
                    <Star sx={{ fontSize: { xs: 30, sm: 33, md: 36 } }} />
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    fontWeight="700" 
                    gutterBottom 
                    sx={{ 
                      color: '#ecf5fc',
                      fontSize: { xs: '1.15rem', sm: '1.25rem', md: '1.4rem' }
                    }}
                  >
                    {t(`home.feature${num}Title`)}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9, 
                      lineHeight: 1.7, 
                      color: '#c2d0db',
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' }
                    }}
                  >
                    {t(`home.feature${num}Desc`)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ========== 6. أحدث المقالات ========== */}
      <LatestArticles />
    </Box>
  );
}