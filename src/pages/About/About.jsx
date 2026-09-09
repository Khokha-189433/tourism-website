import { useTranslation } from 'react-i18next'
import {
  Container, Box, Typography, Stack, Grid, Paper, Chip,
  Fade, Grow, Divider
} from '@mui/material'
import {
  Info as InfoIcon,
  Visibility as VisionIcon,
  Flag as MissionIcon,
  Favorite as ValuesIcon,
  Public as GlobeIcon, 
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  SupportAgent as SupportIcon,
  Star as StarIcon,
  People as PeopleIcon,
  FlightTakeoff as FlightIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Compare as CompareIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function About() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const navigate = useNavigate()

  // ===== الرؤية والرسالة والقيم =====
  const visionMission = [
    {
      icon: <VisionIcon sx={{ fontSize: 36 }} />,
      title: t('about.vision_title', 'رؤيتنا'),
      description: t(
        'about.vision_desc',
        'أن نكون المنصة الرقمية الأولى في سوريا والمنطقة لعرض روائع السياحة السورية للعالم، ونموذجاً يحتذى به في التحول الرقمي للقطاع السياحي.'
      ),
      gradient: 'linear-gradient(135deg, #3397b8 0%, #0a2540 100%)',
    },
    {
      icon: <MissionIcon sx={{ fontSize: 36 }} />,
      title: t('about.mission_title', 'رسالتنا'),
      description: t(
        'about.mission_desc',
        'تقديم تجربة حجز سياحية متكاملة وآمنة وسهلة، تربط بين المسافرين وأجمل الوجهات السورية، مع ضمان أعلى معايير الجودة والشفافية.'
      ),
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      icon: <ValuesIcon sx={{ fontSize: 36 }} />,
      title: t('about.values_title', 'قيمنا'),
      description: t(
        'about.values_desc',
        'الجودة، الشفافية، الأمان، الابتكار، واحترام وقت وثقة عملائنا. نضع راحة المسافر في صدارة أولوياتنا في كل تفصيل.'
      ),
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
  ]

  // ===== لماذا نحن؟ =====
  const whyUs = [
    {
      icon: <ShieldIcon sx={{ fontSize: 32 }} />,
      title: t('about.why_security', 'أمان مطلق'),
      desc: t('about.why_security_desc', 'دفع إلكتروني آمن عبر بوابة SamaPay المعتمدة، مع تشفير كامل لبياناتك'),
      color: '#10b981',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: t('about.why_fast', 'حجز فوري'),
      desc: t('about.why_fast_desc', 'من التصفح إلى التأكيد في دقائق معدودة، دون انتظار أو مكالمات هاتفية'),
      color: '#3397b8',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 32 }} />,
      title: t('about.why_support', 'دعم 24/7'),
      desc: t('about.why_support_desc', 'فريق متخصص جاهز لمساعدتك في أي وقت ومن أي مكان'),
      color: '#f59e0b',
    },
    {
      icon: <StarIcon sx={{ fontSize: 32 }} />,
      title: t('about.why_quality', 'جودة مضمونة'),
      desc: t('about.why_quality_desc', 'شركاء موثوقون من فنادق وشركات نقل ومرشدين سياحيين معتمدين'),
      color: '#8b5cf6',
    },
    {
      icon: <GlobeIcon sx={{ fontSize: 32 }} />,
      title: t('about.why_global', 'تجربة عالمية'),
      desc: t('about.why_global_desc', 'واجهة حديثة بلغتين مع دعم كامل للهاتف والتابلت والديسكتوب'),
      color: '#ec4899',
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 32 }} />,
      title: t('about.why_trust', 'موثوقية عالية'),
      desc: t('about.why_trust_desc', 'آلاف المسافرين الراضين وتقييمات حقيقية من عملاء سابقين'),
      color: '#ef4444',
    },
  ]

  // ===== مقارنة مع المواقع العالمية =====
  const comparison = [
    {
      name: 'Booking.com',
      flag: '🇳🇱',
      features: [
        t('about.cmp_booking_1', 'أكبر منصة فنادق عالمية'),
        t('about.cmp_booking_2', 'ملايين التقييمات الموثقة'),
        t('about.cmp_booking_3', 'دعم متعدد اللغات 24/7'),
      ],
    },
    {
      name: 'TripAdvisor',
      flag: '🇺🇸',
      features: [
        t('about.cmp_trip_1', 'أكبر مجتمع مراجعات سياحية'),
        t('about.cmp_trip_2', 'توصيات مبنية على الذكاء الجمعي'),
        t('about.cmp_trip_3', 'دليل سفر تفاعلي'),
      ],
    },
    {
      name: 'Expedia',
      flag: '🇺🇸',
      features: [
        t('about.cmp_expedia_1', 'حزم متكاملة (طيران + فندق + سيارة)'),
        t('about.cmp_expedia_2', 'برنامج مكافآت ولاء'),
        t('about.cmp_expedia_3', 'ضمان أفضل سعر'),
      ],
    },
  ]

  // ===== الإحصائيات =====
  const stats = [
    { number: '50+', label: t('about.stat_destinations', 'وجهة سياحية'), icon: <FlightIcon /> },
    { number: '200+', label: t('about.stat_trips', 'رحلة متاحة'), icon: <GlobeIcon /> },
    { number: '5K+', label: t('about.stat_travelers', 'مسافر سعيد'), icon: <PeopleIcon /> },
    { number: '4.8', label: t('about.stat_rating', 'تقييم العملاء'), icon: <StarIcon /> },
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: BRAND.pageBg, position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />

      {/* ========== الهيرو ========== */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
          color: 'white',
          py: { xs: 7, sm: 8, md: 11 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in>
            <Box>
              <Grow in timeout={600}>
                <Stack direction="row" spacing={2}  sx={{ mb: 2  , alignItems:"center", justifyContent:"center" }}>
                  <GlobeIcon sx={{
                    fontSize: { xs: 32, md: 44 }, color: '#7fd4e8',
                    filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                    animation: 'aboutFloat 3s ease-in-out infinite',
                  }} />
                  <Typography variant="h2" fontWeight="900" sx={{
                    fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                    animation: 'aboutGlow 3s ease-in-out infinite',
                  }}>
                    {t('about.title', 'من نحن')}
                  </Typography>
                  <InfoIcon sx={{
                    fontSize: { xs: 32, md: 44 }, color: '#7fd4e8',
                    filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                    animation: 'aboutFloat 3s ease-in-out infinite',
                    animationDelay: '1.5s',
                  }} />
                </Stack>
              </Grow>

              <Typography variant="body1" sx={{
                maxWidth: 720, mx: 'auto', color: '#d7e9f2',
                textShadow: '0 0 10px rgba(127,212,232,0.5)', lineHeight: 1.8,
              }}>
                {t(
                  'about.subtitle',
                  'نحن لسنا مجرد منصة حجز — نحن بوابة رقمية تفتح أمامك كنوز سوريا السياحية، بتصميم عالمي وتجربة محلية أصيلة'
                )}
              </Typography>
            </Box>
          </Fade>
        </Container>

        <Box component="style">{`
          @keyframes aboutGlow {
            0%, 100% { text-shadow: 0 0 14px rgba(127,212,232,0.75), 0 0 34px rgba(51,151,184,0.5); }
            50% { text-shadow: 0 0 26px rgba(127,212,232,1), 0 0 60px rgba(51,151,184,0.85); }
          }
          @keyframes aboutFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</Box>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ========== من نحن (القصة) ========== */}
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 }, mb: 6, borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.06)',
              bgcolor: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: BRAND.gradient,
            }} />

            <Grid container spacing={4}  sx={{alignItems:"center"}}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Chip
                  icon={<GlobeIcon sx={{ fontSize: 16 }} />}
                  label={t('about.our_story_badge', 'قصتنا')}
                  sx={{
                    mb: 2, bgcolor: 'rgba(51,151,184,0.1)', color: BRAND.primary,
                    fontWeight: 700, px: 1.5, height: 32,
                  }}
                />
                <Typography variant="h4" fontWeight="900" color="#0f172a" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {t('about.story_title', 'رحلة بدأت بحلم... وتحولت إلى واقع')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 2 }}>
                  {t(
                    'about.story_p1',
                    'بدأت فكرتنا من ملاحظة بسيطة: سوريا بلد غني بالمواقع الأثرية والطبيعية الخلابة — من تدمر العريقة إلى ساحل اللاذقية، ومن دمشق القديمة إلى قلعة الحصن — لكن معظم هذه الكنوز تبقى بعيدة عن متناول المسافرين بسبب غياب منصة رقمية موحدة.'
                  )}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                  {t(
                    'about.story_p2',
                    'من هنا، قررنا بناء منصة بمعايير عالمية تجمع بين سهولة Booking.com ومجتمع TripAdvisor وتجربة Expedia المتكاملة، لكن بلمسة سورية أصيلة تفهم احتياجات المسافر المحلي والعربي.'
                  )}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{
                  background: BRAND.gradient,
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                  <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

                  <Typography variant="h5" fontWeight="800" sx={{ mb: 2, position: 'relative' }}>
                    {t('about.our_promise', 'وعدنا لك')}
                  </Typography>
                  <Stack spacing={1.5} sx={{ position: 'relative' }}>
                    {[
                      t('about.promise_1', 'شفافية كاملة في الأسعار والخدمات'),
                      t('about.promise_2', 'دعم فني حقيقي وليس روبوتات'),
                      t('about.promise_3', 'حماية بياناتك الشخصية بأعلى المعايير'),
                      t('about.promise_4', 'استرداد أموالك في حال الإلغاء حسب السياسة'),
                    ].map((item, i) => (
                      <Stack key={i} direction="row" spacing={1.5} sx={{alignItems7:"flex-start"}}>
                        <CheckIcon sx={{ fontSize: 20, color: '#fbbf24', flexShrink: 0, mt: 0.3 }} />
                        <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* ========== الإحصائيات ========== */}
        <Grid container spacing={2.5} sx={{ mb: 8 }}>
          {stats.map((stat, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={i}>
              <Grow in timeout={400 + i * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3, textAlign: 'center', borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(10,37,64,0.12)',
                      borderColor: `${BRAND.primary}40`,
                    },
                  }}
                >
                  <Box sx={{
                    width: 60, height: 60, mx: 'auto', mb: 1.5,
                    background: BRAND.gradient,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 6px 18px rgba(51,151,184,0.4)',
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" fontWeight="900" color={BRAND.primary} sx={{ fontSize: '2.2rem' }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" fontWeight="600" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* ========== الرؤية والرسالة والقيم ========== */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip
            icon={<TrendingIcon sx={{ fontSize: 16 }} />}
            label={t('about.foundations_badge', 'أساسياتنا')}
            sx={{
              mb: 2, bgcolor: 'rgba(51,151,184,0.1)', color: BRAND.primary,
              fontWeight: 700, px: 1.5, height: 32,
            }}
          />
          <Typography variant="h4" fontWeight="900" color="#0f172a" sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
            {t('about.foundations_title', 'ما الذي يحركنا؟')}
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {visionMission.map((item, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Grow in timeout={500 + i * 150}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 }, height: '100%', borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 36px rgba(10,37,64,0.12)',
                    },
                  }}
                >
                  <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                    background: item.gradient,
                  }} />
                  <Box sx={{
                    width: 72, height: 72, borderRadius: 3,
                    background: item.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', mb: 2,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="800" color="#0f172a" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {item.description}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* ========== لماذا نحن؟ ========== */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip
            icon={<TrophyIcon sx={{ fontSize: 16 }} />}
            label={t('about.why_badge', 'لماذا نحن؟')}
            sx={{
              mb: 2, bgcolor: 'rgba(51,151,184,0.1)', color: BRAND.primary,
              fontWeight: 700, px: 1.5, height: 32,
            }}
          />
          <Typography variant="h4" fontWeight="900" color="#0f172a" sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
            {t('about.why_title', 'ما الذي يميزنا عن غيرنا؟')}
          </Typography>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: 8 }}>
          {whyUs.map((item, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Grow in timeout={400 + i * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3, height: '100%', borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 28px ${item.color}25`,
                      borderColor: item.color,
                    },
                  }}
                >
                  <Box sx={{
                    width: 64, height: 64, borderRadius: 2.5,
                    bgcolor: `${item.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, mb: 2,
                    transition: 'all 0.3s ease',
                    '.MuiPaper-root:hover &': {
                      bgcolor: item.color, color: 'white', transform: 'rotate(-5deg) scale(1.08)',
                    },
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* ========== مقارنة مع المواقع العالمية ========== */}
        <Fade in timeout={900}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 }, mb: 8, borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.06)',
              bgcolor: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Chip
                icon={<CompareIcon sx={{ fontSize: 16 }} />}
                label={t('about.cmp_badge', 'على خطى العمالقة')}
                sx={{
                  mb: 2, bgcolor: 'rgba(51,151,184,0.1)', color: BRAND.primary,
                  fontWeight: 700, px: 1.5, height: 32,
                }}
              />
              <Typography variant="h4" fontWeight="900" color="#0f172a" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {t('about.cmp_title', 'نسير على خطى أفضل المنصات العالمية')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto' }}>
                {t(
                  'about.cmp_subtitle',
                  'استلهمنا أفضل الممارسات من عمالقة الصناعة وطبقناها بمعايير تناسب السوق السوري والعربي'
                )}
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              {comparison.map((site, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3, height: '100%', borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.06)',
                      bgcolor: '#f8fafc',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5}  sx={{ mb: 2 ,alignItems:"center"}}>
                      <Typography variant="h4">{site.flag}</Typography>
                      <Typography variant="h6" fontWeight="800" color="#0f172a">
                        {site.name}
                      </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      {site.features.map((feature, j) => (
                        <Stack key={j} direction="row" spacing={1} sx={{alignItems:"flex-start"}}>
                          <CheckIcon sx={{ fontSize: 18, color: '#10b981', flexShrink: 0, mt: 0.3 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{
              mt: 4, p: 3, borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(51,151,184,0.08) 0%, rgba(16,185,129,0.08) 100%)',
              border: `1px solid ${BRAND.primary}30`,
              textAlign: 'center',
            }}>
              <Typography variant="body1" fontWeight="700" color="#0f172a" gutterBottom>
                {t(
                  'about.cmp_conclusion_title',
                  '✨ نحن نأخذ الأفضل منهم... ونضيف لمسة سورية أصيلة'
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {t(
                  'about.cmp_conclusion',
                  'نفس الأمان، نفس السهولة، نفس الجودة العالمية — لكن بفهم عميق لاحتياجات المسافر العربي ودعم كامل للغة والثقافة المحلية.'
                )}
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* ========== CTA النهائي ========== */}
        <Fade in timeout={1100}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 }, borderRadius: 4, mb: 6,
              background: BRAND.gradient,
              color: 'white', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
            <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" fontWeight="900" sx={{ mb: 1.5, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                {t('about.cta_title', 'جاهز لاكتشاف سوريا كما لم ترها من قبل؟')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
                {t(
                  'about.cta_subtitle',
                  'انضم إلى آلاف المسافرين الذين يثقون بنا في تخطيط رحلاتهم'
                )}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}  sx={{justifyContent:"center"}}>
                <Button
                  variant="contained" size="large"
                  onClick={() => navigate('/trips')}
                  startIcon={<FlightIcon />}
                  sx={{
                    bgcolor: 'white', color: BRAND.primary,
                    fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.95)', transform: 'translateY(-2px)' },
                  }}
                >
                  {t('about.explore_trips', 'استكشف الرحلات')}
                </Button>
                <Button
                  variant="outlined" size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    borderColor: 'white', color: 'white',
                    fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  {t('about.contact_us', 'تواصل معنا')}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}