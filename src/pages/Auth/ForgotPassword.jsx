import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../API/axios'
import AuthLayout from '../../components/Ui/AuthLayout'
import {
  Box, Typography, TextField, Button, Stack, IconButton,
  InputAdornment, Alert, CircularProgress, Fade
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  LockReset as LockResetIcon,
  CheckCircle as CheckIcon,
  Shield as ShieldIcon,
  SupportAgent as SupportIcon,
  MarkEmailRead as MarkEmailReadIcon
} from '@mui/icons-material'

export default function ForgotPassword() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isRTL = i18n.language === 'ar'

  // ✅ إذا جاء المستخدم من صفحة الدخول مع بريد، استخدمه تلقائياً
  const initialEmail = location.state?.email || ''

  const [step, setStep] = useState(1) // 1: email, 2: code + password, 3: success
  const [formData, setFormData] = useState({
    email: initialEmail,
    code: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  // قوة كلمة المرور
  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }
  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['ضعيفة', 'مقبولة', 'جيدة', 'قوية', 'قوية جداً']
  const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669']

  // الخطوة 1: إرسال رمز التحقق
  const handleSendCode = async (e) => {
    e.preventDefault()
    setApiError(null)

    if (!formData.email) {
      setErrors({ email: t('auth.emailRequired') || 'البريد الإلكتروني مطلوب' })
      return
    }

    setLoading(true)
    try {
      // ✅ Endpoint: تأكد من هذا المسار في ملف axios الخاص بك
      await api.post('/auth/forgot-password', { email: formData.email })
      setStep(2)
    } catch (err) {
      console.error('Forgot password error:', err)
      setApiError(err.response?.data?.message || t('login.send_failed'))
    } finally {
      setLoading(false)
    }
  }

  // الخطوة 2: التحقق من الرمز وتغيير كلمة المرور
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setApiError(null)

    const newErrors = {}
    if (!formData.code) newErrors.code = 'رمز التحقق مطلوب'
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة'
    else if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    else if (passwordStrength < 2) newErrors.password = 'كلمة المرور ضعيفة جداً'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // ✅ Endpoint: تأكد من هذا المسار في ملف axios الخاص بك
      await api.post('/auth/change-password', {
        email: formData.email,
        code: formData.code,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      })
      setStep(3)
      // العودة لتسجيل الدخول بعد 3 ثوانٍ
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      console.error('Reset password error:', err)
      setApiError(err.response?.data?.message || t('login.reset_failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: null })
  }

  const features = [
    { icon: <ShieldIcon sx={{ fontSize: 24 }} />, title: t('login.forgot_feature_1_title'), desc: t('login.forgot_feature_1_desc') },
    { icon: <MarkEmailReadIcon sx={{ fontSize: 24 }} />, title: t('login.forgot_feature_2_title'), desc: t('login.forgot_feature_2_desc') },
    { icon: <SupportIcon sx={{ fontSize: 24 }} />, title: t('login.forgot_feature_3_title'), desc: t('login.forgot_feature_3_desc') },
  ]

  return (
    <AuthLayout
      title={t('login.forgot_title')}
      subtitle={t('login.forgot_subtitle')}
      features={features}
    >
      {/* العنوان الديناميكي */}
      <Box sx={{ textAlign: { xs: 'center', md: 'start' }, mb: 3 }}>
        <Box sx={{
          width: 50, height: 50,
          background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
          borderRadius: 2,
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center', justifyContent: 'center',
          mb: 2, mx: 'auto',
          boxShadow: '0 8px 24px rgba(51, 151, 184, 0.3)',
        }}>
          <LockResetIcon sx={{ fontSize: 26, color: 'white' }} />
        </Box>

        {step !== 3 && (
          <Button
            startIcon={<ArrowBackIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
            component={RouterLink}
            to="/login"
            sx={{ mb: 2, textTransform: 'none', color: '#64748b', fontWeight: 600, p: 0, '&:hover': { color: '#3397b8', bgcolor: 'transparent' } }}
          >
            {t('login.back_to_login')}
          </Button>
        )}

        <Typography variant="h3" fontWeight="800" color="#0f172a" gutterBottom sx={{
          fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2rem', lg: '2.2rem' }
        }}>
          {step === 1 && t('login.forgot_title')}
          {step === 2 && t('login.reset_title')}
          {step === 3 && t('login.success_title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {step === 1 && t('login.forgot_subtitle')}
          {step === 2 && t('login.reset_subtitle')}
          {step === 3 && t('login.success_subtitle')}
        </Typography>
      </Box>

      {apiError && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{apiError}</Alert>
        </Fade>
      )}

      {/* ========== الخطوة 1: إدخال البريد ========== */}
      {step === 1 && (
        <Fade in={true}>
          <Box component="form" onSubmit={handleSendCode} sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label={t('auth.email') || 'البريد الإلكتروني'}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
              sx={{
                py: 1.8,
                fontWeight: 700,
                fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(51, 151, 184, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': { bgcolor: '#94a3b8', background: '#94a3b8' },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? t('login.sending') : t('login.send_code')}
            </Button>
          </Box>
        </Fade>
      )}

      {/* ========== الخطوة 2: الرمز وكلمة المرور الجديدة ========== */}
      {step === 2 && (
        <Fade in={true}>
          <Box component="form" onSubmit={handleResetPassword} sx={{ flex: 1 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {t('login.code_sent_to')} <strong>{formData.email}</strong>
            </Alert>

            <TextField
              fullWidth
              label={t('login.verification_code')}
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              error={!!errors.code}
              helperText={errors.code}
              placeholder="000000"
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5em',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
                }
              }}
            />

            <TextField
              fullWidth
              label={t('login.new_password')}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            {/* مؤشر قوة كلمة المرور */}
            {formData.password && (
              <Fade in={true}>
                <Box sx={{ mb: 2.5 }}>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <Box key={level} sx={{
                        flex: 1, height: 4, borderRadius: 2,
                        bgcolor: level < passwordStrength ? strengthColors[passwordStrength] : '#e2e8f0',
                        transition: 'all 0.3s ease'
                      }} />
                    ))}
                  </Stack>
                  <Typography variant="caption" sx={{ color: strengthColors[passwordStrength], fontWeight: 600 }}>
                    {t('register.password_strength')}: {strengthLabels[passwordStrength]}
                  </Typography>
                </Box>
              </Fade>
            )}

            <TextField
              fullWidth
              label={t('login.confirm_new_password')}
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
              sx={{
                py: 1.8,
                fontWeight: 700,
                fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(51, 151, 184, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': { bgcolor: '#94a3b8', background: '#94a3b8' },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? t('login.updating') : t('login.update_password')}
            </Button>
          </Box>
        </Fade>
      )}

      {/* ========== الخطوة 3: النجاح ========== */}
      {step === 3 && (
        <Fade in={true}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{
              width: 100, height: 100, mx: 'auto', mb: 3,
              bgcolor: '#f0fdf4', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              <CheckIcon sx={{ fontSize: 60, color: '#10b981' }} />
            </Box>
            <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600 }}>
              {t('login.password_updated')}
            </Alert>
          </Box>
        </Fade>
      )}
    </AuthLayout>
  )
}