import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, TextField, InputAdornment, Select,
  MenuItem, FormControl, InputLabel, Pagination, CircularProgress, Alert,
  Button, useMediaQuery, useTheme, Paper, Stack, Slider , Fade ,Grow
} from '@mui/material';
import { Search, FilterList, RestartAlt, ExpandMore, ExpandLess  , ModeOfTravel} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import API from "../../API/axios";
import TripCard from '../../components/Ui/TripCard';

export default function TripsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    destination_id: searchParams.get('destination_id') || '',
    min_price: parseInt(searchParams.get('min_price')) || 0,
    max_price: parseInt(searchParams.get('max_price')) || 1000000,
    duration_min: searchParams.get('duration_min') || '',
    duration_max: searchParams.get('duration_max') || '',
    start_date: searchParams.get('start_date') || '',
    end_date: searchParams.get('end_date') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'DESC',
  });

  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const limit = 12;

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [catRes, destRes] = await Promise.all([
          API.get('/categories'),
          API.get('/destinations')
        ]);
        setCategories(catRes.data.data || []);
        setDestinations(destRes.data.data || []);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [filters, page]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 0) {
          params.append(key, value);
        }
      });

      const res = await API.get(`/trips?${params.toString()}`);
      setTrips(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '' && v !== 0) {
        params.append(k, v);
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      category_id: '',
      destination_id: '',
      min_price: 0,
      max_price: 1000000,
      duration_min: '',
      duration_max: '',
      start_date: '',
      end_date: '',
      sort_by: 'created_at',
      sort_order: 'DESC',
    };
    setFilters(resetFilters);
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    handleFilterChange('sort_by', field);
    setFilters(prev => ({ ...prev, sort_by: field, sort_order: order }));
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (['sort_by', 'sort_order'].includes(key)) return false;
    if (key === 'min_price' && value === 0) return false;
    if (key === 'max_price' && value === 1000000) return false;
    return value && value !== '';
  }).length;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>

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
                      
                        <ModeOfTravel sx={{
                          fontSize: { xs: 26, sm: 32, md: 40 },
                          color: '#7fd4e8',
                          filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                          animation: 'heroIconFloat 3s ease-in-out infinite',
                        }} />
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
                           {t('trips.pageTitle') || 'اكتشف وجهتك التالية'}
                        </Typography>
      
                      </Stack>
      
                      {/* ✅ الوصف بتوهج خفيف */}
                      <Typography variant="body1" sx={{
                        maxWidth: 620, mx: 'auto',
                        color: '#d7e9f2',
                        textShadow: '0 0 10px rgba(127,212,232,0.5), 0 2px 6px rgba(0,0,0,0.4)',
                      }}>
                        {pagination.total} {t('trips.availableTrips') || 'رحلة متاحة بانتظارك لاستكشافها'}
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

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        
        {/* 2. قسم الفلاتر بعرض كامل الشاشة */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'rgba(0,0,0,0.06)',
            bgcolor: 'white',
            overflow: 'hidden'
          }}
        >
          {/* رأس قسم الفلاتر */}
          <Box 
            sx={{ 
              p: 2.5, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: filtersExpanded ? '1px solid' : 'none',
              borderColor: 'rgba(0,0,0,0.06)',
              cursor: 'pointer'
            }}
            onClick={() => setFiltersExpanded(!filtersExpanded)}
          >
            <Stack direction="row" spacing={1.5}  sx={{alignItems:"center" }}>
              <Box sx={{ 
                bgcolor: '#3397b8', 
                color: 'white', 
                width: 40, 
                height: 40, 
                borderRadius: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <FilterList />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="700" color="#0f172a">
                  {t('trips.filterTitle') || 'تصفية الرحلات'}
                </Typography>
                {activeFiltersCount > 0 && (
                  <Typography variant="caption" color="#3397b8" fontWeight="600">
                    {activeFiltersCount} {t('trips.activeFilters') || 'فلاتر نشطة'}
                  </Typography>
                )}
              </Box>
            </Stack>
            
            <Stack direction="row" spacing={1}  sx={{alignItems:"center" }}>
              {activeFiltersCount > 0 && (
                <Button
                  startIcon={<RestartAlt />}
                  onClick={(e) => { e.stopPropagation(); handleResetFilters(); }}
                  sx={{ 
                    textTransform: 'none', 
                    color: '#64748b',
                    '&:hover': { color: '#ef4444' }
                  }}
                >
                  {t('trips.resetFilters') || 'إعادة تعيين'}
                </Button>
              )}
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </Stack>
          </Box>

          {filtersExpanded && (
            <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'rgba(0,0,0,0.06)' }}>
              <Grid container spacing={3}>
                
                <Grid xs={12} md={6} lg={4} sx={{width:"100%"}}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t('trips.searchPlaceholder') || 'ابحث عن رحلة...'}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: '#94a3b8', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={2} sx={{width:"45%"}}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('trips.category') || 'الفئة'}</InputLabel>
                    <Select
                      value={filters.category_id}
                      onChange={(e) => handleFilterChange('category_id', e.target.value)}
                      label={t('trips.category') || 'الفئة'}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">{t('common.all') || 'الكل'}</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {i18n.language === 'ar' ? cat.name_ar : cat.name_en}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={2} sx={{width:"45%"}} >
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('trips.destination') || 'الوجهة'}</InputLabel>
                    <Select
                      value={filters.destination_id}
                      onChange={(e) => handleFilterChange('destination_id', e.target.value)}
                      label={t('trips.destination') || 'الوجهة'}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">{t('common.all') || 'الكل'}</MenuItem>
                      {destinations.map((dest) => (
                        <MenuItem key={dest.id} value={dest.id}>
                          {i18n.language === 'ar' ? dest.name_ar : dest.name_en}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={2}sx={{width:"45%"}} >
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label={t('trips.startDate') || 'تاريخ البداية'}
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                   slotProps={{
                   inputLabel: { shrink: true }
                   }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={2} sx={{width:"45%"}} >
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label={t('trips.endDate') || 'تاريخ النهاية'}
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    slotProps={{
                    inputLabel: { shrink: true }
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid xs={12}>
                  <Box sx={{ px: 1, pt: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600" color="#475569" sx={{ mb: 2 }}>
                      {t('trips.priceRange') || 'نطاق السعر'}: 
                      <Typography component="span" color="#217490" fontWeight="700" sx={{ mx: 1 }}>
                        {filters.min_price.toLocaleString()} - {filters.max_price.toLocaleString()} {t('common.currency') || 'ل.س'}
                      </Typography>
                    </Typography>
                    <Slider
                      value={[filters.min_price, filters.max_price]}
                      onChange={(_, newValue) => {
                        setFilters(prev => ({ ...prev, min_price: newValue[0], max_price: newValue[1] }));
                      }}
                      onChangeCommitted={() => {
                        setPage(1);
                        const params = new URLSearchParams();
                        Object.entries({ ...filters, min_price: filters.min_price, max_price: filters.max_price }).forEach(([k, v]) => {
                          if (v && v !== '' && v !== 0) params.append(k, v);
                        });
                        setSearchParams(params);
                      }}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000000}
                      step={10000}
                      sx={{
                        color: '#3397b8',
                        '& .MuiSlider-thumb': {
                          width: 20,
                          height: 20,
                          '&:hover': { boxShadow: '0 0 0 8px rgba(51, 151, 184, 0.15)' }
                        },
                        '& .MuiSlider-track': { height: 6, borderRadius: 3 },
                        '& .MuiSlider-rail': { height: 6, borderRadius: 3, bgcolor: '#e2e8f0' }
                      }}
                    />
                  </Box>
                </Grid>

              </Grid>
            </Box>
          )}
        </Paper>

        {/*  شريط الأدوات (بحث وترتيب) */}
        <Paper 
          elevation={0} 
          sx={{ 
            width: "100%",
            p: 2, 
            mb: 4, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'rgba(40, 77, 128, 0.27)',
            bgcolor: 'white'
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{justifyContent:"space-between" , alignItems:"center"}} >
            <Typography variant="body2" color="text.secondary" fontWeight="600">
              {t('trips.showingResults') || 'عرض'} {trips.length} {t('trips.of') || 'من'} {pagination.total} {t('trips.results') || 'نتيجة'}
            </Typography>

            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
              <InputLabel>{t('common.sort') || 'ترتيب حسب'}</InputLabel>
              <Select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onChange={handleSortChange}
                label={t('common.sort') || 'ترتيب حسب'}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="created_at-DESC">{t('trips.sort_newest') || 'الأحدث'}</MenuItem>
                <MenuItem value="created_at-ASC">{t('trips.sort_oldest') || 'الأقدم'}</MenuItem>
                <MenuItem value="price-ASC">{t('trips.sort_price_low') || 'السعر: من الأقل'}</MenuItem>
                <MenuItem value="price-DESC">{t('trips.sort_price_high') || 'السعر: من الأعلى'}</MenuItem>
                <MenuItem value="duration_days-ASC">{t('trips.sort_duration_short') || 'المدة: من الأقصر'}</MenuItem>
                <MenuItem value="duration_days-DESC">{t('trips.sort_duration_long') || 'المدة: من الأطول'}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#3397b8' }} size={40} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

      
        {!loading && !error && (
          <>
            <Grid container spacing={3}>
              {trips.map((trip) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={trip.id} sx={{ display: 'flex' }}>
                  <TripCard trip={trip} />
                </Grid>
              ))}
            </Grid>

            {trips.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="h5" color="text.secondary" fontWeight="600" gutterBottom>
                  {t('trips.noTripsFound') || 'لم يتم العثور على رحلات'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('trips.tryDifferentFilters') || 'جرب تغيير معايير البحث أو الفلاتر'}
                </Typography>
              </Box>
            )}

            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': { borderRadius: 2, fontWeight: 600 },
                    '& .Mui-selected': { bgcolor: '#3397b8', color: 'white' }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}