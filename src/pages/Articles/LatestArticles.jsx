import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Box, Button, Card, CardContent, Stack
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon, 
  Person as PersonIcon, 
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import API from '../../API/axios'; 

export default function LatestArticles() {
  const { t, i18n } = useTranslation();
  const language = i18n.language === 'en' ? 'en' : 'ar';
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await API.get('/articles?limit=3&status=published');
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) return null;
  if (articles.length === 0) return null;

  // ✅ الحل: تغليف المحتوى بـ Fragment <> لمنع أي خطأ في تحليل الكود
  return (
    <>
      <Box sx={{
       
        py: 10,
        mt: 5,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* زخارف خلفية ناعمة مشابهة للهيرو */}
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* تطبيق نفس تنسيقات عنوان الـ Hero بالضبط */}
          <Typography 
            variant="h3" 
            fontWeight="800" 
            sx={{ 
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
              letterSpacing: '-0.5px',
              color: '#445058',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.4)',
               textAlign:"center" 
            }}
          >
            {t('home.latestArticles')}
          </Typography>

          <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: "stretch" }}>
            {articles.map((article) => {
              const title = article[`title_${language}`] || article.title_ar || article.title_en || t('common.noData');
              const excerpt = article[`excerpt_${language}`] || article.excerpt_ar || article.excerpt_en || '';
              const publishDate = formatDate(article.created_at || article.published_at);

              // التعامل الذكي مع الكاتب (نص أو كائن)
              let authorName = language === 'ar' ? 'فريق التحرير' : 'Editorial Team';
              if (article.author) {
                if (typeof article.author === 'object' && article.author !== null) {
                  authorName = `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim() || authorName;
                } else {
                  authorName = article.author;
                }
              }
              return (
                <Grid size={{ xs: 12, md: 4 }} key={article.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card 
                    sx={{ 
                      height: '460px',
                      width: '460px',
                      maxWidth: '100%',
                      flexShrink: 0,
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderTop: '3px solid',
                      borderTopColor: '#5b96ccf0',
                    
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      overflow: 'hidden',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                        borderColor: 'rgba(255,255,255,0.4)',
                        '& .article-title': { color: '#01659b' },
                        '& .arrow-icon': {
                          transform: language === 'ar' ? 'translateX(-6px) rotate(180deg)' : 'translateX(6px)'
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      {/* معلومات الميتا: التاريخ والكاتب */}
                      <Stack direction="row" spacing={2} sx={{ mb: 2.5, color: 'text.secondary', flexWrap: 'wrap' }}>
                        <Stack direction="row" spacing={0.75} sx={{alignItems:"center"}}>
                          <CalendarIcon sx={{ fontSize: 16, color: '#01659b' }} />
                          <Typography variant="caption" fontWeight="600">{publishDate}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.75}  sx={{alignItems:"center"}}>
                          <PersonIcon sx={{ fontSize: 16, color: '#01659b' }} />
                          <Typography variant="caption" fontWeight="600">{authorName}</Typography>
                        </Stack>
                      </Stack>

                      {/* عنوان المقالة */}
                      <Typography 
                        className="article-title"
                        variant="h6" 
                        fontWeight="700" 
                        sx={{ 
                          height: '3.2em',
                          lineHeight: 1.6,
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden',
                          mb: 2,
                          color: '#1e293b',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {title}
                      </Typography>

                      {/* مقتطف المقالة */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          height: '4.8em',
                          lineHeight: 1.6,
                          display: '-webkit-box', 
                          WebkitLineClamp: 3, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden',
                          mb: 3
                        }}
                      >
                        {excerpt}
                      </Typography>

                      {/* زر اقرأ المزيد مع انميشن للسهم */}
                      <Button
                        component={RouterLink}
                        to={`/blog/${article.slug}`}
                        variant="outlined"
                        endIcon={
                          <ArrowForwardIcon 
                            className="arrow-icon" 
                            sx={{ 
                              transition: 'transform 0.3s ease',
                              transform: language === 'ar' ? 'rotate(180deg)' : 'none'
                            }} 
                          />
                        }
                        sx={{ 
                          mt: 'auto',
                          alignSelf: 'flex-start', 
                          borderRadius: 2, 
                          textTransform: 'none', 
                          fontWeight: 700,
                          px: 2.5, py: 1, 
                          borderWidth: 1.5,
                         
                          color: '#01659b',
                          '&:hover': {
                            borderWidth: 1.5, 
                            bgcolor: '#01659b', 
                            color: 'white', 
                            borderColor: '#01659b',
                            boxShadow: '0 4px 12px rgba(1, 101, 155, 0.3)'
                          }
                        }}
                      >
                        {t('common.readMore') || 'اقرأ المزيد'}
                      </Button>

                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </>
  );
}