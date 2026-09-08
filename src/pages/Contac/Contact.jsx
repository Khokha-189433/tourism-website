import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container, Grid, Box, Typography, Stack, TextField, Button, Paper,
  Fade, Grow, Chip, Alert, IconButton, Divider
} from '@mui/material'
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as ClockIcon,
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Telegram as TelegramIcon,
  SupportAgent as SupportIcon,
  Forum as ForumIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // معلومات الاتصال
  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ fontSize: 28 }} />,
      title: t('contact.phone', 'اتصل بنا'),
      values: ['+963 11 123 4567', '+963 944 567 890'],
      action: 'tel:+963111234567',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      icon: <EmailIcon sx={{ fontSize: 28 }} />,
      title: t('contact.email', 'البريد الإلكتروني'),
      values: ['info@travelgo.sy', 'support@travelgo.sy'],
      action: 'mailto:info@travelgo.sy',
      color: '#3397b8',
      gradient: 'linear-gradient(135deg, #3397b8, #1e5f74)',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 28 }} />,
      title: t('contact.address', 'العنوان'),
      values: [
        isRTL ? 'شارع بغداد، المزة' : 'Baghdad Street, Mezzeh',
        isRTL ? 'دمشق، سوريا' : 'Damascus, Syria'
      ],
      action: 'https://maps.google.com/?q=Damascus+Mezzeh',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    },
    {
      icon: <ClockIcon sx={{ fontSize: 28 }} />,
      title: t('contact.hours', 'أوقات العمل'),
      values: [
        isRTL ? 'السبت - الخميس: 9ص - 6م' : 'Sat - Thu: 9AM - 6PM',
        isRTL ? 'الجمعة: مغلق' : 'Friday: Closed'
      ],
      action: null,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  ]

  // التواصل الاجتماعي
  const socialLinks = [
    { icon: <WhatsAppIcon />, color: '#25d366', label: 'WhatsApp', url: 'https://wa.me/963944567890' },
    { icon: <FacebookIcon />, color: '#1877f2', label: 'Facebook', url: 'https://facebook.com/travelgo' },
    { icon: <InstagramIcon />, color: '#e4405f', label: 'Instagram', url: 'https://instagram.com/travelgo' },
    { icon: <TelegramIcon />, color: '#0088cc', label: 'Telegram', url: 'https://t.me/travelgo' },
    { icon: <TwitterIcon />, color: '#1da1f2', label: 'Twitter', url: 'https://twitter.com/travelgo' },
  ]

  // الأسئلة الشائعة
  const faqs = [
    {
      q: isRTL ? 'كيف يمكنني حجز رحلة؟' : 'How can I book a trip?',
      a: isRTL
        ? 'يمكنك التصفح من صفحة الرحلات، اختيار الرحلة المناسبة، والضغط على زر "احجز الآن" لإكمال عملية الحجز والدفع.'
        : 'Browse our trips page, choose your trip, and click "Book Now" to complete booking and payment.',
    },
    {
      q: isRTL ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
      a: isRTL
        ? 'نقبل الدفع عبر بوابة SamaPay الآمنة، والتي تدعم البطاقات المصرفية المحلية والدولية.'
        : 'We accept payment via the secure SamaPay gateway, supporting local and international bank cards.',
    },
    {
      q: isRTL ? 'هل يمكنني إلغاء حجزي؟' : 'Can I cancel my booking?',
      a: isRTL
        ? 'نعم، الإلغاء متاح مجاناً قبل 7 أيام من تاريخ الرحلة. بعد ذلك قد تُطبق رسوم إلغاء حسب سياسة كل رحلة.'
        : 'Yes, free cancellation is available 7 days before the trip. Cancellation fees may apply afterward.',
    },
    {
      q: isRTL ? 'هل الرحلات تشمل التأمين؟' : 'Are trips insured?',
      a: isRTL
        ? 'جميع رحلاتنا تشمل تأمين سفر أساسي. يمكنك ترقية التغطية عند إتمام الحجز.'
        : 'All our trips include basic travel insurance. You can upgrade coverage during booking.',
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = t('contact.required', 'هذا الحقل مطلوب')
    if (!formData.email.trim()) errs.email = t('contact.required', 'هذا الحقل مطلوب')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = t('contact.invalid_email', 'بريد إلكتروني غير صالح')
    if (!formData.message.trim()) errs.message = t('contact.required', 'هذا الحقل مطلوب')
    else if (formData.message.trim().length < 10)
      errs.message = t('contact.message_short', 'يجب أن تكون الرسالة 10 أحرف على الأقل')
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    // محاكاة إرسال الطلب - يمكن ربطه لاحقاً بـ POST /contact
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      transition: 'all 0.3s ease',
      '&:hover': { '& fieldset': { borderColor: BRAND.primary } },
      '&.Mui-focused': { '& fieldset': { borderColor: BRAND.primary, borderWidth: 2 } },
    },
  }

  return (
    <Box sx={{ minHeight: '100vh', background: BRAND.pageBg, position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />

      {/* ========== 🎨 الهيرو ========== */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
          color: 'white',
          py: { xs: 7, sm: 8, md: 10 },
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
                <Stack direction="row" spacing={2}  sx={{ mb: 2  , alignItems:"center", justifyContent:"center"}}>
                  <ForumIcon sx={{
                    fontSize: { xs: 32, md: 44 },
                    color: '#7fd4e8',
                    filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                    animation: 'heroIconFloat 3s ease-in-out infinite',
                  }} />
                  <Typography
                    variant="h2"
                    fontWeight="900"
                    sx={{
                      fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                      color: '#ffffff',
                      animation: 'titleGlow 3s ease-in-out infinite',
                    }}
                  >
                    {t('contact.title', 'تواصل معنا')}
                  </Typography>
                  <SupportIcon sx={{
                    fontSize: { xs: 32, md: 44 },
                    color: '#7fd4e8',
                    filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                    animation: 'heroIconFloat 3s ease-in-out infinite',
                    animationDelay: '1.5s',
                  }} />
                </Stack>
              </Grow>

              <Typography variant="body1" sx={{
                maxWidth: 620, mx: 'auto', color: '#d7e9f2',
                textShadow: '0 0 10px rgba(127,212,232,0.5)',
              }}>
                {t('contact.subtitle', 'نحن هنا لمساعدتك في التخطيط لرحلتك المثالية. فريقنا جاهز للإجابة على استفساراتك على مدار الساعة')}
              </Typography>

              {/* شارات سريعة */}
              <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 4 ,  justifyContent:"center"  , flexWrap:"wrap" }}>
                <Chip icon={<CheckIcon sx={{ fontSize: 16 }} />} label={t('contact.fast_response', 'رد سريع')}
                  sx={{ bgcolor: 'rgba(16,185,129,0.2)', color: '#6ee7b7', fontWeight: 700, border: '1px solid rgba(16,185,129,0.4)' }} />
                <Chip icon={<CheckIcon sx={{ fontSize: 16 }} />} label={t('contact.expert_support', 'دعم متخصص')}
                  sx={{ bgcolor: 'rgba(51,151,184,0.2)', color: '#7fd4e8', fontWeight: 700, border: '1px solid rgba(51,151,184,0.4)' }} />
                <Chip icon={<CheckIcon sx={{ fontSize: 16 }} />} label={t('contact.available_247', 'متاح 24/7')}
                  sx={{ bgcolor: 'rgba(251,191,36,0.2)', color: '#fcd34d', fontWeight: 700, border: '1px solid rgba(251,191,36,0.4)' }} />
              </Stack>
            </Box>
          </Fade>
        </Container>

        <Box component="style">{`
          @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 14px rgba(127,212,232,0.75), 0 0 34px rgba(51,151,184,0.5); }
            50% { text-shadow: 0 0 26px rgba(127,212,232,1), 0 0 60px rgba(51,151,184,0.85); }
          }
          @keyframes heroIconFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</Box>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ========== بطاقات معلومات الاتصال ========== */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 8 }}>
          {contactInfo.map((info, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Grow in timeout={300 + i * 100}>
                <Paper
                  component={info.action ? 'a' : 'div'}
                  href={info.action || undefined}
                  target={info.action?.startsWith('http') ? '_blank' : undefined}
                  rel={info.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  elevation={0}
                  sx={{
                    p: 3, borderRadius: 3, textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white', height: '100%',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 12px 32px ${info.color}25`,
                      borderColor: info.color,
                    },
                  }}
                >
                  <Box sx={{
                    width: 70, height: 70, borderRadius: '50%',
                    background: info.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', mb: 2,
                    boxShadow: `0 6px 18px ${info.color}40`,
                    transition: 'transform 0.3s ease',
                    '.MuiPaper-root:hover &': { transform: 'scale(1.1) rotate(-5deg)' },
                  }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom>
                    {info.title}
                  </Typography>
                  {info.values.map((v, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ fontWeight: 600, lineHeight: 1.7 }}>
                      {v}
                    </Typography>
                  ))}
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* ========== النموذج + الخريطة ========== */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 8 }}>

          {/* نموذج الاتصال */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Fade in timeout={700}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 }, borderRadius: 3, height: '100%',
                  border: '1px solid rgba(0,0,0,0.06)',
                  bgcolor: 'white',
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ mb: 3 , alignItems:"center" }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: 2,
                    background: BRAND.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(51,151,184,0.3)',
                  }}>
                    <SendIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="800" color="#0f172a">
                      {t('contact.send_message', 'أرسل لنا رسالة')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('contact.response_time', 'سنرد عليك خلال 24 ساعة')}
                    </Typography>
                  </Box>
                </Stack>

                {submitted && (
                  <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 3, borderRadius: 2 }}>
                    {t('contact.sent_success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً')}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth label={t('contact.name', 'الاسم الكامل')} name="name"
                        value={formData.name} onChange={handleChange}
                        error={!!errors.name} helperText={errors.name}
                        required sx={inputSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth label={t('contact.email_label', 'البريد الإلكتروني')} name="email"
                        type="email" value={formData.email} onChange={handleChange}
                        error={!!errors.email} helperText={errors.email}
                        required sx={inputSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth label={t('contact.phone_label', 'رقم الهاتف (اختياري)')} name="phone"
                        value={formData.phone} onChange={handleChange}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth label={t('contact.subject', 'الموضوع')} name="subject"
                        value={formData.subject} onChange={handleChange}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth multiline rows={5}
                        label={t('contact.message_label', 'رسالتك')} name="message"
                        value={formData.message} onChange={handleChange}
                        error={!!errors.message} helperText={errors.message}
                        required sx={inputSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit" fullWidth size="large" variant="contained"
                        disabled={submitting}
                        endIcon={submitting ? null : <ArrowIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
                        sx={{
                          ...gradientButtonSx,
                          py: 1.5, fontWeight: 700, textTransform: 'none',
                          borderRadius: 2.5, fontSize: '1rem',
                          '&.Mui-disabled': { opacity: 0.7 },
                        }}
                      >
                        {submitting ? t('contact.sending', 'جاري الإرسال...') : t('contact.send', 'إرسال الرسالة')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* الخريطة + التواصل الاجتماعي */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* الخريطة */}
             {/* خريطة Google Maps Embed (مجانية وبدون API key) */}
            <Fade in timeout={900}>
            <Paper
            elevation={0}
            sx={{
                borderRadius: 3, overflow: 'hidden', height: 340,
                border: '1px solid rgba(0,0,0,0.06)',
                position: 'relative',
            }}
            >
            <iframe
                title="TravelGo Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.847!2d36.2765!3d33.5138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMwJzQ5LjciTiAzNsKwMTYnMzUuNCJF!5e0!3m2!1sar!2s!4v1234567890"
                style={{ width: '100%', height: '100%', border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            <Box sx={{
                position: 'absolute', bottom: 12, left: 12,
                bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                px: 2, py: 1, borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', gap: 1,
            }}>
                <LocationIcon sx={{ fontSize: 18, color: BRAND.primary }} />
                <Typography variant="body2" fontWeight="700" color="#0f172a">
                {t('contact.our_office', 'مكتبنا الرئيسي')}
                </Typography>
            </Box>
            </Paper>
            </Fade>

              {/* التواصل الاجتماعي */}
              <Fade in timeout={1100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3, borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                  }}
                >
                  <Typography variant="h6" fontWeight="800" color="#0f172a" gutterBottom sx={{ mb: 2 }}>
                    {t('contact.follow_us', 'تابعنا على')}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{flexWrap:"wrap"}} useFlexGap>
                    {socialLinks.map((social) => (
                      <IconButton
                        key={social.label}
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.label}
                        sx={{
                          width: 52, height: 52,
                          bgcolor: `${social.color}15`,
                          color: social.color,
                          border: `1.5px solid ${social.color}30`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: social.color,
                            color: 'white',
                            transform: 'translateY(-4px) scale(1.08)',
                            boxShadow: `0 8px 20px ${social.color}40`,
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {t('contact.social_hint', 'انضم إلى مجتمعنا الذي يضم أكثر من 50,000 مسافر')}
                  </Typography>
                </Paper>
              </Fade>
            </Stack>
          </Grid>
        </Grid>

        {/* ========== الأسئلة الشائعة ========== */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              label={t('contact.faq_badge', 'أسئلة شائعة')}
              sx={{
                mb: 2, bgcolor: 'rgba(51,151,184,0.1)', color: BRAND.primary,
                fontWeight: 700, px: 1.5, height: 32,
              }}
            />
            <Typography variant="h4" fontWeight="900" color="#0f172a" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
              {t('contact.faq_title', 'الأسئلة الأكثر شيوعاً')}
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {faqs.map((faq, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Grow in timeout={400 + i * 120}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3, borderRadius: 3, height: '100%',
                      border: '1px solid rgba(0,0,0,0.06)',
                      bgcolor: 'white',
                      transition: 'all 0.35s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(10,37,64,0.1)',
                        borderColor: `${BRAND.primary}40`,
                      },
                    }}
                  >
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2,
                      background: `linear-gradient(135deg, ${BRAND.primary}20, ${BRAND.primary}10)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: BRAND.primary, fontWeight: 900, fontSize: '1.1rem',
                      mb: 2,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="800" color="#0f172a" sx={{ mb: 1, lineHeight: 1.4 }}>
                      {faq.q}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {faq.a}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ========== CTA النهائي ========== */}
        <Fade in timeout={1200}>
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
                {t('contact.cta_title', 'جاهز لبدء مغامرتك؟')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
                {t('contact.cta_subtitle', 'دع فريقنا يساعدك في تصميم رحلة لا تُنسى تناسب اهتماماتك وميزانيتك')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent:"center"}}>
                <Button
                  variant="contained" size="large"
                  href="tel:+963992943382"
                  startIcon={<PhoneIcon />}
                  sx={{
                    bgcolor: 'white', color: BRAND.primary,
                    fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.95)', transform: 'translateY(-2px)' },
                  }}
                >
                  {t('contact.call_now', 'اتصل الآن')}
                </Button>
                <Button
                  variant="outlined" size="large"
                  href="https://wa.me/963992943382"
                  target="_blank"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    borderColor: 'white', color: 'white',
                    fontWeight: 700, textTransform: 'none', borderRadius: 2.5, px: 4,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  {t('contact.whatsapp_us', 'واتساب')}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}