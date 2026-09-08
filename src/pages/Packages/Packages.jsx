import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../API/axios'
import PackageCard from '../../components/Ui/PackageCard'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'
import {
  Container, Grid, Box, Typography, Stack, TextField, InputAdornment,
  Button, Select, MenuItem, FormControl, InputLabel, Chip, Pagination,
  Alert, Fade, Grow, Paper
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Luggage as PackageIcon,
  FlightTakeoff as FlightIcon
} from '@mui/icons-material'

export default function Packages() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const [searchParams, setSearchParams] = useSearchParams()

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  // فلاتر من URL
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort_by: searchParams.get('sort_by') || 'createdAt',
    sort_order: searchParams.get('sort_order') || 'DESC',
    status: 'published',
  })

  // تحديث URL عند تغيير الفلاتر
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'createdAt' && value !== 'DESC') {
        params.set(key, value)
      }
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  // جلب البيانات
  useEffect(() => {
    fetchPackages()
  }, [filters])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value)
        }
      })

      const { data } = await api.get(`/packages?${params.toString()}`)
      const list = Array.isArray(data.data) ? data.data : (data.data?.packages || [])
      setPackages(list)
      setPagination(data.pagination || null)
    } catch (err) {
      console.error('Fetch packages error:', err)
      setError(t('packages.fetch_error', 'فشل تحميل الباقات'))
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))
  }

  const handleReset = () => {
    setFilters({
      page: 1, limit: 12, search: '', min_price: '', max_price: '',
      sort_by: 'createdAt', sort_order: 'DESC', status: 'published',
    })
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: BRAND.pageBg,
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ========== ✨ الهيرو: عنوان مضيء + أيقونات عائمة ========== */}
      <Box
        className="full-width-hero"
        sx={{
       
     
          background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
          color: 'white',
          py: { xs: 7, sm: 8, md: 14},
          mb: 5,
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        {/* زخارف الخلفية */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        <Fade in={true}>
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, px: 2 }}>
            <Grow in={true} timeout={600}>
              <Box sx={{textAlign:"center"}}>
                
                  <PackageIcon sx={{
                    fontSize: { xs: 26, sm: 32, md: 40 },
                    color: '#7fd4e8',
                    filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                    animation: 'heroIconFloat 3s ease-in-out infinite',
                  }} />
                {/* ✅ العنوان المضيء مع أيقونات عائمة على الجانبين */}
                <Stack direction="column-reverse" spacing={4} sx={{ mb: 1.5 , alignItems:"center" ,justifyConten:"center"  }}>
                   
                  <Typography
                    variant="h1"
                    fontWeight="900"
                    sx={{
                      fontSize: { xs: '1.8rem', sm: '2.4rem', md: '4rem' },
                      letterSpacing: '-0.5px',
                      color: '#f1f1f1',
                      animation: 'titleGlow 3s ease-in-out infinite',
                    }}
                  >
                    {t('packages.title', 'الباقات السياحية')} 
                  </Typography>

                </Stack>

                {/* ✅ الوصف بتوهج خفيف */}
                <Typography variant="body1" sx={{
                  maxWidth: 620, mx: 'auto',
                  color: '#d7e9f2',
                  textShadow: '0 0 10px rgba(127,212,232,0.5), 0 2px 6px rgba(0,0,0,0.4)',
                }}>
                  {t('packages.subtitle', 'اكتشف باقاتنا الشاملة التي تجمع بين الرحلات والفنادق ووسائل النقل في تجربة واحدة متكاملة')}
                </Typography>
              </Box>
            </Grow>
          </Box>
        </Fade>

        {/* ✅ حركات التوهج والطفو */}
        <Box component="style">{`
          @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 14px rgba(127,212,232,0.75), 0 0 34px rgba(51,151,184,0.5), 0 2px 6px rgba(0,0,0,0.4); }
            50%      { text-shadow: 0 0 26px rgba(127,212,232,1), 0 0 60px rgba(51,151,184,0.85), 0 2px 6px rgba(0,0,0,0.4); }
          }
          @keyframes heroIconFloat {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }
        `}</Box>
      </Box>

      <Container maxWidth="xl" sx={{ pb: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>

        {/* ========== شريط الفلاتر ========== */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 }, mb: 4, borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            {/* البحث */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('packages.search_placeholder', 'ابحث عن باقة...')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
              />
            </Grid>

            {/* الترتيب */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('packages.sort', 'الترتيب')}</InputLabel>
                <Select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  label={t('packages.sort', 'الترتيب')}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    setFilters((prev) => ({ ...prev, sort_by: sortBy, sort_order: sortOrder, page: 1 }))
                  }}
                  sx={{ borderRadius: 2, bgcolor: 'white' }}
                >
                  <MenuItem value="createdAt-DESC">{t('packages.newest', 'الأحدث')}</MenuItem>
                  <MenuItem value="createdAt-ASC">{t('packages.oldest', 'الأقدم')}</MenuItem>
                  <MenuItem value="price-ASC">{t('packages.price_low', 'السعر: من الأقل')}</MenuItem>
                  <MenuItem value="price-DESC">{t('packages.price_high', 'السعر: من الأعلى')}</MenuItem>
                  <MenuItem value="duration_days-ASC">{t('packages.duration_short', 'المدة: الأقصر')}</MenuItem>
                  <MenuItem value="duration_days-DESC">{t('packages.duration_long', 'المدة: الأطول')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* عدد النتائج */}
            <Grid size={{ xs: 6, sm: 3, md: 3, lg: 4 }}>
              <Chip
                icon={<PackageIcon sx={{ fontSize: 18 }} />}
                label={`${pagination?.total || 0} ${t('packages.package_found', 'باقة')}`}
                sx={{
                  bgcolor: 'rgba(51,151,184,0.1)',
                  color: BRAND.primary,
                  fontWeight: 700,
                  px: 1,
                }}
              />
            </Grid>

            {/* زر إعادة التعيين */}
            <Grid size={{ xs: 12, sm: 12, md: 3, lg: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{
                  borderColor: BRAND.primary,
                  color: BRAND.primary,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                {t('packages.reset', 'إعادة تعيين')}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* ========== عرض النتائج (✅ 5 بطاقات بالصف) ========== */}
        {loading ? (
          <Grid container spacing={{ xs: 2, md: 2 }}>
            {[...Array(10)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={i}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        ) : packages.length === 0 ? (
          <Fade in={true}>
            <Paper
              elevation={0}
              sx={{
                p: 6, textAlign: 'center', borderRadius: 4,
                border: '2px dashed #cbd5e1',
                bgcolor: 'rgba(255,255,255,0.9)',
              }}
            >
              <PackageIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" fontWeight="700" color="#0f172a" gutterBottom>
                {t('packages.no_results', 'لا توجد باقات مطابقة')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('packages.try_different', 'جرب تغيير معايير البحث')}
              </Typography>
              <Button variant="contained" onClick={handleReset} sx={{ ...gradientButtonSx, borderRadius: 2.5, textTransform: 'none', fontWeight: 700, px: 4 }}>
                {t('packages.reset_filters', 'إعادة تعيين الفلاتر')}
              </Button>
            </Paper>
          </Fade>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, md: 2 }}>
              {packages.map((pkg, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={pkg.id}>
                  <Grow in={true} timeout={300 + index * 80}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                      <PackageCard package={pkg} />
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Fade in={true}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={(_, v) => handleFilterChange('page', v)}
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'scale(1.1)' },
                      },
                      '& .Mui-selected': {
                        bgcolor: `${BRAND.primary} !important`,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(51,151,184,0.35)',
                      },
                    }}
                  />
                </Box>
              </Fade>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

// ========== Skeleton مصغّر ==========
const SkeletonCard = () => (
  <Paper sx={{ borderRadius: 2.5, overflow: 'hidden', height: '100%' }}>
    <Box sx={{ height: 150, bgcolor: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <Box sx={{ p: 2 }}>
      <Box sx={{ height: 18, bgcolor: '#e2e8f0', borderRadius: 1, mb: 1, width: '85%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ height: 12, bgcolor: '#e2e8f0', borderRadius: 1, width: '100%', mb: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ height: 12, bgcolor: '#e2e8f0', borderRadius: 1, width: '70%', mb: 1.5, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Box sx={{ height: 20, bgcolor: '#e2e8f0', borderRadius: 1, width: '50%', mb: 1.5, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <Stack direction="row" spacing={1}>
        <Box sx={{ flex: 1, height: 30, bgcolor: '#e2e8f0', borderRadius: 1.5, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <Box sx={{ flex: 1, height: 30, bgcolor: '#e2e8f0', borderRadius: 1.5, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </Stack>
    </Box>
  </Paper>
)