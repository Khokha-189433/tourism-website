import { useState, useEffect } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container, Typography, Box, Grid, Card, CardContent, TextField, 
  InputAdornment, Pagination, CircularProgress, Button, Stack, Chip
} from '@mui/material'
import { 
  Search as SearchIcon, 
  CalendarToday as CalendarIcon, 
  Person as PersonIcon,
  Article as ArticleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { articlesService } from '../Articles/articlesService'

export default function Blog() {
  const { t, i18n } = useTranslation()
  const language = i18n.language === 'en' ? 'en' : 'ar'
  const [searchParams, setSearchParams] = useSearchParams()

  const [articles, setArticles] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage, limit: 9, status: 'published' };
        if (search.trim()) params.search = search;

        const result = await articlesService.getAll(params);
        
        if (isMounted) {
          setArticles(result.articles);
          setPagination(result.pagination);
        }
      } catch (err) {
        if (isMounted) {
          console.error('فشل جلب المقالات:', err);
          if (err.response?.status === 429) {
            console.warn('⚠️ تم حظر الطلبات مؤقتاً بسبب التكرار السريع.');
          }
          setArticles([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticles();
    return () => { isMounted = false; };
  }, [currentPage, search]);

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ page: 1, search: search.trim() })
  }

  const handlePageChange = (_, newPage) => {
    setSearchParams({ page: newPage, search: search.trim() })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-SY' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  }

  return (
    <Box sx={{
      minHeight: '100vh', 
      bgcolor: '#f8f9fc',
      position: 'relative',
        marginTop:-3,
      overflow: 'hidden'
      
    }}>
      {/* أشكال خلفية متحركة ناعمة */}
      <Box sx={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        bgcolor: 'rgba(79, 172, 254, 0.08)', borderRadius: '50%',
        filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite'
      }} />
      <Box sx={{
       
        position: 'absolute', bottom: -50, left: -100, width: 300, height: 300,
        bgcolor: 'rgba(118, 75, 162, 0.08)', borderRadius: '50%',
        filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite reverse'
      }} />

      {/* رأس الصفحة بتدرج لوني ناعم (Hero Section) */}
      <Box className="full-width-hero" sx={{
        background: 'linear-gradient(135deg, #0a2540 0%, #4297b4 100%)', color: 'white', py: { xs: 8, sm: 10, md: 13 }, position: 'relative', overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 20,
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        marginBottom:4,
        minHeight: { xs: 360, md: 430 }
      }}>
        <Container maxWidth="md">
          <Box sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            p: 1.5, 
            borderRadius: '50%', 
            display: 'inline-flex', 
            mb: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <ArticleIcon sx={{ fontSize: 36, color: 'white' }} />
          </Box>
          
       
          <Typography 
            variant="h3" 
            fontWeight="800" 
            gutterBottom 
            sx={{ 
              letterSpacing: '-0.5px',
              fontSize: { xs: '2rem', md: '2.5rem' }, 
              color: '#ecf5fc', 
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.4)', 
            }}
          >
            {t('blog.title') || 'مقالات ونصائح سياحية'}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              maxWidth: 600, 
              mx: 'auto', 
              fontWeight: 400,
              color: '#c2d0db',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}
          >
            {t('blog.subtitle') || 'اكتشف أحدث المقالات والنصائح لعطلتك المثالية'}
          </Typography>
            {/* شريط البحث العائم */}
        <Box sx={{   
          maxWidth: 600, 
          mx: 'auto', 
          marginTop:3
        }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              gap: 1,
              bgcolor: 'white',
              p: 1.5,
              borderRadius: 4,
              boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s ease',
              '&:focus-within': {
                boxShadow: '0 20px 40px rgba(159, 191, 218, 0.15)',
                borderColor: '#4facfe'
              }
            }}
          >
            <TextField
              fullWidth
              placeholder={t('blog.search_placeholder') || 'ابحث عن وجهة، نصيحة، أو مقال...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                startAdornment: (
                <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 24, color: '#4facfe' }} />
                </InputAdornment>
                ),
                },
               
              }}
   
              sx={{ 
                '& .MuiInputBase-root': { 
                  borderRadius: 3, 
                  bgcolor: '#f8f9fc',
                  px: 1
                } 
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color='inherit'
              sx={{ 
                px: 4, 
                borderRadius: 3, 
                fontWeight: 700, 
                textTransform: 'none',
                '&:hover': { bgcolor: '#8cbbce' },
                boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
              }}
            >
              {t('common.search') || 'بحث'}
            </Button>
          </Box>
        </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: 8 }}>
        
      

        {/* عرض حالة التحميل */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#4facfe' }} size={40} />
          </Box>
        ) : articles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <ArticleIcon sx={{ fontSize: 64, color: '#cfd8dc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight="600">
              {search ? (t('blog.no_search_results') || 'لا توجد نتائج لبحثك') : (t('blog.no_articles') || 'لا توجد مقالات حالياً')}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
              {pagination.total} {t('blog.articles_count') || 'مقالة'}
              {search && <Box component="span" sx={{ color: '#4facfe', fontWeight: 700 }}> "{search}"</Box>}
            </Typography>

            <Grid container spacing={4}>
              {articles.map((article) => {
                const title = article[`title_${language}`] || article.title_ar || article.title_en || ''
                const excerpt = article[`excerpt_${language}`] || article.excerpt_ar || article.excerpt_en || ''
                const publishDate = formatDate(article.created_at || article.published_at)

                let authorName = language === 'ar' ? 'فريق التحرير' : 'Editorial Team';
                if (article.author) {
                  if (typeof article.author === 'object' && article.author !== null) {
                    authorName = `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim() || authorName;
                  } else {
                    authorName = article.author;
                  }
                } else if (article.author_name) {
                  authorName = article.author_name;
                }

                return (
                  <Grid xs={12} sm={6} md={4} key={article.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card 
                      sx={{ 
                        height: '460px',
                        width: '460px',
                        maxWidth: '100%',
                        flexShrink: 0,
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'rgba(0,0,0,0.04)',
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: 0, right: 0,
                          height: '4px',
                          background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        },
                        '&:hover': { 
                          transform: 'translateY(-8px)', 
                          boxShadow: '0 20px 40px rgba(79, 172, 254, 0.12)',
                          borderColor: 'rgba(79, 172, 254, 0.3)',
                          '&::before': { opacity: 1 },
                          '& .article-title': { color: '#4facfe' }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        {/* معلومات الميتا */}
                        <Stack direction="row" spacing={2} sx={{ mb: 2.5, color: 'text.secondary', flexWrap: 'wrap' }}>
                          <Stack direction="row" spacing={0.75}  sx={{ alignItems: 'center' }}>
                            <CalendarIcon sx={{ fontSize: 16, color: '#4facfe' }} />
                            <Typography variant="caption" fontWeight="600">{publishDate}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                            <PersonIcon sx={{ fontSize: 16, color: '#4facfe' }} />
                            <Typography variant="caption" fontWeight="600">{authorName}</Typography>
                          </Stack>
                        </Stack>

                        {/* العنوان */}
                        <Typography 
                          className="article-title"
                          variant="h6" 
                          fontWeight="700" 
                          sx={{ 
                            mb: 2, 
                            lineHeight: 1.4, 
                            height: '3.5em',
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden',
                            color: '#2d3748',
                            transition: 'color 0.3s ease'
                          }}
                        >
                          {title}
                        </Typography>

                        {/* المقتطف */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 3, 
                            lineHeight: 1.8, 
                            height: '5.4em',
                            display: '-webkit-box', 
                            WebkitLineClamp: 3, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden' 
                          }}
                        >
                          {excerpt}
                        </Typography>

                        {/* زر اقرأ المزيد */}
                        <Button
                          component={RouterLink}
                          to={`/blog/${article.slug}`}
                          variant="outlined"
                          endIcon={
                            <ArrowForwardIcon className="arrow-icon" sx={{ 
                              transition: 'transform 0.3s ease',
                              transform: language === 'ar' ? 'rotate(180deg)' : 'none'
                            }} />
                          }
                          sx={{ 
                            mt: 'auto', 
                            alignSelf: 'flex-start', 
                            borderRadius: 3, 
                            textTransform: 'none', 
                            fontWeight: 700,
                            px: 2.5, py: 1, 
                            borderWidth: 1.5,
                            borderColor: '#e2e8f0',
                            color: '#4a5568',
                            '&:hover': {
                              borderWidth: 1.5, 
                              bgcolor: '#4facfe', 
                              color: 'white', 
                              borderColor: '#4facfe',
                              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                              '& .arrow-icon': {
                                transform: language === 'ar' ? 'translateX(-4px) rotate(180deg)' : 'translateX(4px)'
                              }
                            }
                          }}
                        >
                          {t('common.readMore') || 'اقرأ المزيد'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* الترقيم */}
            {pagination.totalPages > 1 && (
              <Stack mt={6} sx={{ alignItems: 'center' }}>
                <Pagination
                  count={pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 3,
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    },
                    '& .Mui-selected': {
                      bgcolor: '#4facfe',
                      color: 'white',
                      boxShadow: '0 4px 10px rgba(79, 172, 254, 0.3)'
                    }
                  }}
                />
              </Stack>
            )}
          </>
        )}
      </Container>

      {/* تعريف حركة الـ Animation للخلفية */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  )
}