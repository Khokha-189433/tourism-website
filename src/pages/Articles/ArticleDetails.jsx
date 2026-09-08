import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container, Typography, Box, Button, Paper, Divider, CircularProgress, Alert, Stack, Chip, Fade
} from '@mui/material'
import { 
  CalendarToday as CalendarIcon, 
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Article as ArticleIcon,
  Share as ShareIcon,
  FormatQuote as FormatQuoteIcon, // ✅ أيقونة اقتباس جديدة للجمالية
  Tag as TagIcon
} from '@mui/icons-material'
import { articlesService } from '../Articles/articlesService'

export default function ArticleDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const language = i18n.language === 'en' ? 'en' : 'ar'

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await articlesService.getBySlug(slug)
        setArticle(data)
      } catch (err) {
        console.error('فشل جلب المقالة:', err)
        setError(t('article.error_loading') || 'تعذر تحميل المقالة')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
    window.scrollTo({ top: 0, behavior: 'smooth' }) // ✅ تمرير ناعم للأعلى
  }, [slug, t])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-SY' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article ? (article[`title_${language}`] || article.title_ar) : '',
          url: window.location.href
        })
      } catch (err) {
        console.log('تم إلغاء المشاركة')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(t('article.link_copied') || 'تم نسخ الرابط')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#4facfe' }} size={50} />
      </Box>
    )
  }

  if (error || !article) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error || t('article.not_found') || 'المقالة غير موجودة'}</Alert>
        <Button variant="contained" onClick={() => navigate('/blog')} sx={{ borderRadius: 2, px: 4 }}>
          {t('article.back_to_blog') || 'العودة إلى المدونة'}
        </Button>
      </Container>
    )
  }

  const title = article[`title_${language}`] || article.title_ar || article.title_en
  const content = article[`content_${language}`] || article.content_ar || article.content_en
  
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

  const publishDate = formatDate(article.created_at || article.published_at)

  return (
    <Box sx={{ 
     
      minHeight: '100vh', 
      py: { xs: 4, md: 6 } 
    }}>
      <Container maxWidth="lg">
        
        {/* زر العودة */}
        <Button
          component={RouterLink}
          to="/blog"
          startIcon={<ArrowBackIcon sx={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />}
          sx={{ 
            mb: 3, 
            textTransform: 'none', 
            fontWeight: 600, 
            color: '#64748b',
            transition: 'all 0.3s ease',
            '&:hover': { color: '#4facfe', transform: 'translateX(-5px)' }
          }}
        >
          {t('article.back_to_blog') || 'العودة إلى المدونة'}
        </Button>

      
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4, 
              border: '1px solid', 
              color: 'white',
              borderColor: 'rgba(92, 90, 90, 0.895)',
             background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
              position: 'relative', overflow: 'hidden' 
            }}
            
          >
            {/* شارة المقال */}
            <Chip 
              icon={<ArticleIcon sx={{ fontSize: 18 }} />} 
              label={t('article.badge') || 'مقالة'} 
              sx={{ 
                mb: 3, 
                fontWeight: 700, 
                bgcolor: 'rgba(232, 237, 241, 0.862)', 
                color: '#01659b',
                px: 1
              }}
            />

            {/* العنوان */}
            <Typography 
              variant="h3" 
              fontWeight="800" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '1.75rem', md: '2.2rem' }, 
                lineHeight: 1.4,
                mb: 3,
                color: '#121b32',
                letterSpacing: '-0.5px'
              }}
            >
              {title}
            </Typography>

            {/* معلومات المقال (بتصميم كبسولات أنيقة) */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                mb: 4, 
                flexWrap: 'wrap',
                pb: 3,
                borderBottom: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ 
                display: 'flex', alignItems: 'center', gap: 1, 
                bgcolor: 'rgba(154, 178, 199, 0.08)', px: 1.5, py: 0.75, borderRadius: 2 
              }}>
                <CalendarIcon sx={{ fontSize: 18, color: '#4facfe' }} />
                <Typography variant="body2" fontWeight="600" color="#334155">{publishDate}</Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', alignItems: 'center', gap: 1, 
                bgcolor: 'rgba(152, 174, 193, 0.08)', px: 1.5, py: 0.75, borderRadius: 2 
              }}>
                <PersonIcon sx={{ fontSize: 18, color: '#4facfe' }} />
                <Typography variant="body2" fontWeight="600" color="#334155">{authorName}</Typography>
              </Box>

              <Button
                startIcon={<ShareIcon sx={{ fontSize: 18 }} />}
                onClick={handleShare}
                size="small"
                sx={{ 
                  ml: 'auto', 
                  textTransform: 'none', 
                  fontWeight: 600, 
                  color: '#a6bad7',
                  border: '1px solid #49586cb0',
                  borderRadius: 2,
                  px: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#134065',
                    color: 'white',
                    borderColor: '#4facfe',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
                  }
                }}
              >
                {t('article.share') || 'مشاركة'}
              </Button>
            </Stack>

            {/* المقتطف (بتصميم اقتباس فاخر) */}
            {article[`excerpt_${language}`] && (
              <Box sx={{ 
                position: 'relative',
                mb: 4, 
                p: 3,
                bgcolor: '#c3cfda',
                borderRadius: 3,
                borderLeft: '4px solid', // في العربية يظهر على اليمين تلقائياً مع dir=rtl
                borderColor: '#5393ca'
              }}>
                <FormatQuoteIcon sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  left: language === 'ar' ? 'auto' : 12,
                  right: language === 'ar' ? 12 : 'auto',
                  fontSize: 40, 
                  color: '#02111e', 
                  opacity: 0.2 
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontStyle: 'italic', 
                    lineHeight: 1.8,
                    color: '#808388',
                    fontWeight: 500,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {article[`excerpt_${language}`]}
                </Typography>
              </Box>
            )}

            {/* محتوى المقال */}
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 2, 
                fontSize: '1.05rem',
                color: '#e0eef5',
                whiteSpace: 'pre-line',
                '& p': { mb: 2.5 },
                '& h2': { mt: 5, mb: 2, fontWeight: 700, color: '#0f172a', fontSize: '1.5rem' },
                '& h3': { mt: 4, mb: 2, fontWeight: 600, color: '#1e293b', fontSize: '1.25rem' },
                '& ul, & ol': { pl: 3, mb: 2.5, color: '#334155' },
                '& li': { mb: 1 }
              }}
            >
              {content}
            </Typography>

            {/* الفواصل والتاجات */}
            {article.tags && article.tags.length > 0 && (
              <>
                <Divider sx={{ my: 5, borderColor: 'rgba(0,0,0,0.06)' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#64748b' }}>
                  <TagIcon sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight="700">{t('article.tags') || 'الوسوم:'}</Typography>
                </Box>
                <Stack direction="row" spacing={1}  useFlexGap sx={{ gap: 1 , flexWrap:"wrap"}}>
                  {article.tags.map((tag, i) => (
                    <Chip 
                      key={i} 
                      label={`#${tag}`} 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2,
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: '#4facfe',
                          color: 'white',
                          borderColor: '#627788',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(79, 172, 254, 0.2)'
                        }
                      }} 
                    />
                  ))}
                </Stack>
              </>
            )}

            {/* أزرار التنقل السفلية */}
            <Divider sx={{ my: 5, borderColor: 'rgba(0,0,0,0.06)' }} />
            <Stack direction="row" spacing={2} sx={{justifyContent:"space-between"}}>
              <Button
                component={RouterLink}
                to="/blog"
                variant="outlined"
                startIcon={<ArrowBackIcon sx={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: '#eef8ff',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                  transition: 'all 0.3s ease',
                   '&:hover': {
                    bgcolor: '#0b6180',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(79, 172, 254, 0.4)'
                  }
                }}
              >
                {t('article.all_articles') || 'جميع المقالات'}
              </Button>
              <Button
                variant="contained"
                onClick={handleShare}
                startIcon={<ShareIcon />}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: '#08406a',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#0b6180',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(79, 172, 254, 0.4)'
                  }
                }}
              >
                {t('article.share') || 'مشاركة'}
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}