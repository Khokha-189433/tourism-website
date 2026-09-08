import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import api from '../../API/axios'
import AuthLayout from '../../components/Ui/AuthLayout'
import {
  Box, Typography, TextField, Button, Stack, IconButton,
  InputAdornment, Alert, CircularProgress, Link, Divider, Fade
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  Google as GoogleIcon,
  Shield as ShieldIcon,
  Explore as ExploreIcon,
  SupportAgent as SupportIcon,
  FlightTakeoff as FlightIcon
} from '@mui/icons-material'

export default function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useApp()
  const isRTL = i18n.language === 'ar'
  const from = location.state?.from?.pathname || '/'

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setApiError(null)

    const newErrors = {}
    if (!loginData.email) newErrors.email = t('auth.emailRequired') || 'البريد الإلكتروني مطلوب'
    if (!loginData.password) newErrors.password = t('auth.passwordRequired') || 'كلمة المرور مطلوبة'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/login', loginData)
      if (response.data.success) {
        const authData = response.data.data || response.data
        const accessToken = authData.access_token || authData.accessToken || authData.token
        const refreshToken = authData.refresh_token || authData.refreshToken
        const loggedUser = authData.user || authData.profile

        if (!accessToken) {
          throw new Error('لم يتم استلام رمز الدخول من الخادم')
        }

        localStorage.setItem('accessToken', accessToken)
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
        setUser(loggedUser || null)
        navigate(from, { replace: true })
      }
    } catch (err) {
      console.error('خطأ في تسجيل الدخول:', err)
      const errorMsg = err.response?.data?.message || t('auth.invalidCredentials') || 'بيانات الدخول غير صحيحة'
      setApiError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: <ExploreIcon sx={{ fontSize: 24 }} />, title: t('login.feature_1_title') || 'رحلات حصرية', desc: t('login.feature_1_desc') || 'احجز رحلاتك المفضلة بضغطة زر' },
    { icon: <ShieldIcon sx={{ fontSize: 24 }} />, title: t('login.feature_2_title') || 'حساب آمن', desc: t('login.feature_2_desc') || 'بياناتك محمية بأعلى معايير الأمان' },
    { icon: <SupportIcon sx={{ fontSize: 24 }} />, title: t('login.feature_3_title') || 'دعم على مدار الساعة', desc: t('login.feature_3_desc') || 'فريقنا جاهز لمساعدتك في أي وقت' },
  ]

  return (
    <AuthLayout
      title={t('login.welcome_title')}
      subtitle={t('login.welcome_desc')}
      features={features}
    >
      {/* شعار الموبايل + العنوان */}
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
          <LoginIcon sx={{ fontSize: 26, color: 'white' }} />
        </Box>

        <Typography variant="h3" fontWeight="800" color="#0f172a" gutterBottom sx={{
          fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2rem', lg: '2.2rem' }
        }}>
          {t('login.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('login.subtitle')}
        </Typography>
      </Box>

      {apiError && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{apiError}</Alert>
        </Fade>
      )}

      <Box component="form" onSubmit={handleLogin} sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label={t('auth.email') || 'البريد الإلكتروني'}
          type="email"
          value={loginData.email}
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value })
            if (errors.email) setErrors({ ...errors, email: null })
          }}
          error={!!errors.email}
          helperText={errors.email}
          autoComplete="email"
          sx={{
            mb: 2.5,
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

        <TextField
          fullWidth
          label={t('auth.password') || 'كلمة المرور'}
          type={showPassword ? 'text' : 'password'}
          value={loginData.password}
          onChange={(e) => {
            setLoginData({ ...loginData, password: e.target.value })
            if (errors.password) setErrors({ ...errors, password: null })
          }}
          error={!!errors.password}
          helperText={errors.password}
          autoComplete="current-password"
          sx={{
            mb: 1.5,
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

        {/* زر نسيت كلمة المرور */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            state={{ email: loginData.email }}
            sx={{
              color: '#3397b8',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': { color: '#217490', textDecoration: 'underline' }
            }}
          >
            {t('login.forgot_password')}
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
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
              boxShadow: '0 8px 25px rgba(51, 151, 184, 0.45)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': { bgcolor: '#94a3b8', background: '#94a3b8' },
            transition: 'all 0.3s ease',
            mb: 2.5
          }}
        >
          {loading ? (t('auth.loggingIn') || 'جاري تسجيل الدخول...') : (t('auth.loginButton') || 'تسجيل الدخول')}
        </Button>

        <Divider sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, bgcolor: 'white' }}>
            {t('register.or') || 'أو'}
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderColor: '#e2e8f0',
            color: '#475569',
            borderRadius: 2,
            borderWidth: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#3397b8',
              bgcolor: '#f8fafc',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)',
              borderWidth: 2,
            }
          }}
        >
          {t('login.google')}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
          {t('auth.dontHaveAccount') || 'ليس لديك حساب؟'}{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              color: '#3397b8',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              '&:hover': { color: '#217490', textDecoration: 'underline' }
            }}
          >
            {t('navbar.register') || 'إنشاء حساب'}
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  )
}