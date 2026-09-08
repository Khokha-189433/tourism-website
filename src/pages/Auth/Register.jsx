import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import api from '../../API/axios'
import AuthLayout from '../../components/Ui/AuthLayout'
import {
  Box, Typography, TextField, Button, Stack, IconButton,
  InputAdornment, Alert, CircularProgress, Checkbox, FormControlLabel,
  Link, Divider, Fade
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FlightTakeoff as FlightIcon,
  CheckCircle as CheckIcon,
  Google as GoogleIcon,
  Shield as ShieldIcon,
  Explore as ExploreIcon,
  EmojiEvents as RewardsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useApp()
  const isRTL = i18n.language === 'ar'

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    password: '', confirmPassword: '', agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [success, setSuccess] = useState(false)

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

  const validate = () => {
    const newErrors = {}
    if (!formData.first_name.trim()) newErrors.first_name = 'الاسم الأول مطلوب'
    if (!formData.last_name.trim()) newErrors.last_name = 'الاسم الأخير مطلوب'
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح'
    if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب'
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة'
    else if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    else if (passwordStrength < 2) newErrors.password = 'كلمة المرور ضعيفة جداً'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين'
    if (!formData.agreeTerms) newErrors.agreeTerms = 'يجب الموافقة على الشروط والأحكام'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      }
      const { data } = await api.post('/auth/register', payload)
      if (data.token && data.user) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        setSuccess(true)
        setTimeout(() => navigate('/'), 1500)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      let message = 'فشل إنشاء الحساب، حاول مرة أخرى'
      if (err.response) {
        const status = err.response.status
        const backendMessage = err.response.data?.message
        if (status === 409) message = backendMessage || 'البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً'
        else if (status === 400 || status === 422) message = backendMessage || 'البيانات المرسلة غير صحيحة'
        else if (status === 500) message = 'حدث خطأ في الخادم'
        else if (backendMessage) message = backendMessage
      }
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: <ExploreIcon sx={{ fontSize: 24 }} />, title: 'اكتشف وجهات جديدة', desc: 'آلاف الرحلات السياحية حول العالم' },
    { icon: <ShieldIcon sx={{ fontSize: 24 }} />, title: 'حجز آمن ومضمون', desc: 'حماية كاملة لبياناتك ومعاملاتك' },
    { icon: <RewardsIcon sx={{ fontSize: 24 }} />, title: 'عروض حصرية', desc: 'خصومات ومكافآت للأعضاء فقط' },
  ]

  return (
    <AuthLayout
      title="انطلق في مغامرتك القادمة"
      subtitle="انضم إلى آلاف المسافرين الذين يكتشفون العالم معنا. احجز رحلاتك بكل سهولة وأمان."
      features={features}
      imageSrc="/register-illustration.svg"
    >
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
          <FlightIcon sx={{ fontSize: 26, color: 'white' }} />
        </Box>
        <Typography variant="h3" fontWeight="800" color="#0f172a" gutterBottom sx={{
          fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2rem', lg: '2.2rem' }
        }}>
          إنشاء حساب جديد
        </Typography>
        <Typography variant="body1" color="text.secondary">
          انضم إلينا وابدأ رحلتك السياحية القادمة
        </Typography>
      </Box>

      {success && (
        <Fade in={true}>
          <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}>
            تم إنشاء الحساب بنجاح! جاري تحويلك...
          </Alert>
        </Fade>
      )}

      {apiError && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{apiError}</Alert>
        </Fade>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
          <TextField fullWidth label="الاسم الأول" name="first_name" value={formData.first_name} onChange={handleChange} error={!!errors.first_name} helperText={errors.first_name} slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8' }} /></InputAdornment> } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-1px)' }, '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' } } }} />
          <TextField fullWidth label="الاسم الأخير" name="last_name" value={formData.last_name} onChange={handleChange} error={!!errors.last_name} helperText={errors.last_name} slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8' }} /></InputAdornment> } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-1px)' }, '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' } } }} />
        </Stack>

        <TextField fullWidth label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment> } }} sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-1px)' }, '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' } } }} />

        <TextField fullWidth label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#94a3b8' }} /></InputAdornment> } }} sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-1px)' }, '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' } } }} />

        <TextField fullWidth label="كلمة المرور" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94a3b8' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> } }} sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-1px)' }, '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' } } }} />

        {formData.password && (
          <Fade in={true}>
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <Box key={level} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: level < passwordStrength ? strengthColors[passwordStrength] : '#e2e8f0', transition: 'all 0.3s ease' }} />
                ))}
              </Stack>
              <Typography variant="caption" sx={{ color: strengthColors[passwordStrength], fontWeight: 600 }}>
                قوة كلمة المرور: {strengthLabels[passwordStrength]}
              </Typography>
            </Box>
          </Fade>
        )}

        <TextField fullWidth label="تأكيد كلمة المرور" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94a3b8' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> } }} sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-1px)' }, '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' } } }} />

        <Box sx={{ mb: 3 }}>
          <FormControlLabel control={<Checkbox name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} sx={{ color: '#3397b8', '&.Mui-checked': { color: '#3397b8' } }} />} label={<Typography variant="body2" color="text.secondary">أوافق على <Link component={RouterLink} to="/terms" sx={{ color: '#3397b8', fontWeight: 600 }}>الشروط والأحكام</Link> و <Link component={RouterLink} to="/privacy" sx={{ color: '#3397b8', fontWeight: 600 }}>سياسة الخصوصية</Link></Typography>} />
          {errors.agreeTerms && <Typography variant="caption" color="error" sx={{ display: 'block', ml: 4 }}>{errors.agreeTerms}</Typography>}
        </Box>

        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading || success} endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon sx={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />} startIcon={!loading && <FlightIcon />} sx={{ py: 1.8, fontWeight: 700, fontSize: '1.05rem', background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)', borderRadius: 2, textTransform: 'none', boxShadow: '0 6px 20px rgba(51, 151, 184, 0.35)', '&:hover': { background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)', transform: 'translateY(-2px)' }, '&:disabled': { bgcolor: '#94a3b8', background: '#94a3b8' }, transition: 'all 0.3s ease', mb: 2.5 }}>
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
        </Button>

        <Divider sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, bgcolor: 'white' }}>أو</Typography>
        </Divider>

        <Button fullWidth variant="outlined" size="large" startIcon={<GoogleIcon />} sx={{ py: 1.5, fontWeight: 600, textTransform: 'none', borderColor: '#e2e8f0', color: '#475569', borderRadius: 2, borderWidth: 2, '&:hover': { borderColor: '#3397b8', bgcolor: '#f8fafc', transform: 'translateY(-2px)', borderWidth: 2 } }}>
          التسجيل بواسطة Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
          لديك حساب بالفعل؟{' '}
          <Link component={RouterLink} to="/login" sx={{ color: '#3397b8', fontWeight: 700, textDecoration: 'none', '&:hover': { color: '#217490', textDecoration: 'underline' } }}>
            سجل الدخول
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  )
}