import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../context/AppContext'
import api from '../../API/axios'
import ProfileHeader from './ProfileHeader'
import ProfileInfoForm from './ProfileInfoForm'
import ChangePasswordForm from '../Auth/ForgotPassword'
import {
  Container, Grid, Box, Button, Snackbar, Alert, CircularProgress,
  Stack, Paper, Fade, Typography, Dialog, DialogContent, IconButton,
  Card, CardContent, Chip
} from '@mui/material'
import {
  Logout as LogoutIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'

export default function Profile() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, setUser } = useApp()

  const [profileData, setProfileData] = useState(user)
  const [loading, setLoading] = useState(!user)
  const [profileError, setProfileError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setProfileError('')
      const { data } = await api.get('/auth/profile')
      const profile = data.data || data.user || data
      if (profile) setProfileData(profile)
    } catch (err) {
      const message = err.response?.data?.message || t('profile.load_error', 'فشل تحميل بيانات البروفايل')
      setProfileError(message)
      showSnackbar(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleEditSuccess = (updated) => {
    setProfileData(updated)
    setUser(updated)
    setEditOpen(false)
    showSnackbar(t('profile.update_success', 'تم تحديث المعلومات بنجاح'), 'success')
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#3397b8' }} />
      </Box>
    )
  }

  if (!profileData) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Alert severity="error">{profileError || t('profile.no_data', 'لا توجد بيانات للمستخدم')}</Alert>
      </Box>
    )
  }

  const memberSince = profileData.created_at
    ? new Date(profileData.created_at).toLocaleDateString(
        i18n.language === 'ar' ? 'ar-SY' : 'en-US',
        { year: 'numeric', month: 'long' }
      )
    : null

  // ✅ تحديد نص اللغة المفضلة بناءً على الترجمة
  const preferredLanguageText = profileData.preferred_language === 'en'
    ? t('profile.language_english', 'English')
    : t('profile.language_arabic', 'العربية')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="xl" sx={{ width: '100%', px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Fade in={true} timeout={600}>
          <Box>
            {/* ========== رأس الصفحة ========== */}
            <ProfileHeader
              profile={profileData}
              onUpdate={setProfileData}
              onNotify={showSnackbar}
            />

            {/* ========== بطاقتا الإجراءات ========== */}
            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '100%', m: 0 }}>

              {/* ========== بطاقة المعلومات الشخصية ========== */}
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', minWidth: 0 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    width: '100%',
                    minWidth: 0,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
                  }}
                >
                  <Box sx={{
                    p: { xs: 2.5, md: 3 },
                    background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', gap: 1.5
                  }}>
                    <Box sx={{
                      width: 40, height: 40,
                      bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <PersonIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="700">
                      {t('profile.personal_info_title', 'المعلومات الشخصية')}
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={{ xs: 3, md: 3.5 }} sx={{ mb: 4 }}>
                      <InfoRow
                        icon={<PersonIcon sx={{ color: '#3397b8' }} />}
                        label={t('profile.full_name', 'الاسم الكامل')}
                        value={`${profileData.first_name} ${profileData.last_name}`}
                      />
                      <InfoRow
                        icon={<EmailIcon sx={{ color: '#3397b8' }} />}
                        label={t('profile.email_label', 'البريد الإلكتروني')}
                        value={profileData.email}
                        isLtr
                      />
                      <InfoRow
                        icon={<PhoneIcon sx={{ color: '#3397b8' }} />}
                        label={t('profile.phone_label', 'رقم الهاتف')}
                        value={profileData.phone || t('profile.not_specified', 'غير محدد')}
                        isLtr
                      />
                      <InfoRow
                        icon={<LanguageIcon sx={{ color: '#3397b8' }} />}
                        label={t('profile.preferred_language_label', 'اللغة المفضلة')}
                        value={preferredLanguageText}
                      />
                      {memberSince && (
                        <InfoRow
                          icon={<CalendarIcon sx={{ color: '#3397b8' }} />}
                          label={t('profile.member_since', 'عضو منذ')}
                          value={memberSince}
                        />
                      )}
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<EditIcon />}
                      onClick={() => setEditOpen(true)}
                      sx={{
                        py: 1.4,
                        fontWeight: 700,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                        borderRadius: 2,
                        boxShadow: '0 6px 20px rgba(51, 151, 184, 0.35)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(51, 151, 184, 0.45)'
                        }
                      }}
                    >
                      {t('profile.edit_profile', 'تعديل الملف الشخصي')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* ========== بطاقة الأمان ========== */}
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', minWidth: 0 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    width: '100%',
                    minWidth: 0,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }
                  }}
                >
                  <Box sx={{
                    p: { xs: 2.5, md: 3 },
                    background: 'linear-gradient(135deg, #0a2540 0%, #1e5f74 100%)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', gap: 1.5
                  }}>
                    <Box sx={{
                      width: 40, height: 40,
                      bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <SecurityIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="700">
                      {t('profile.security_title', 'أمان الحساب')}
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
                    <Stack spacing={{ xs: 3, md: 3.5 }} sx={{ mb: 4 }}>
                      <InfoRow
                        icon={<LockResetIcon sx={{ color: '#3397b8' }} />}
                        label={t('profile.password_label', 'كلمة المرور')}
                        value="••••••••••"
                        isLtr
                      />
                      <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        display: 'flex', alignItems: 'center', gap: 1.5
                      }}>
                        <VerifiedIcon sx={{ color: '#10b981' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="600" color="#065f46">
                            {t('profile.verified_account', 'الحساب موثق')}
                          </Typography>
                          <Typography variant="caption" color="#065f46">
                            {t('profile.verified_desc', 'بريدك الإلكتروني مؤكد ومحمي')}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={t('profile.password_tip', 'ننصح بتغيير كلمة المرور كل 3 أشهر')}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(245, 158, 11, 0.1)',
                          color: '#b45309',
                          fontWeight: 600,
                          alignSelf: 'flex-start'
                        }}
                      />
                    </Stack>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<LockResetIcon />}
                      onClick={() => setPasswordOpen(true)}
                      sx={{
                        py: 1.4,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderColor: '#3397b8',
                        color: '#3397b8',
                        borderWidth: 2,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'rgba(51, 151, 184, 0.05)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(51, 151, 184, 0.2)'
                        }
                      }}
                    >
                      {t('profile.change_password', 'تغيير كلمة المرور')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* ========== زر تسجيل الخروج ========== */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2, px: 4, py: 1.2,
                  fontWeight: 600, textTransform: 'none', borderWidth: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#fef2f2', borderWidth: 2, transform: 'translateY(-2px)' }
                }}
              >
                {t('profile.logout', 'تسجيل الخروج')}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* ========== Dialog تعديل الملف الشخصي ========== */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, width: { xs: 'calc(100% - 24px)', sm: '100%' } } }}
      >
        <Box sx={{
          p: { xs: 2.5, sm: 3 },
          background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
          color: 'white',
          display: 'flex', alignItems: 'center', gap: 1.5
        }}>
          <EditIcon />
          <Typography variant="h6" fontWeight="700" sx={{ flex: 1 }}>
            {t('profile.edit_profile', 'تعديل الملف الشخصي')}
          </Typography>
          <IconButton
            onClick={() => setEditOpen(false)}
            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <ProfileInfoForm
            profile={profileData}
            onUpdate={handleEditSuccess}
            onNotify={showSnackbar}
          />
        </DialogContent>
      </Dialog>

      {/* ========== Dialog تغيير كلمة المرور ========== */}
      <Dialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, width: { xs: 'calc(100% - 24px)', sm: '100%' } } }}
      >
        <Box sx={{
          p: { xs: 2.5, sm: 3 },
          background: 'linear-gradient(135deg, #0a2540 0%, #1e5f74 100%)',
          color: 'white',
          display: 'flex', alignItems: 'center', gap: 1.5
        }}>
          <LockResetIcon />
          <Typography variant="h6" fontWeight="700" sx={{ flex: 1 }}>
            {t('profile.change_password', 'تغيير كلمة المرور')}
          </Typography>
          <IconButton
            onClick={() => setPasswordOpen(false)}
            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <ChangePasswordForm
            onNotify={showSnackbar}
            onSuccess={() => setPasswordOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ========== الإشعارات ========== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// ==================== مكون مساعد: صف معلومات ====================
const InfoRow = ({ icon, label, value, isLtr = false }) => (
  <Stack direction="row" spacing={{ xs: 2.5, md: 3 }} sx={{ py: 0.75, alignItems: 'center' }}>
    <Box sx={{
      width: { xs: 44, md: 48 }, height: { xs: 44, md: 48 },
      bgcolor: 'rgba(51, 151, 184, 0.1)', borderRadius: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2" color="#64748b" sx={{ display: 'block', mb: 0.5, fontWeight: 600, fontSize: { xs: '0.82rem', md: '0.88rem' } }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight="700"
        color="#0f172a"
        dir={isLtr ? 'ltr' : 'inherit'}
        sx={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          textAlign: isLtr ? 'left' : 'inherit',
          fontSize: { xs: '1rem', md: '1.05rem' }
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
)