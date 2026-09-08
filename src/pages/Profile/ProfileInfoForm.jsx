//   نموذج تعديل المعلومات
// نموذج تعديل الاسم الأول، الاسم الأخير، ورقم الهاتف
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../API/axios'
import {
  Paper, Typography, Box, TextField, Button, Stack, 
  InputAdornment, CircularProgress, Fade
} from '@mui/material'
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  Edit as EditIcon
} from '@mui/icons-material'

export default function ProfileInfoForm({ profile, onUpdate, onNotify }) {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // مزامنة النموذج مع بيانات البروفايل
  useEffect(() => {
    setForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || ''
    })
  }, [profile])

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
    setIsDirty(true)
    if (errors[field]) setErrors({ ...errors, [field]: null })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.first_name.trim()) {
      newErrors.first_name = t('profile.first_name_required') || 'الاسم الأول مطلوب'
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = t('profile.last_name_required') || 'الاسم الأخير مطلوب'
    }

    if (!form.phone.trim()) {
      newErrors.phone = t('profile.phone_required') || 'رقم الهاتف مطلوب'
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(form.phone)) {
      newErrors.phone = t('profile.phone_invalid') || 'رقم الهاتف غير صحيح'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setSaving(true)
      const { data } = await api.put('/auth/profile', form)
      const updated = data.data || data.user || data
      
      onUpdate({ ...profile, ...updated })
      setIsDirty(false)
      onNotify(t('profile.info_updated') || 'تم تحديث المعلومات بنجاح', 'success')
    } catch (err) {
      console.error('Profile update error:', err)
      onNotify(err.response?.data?.message || t('profile.update_failed') || 'فشل تحديث المعلومات', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Fade in={true} timeout={600}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.06)',
          height: '100%'
        }}
      >
        {/* عنوان القسم */}
        <Stack direction="row" spacing={1.5}  sx={{ mb: 3 , alignItems:"center"}}>
          <Box sx={{
            width: 40, height: 40,
            bgcolor: 'rgba(51, 151, 184, 0.1)',
            borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3397b8'
          }}>
            <EditIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700" color="#0f172a">
            {t('profile.personal_info') || 'المعلومات الشخصية'}
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          {/* الاسم الأول والأخير */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              label={t('profile.first_name') || 'الاسم الأول'}
              value={form.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              error={!!errors.first_name}
              helperText={errors.first_name}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
                }
              }}
            />
            <TextField
              fullWidth
              label={t('profile.last_name') || 'الاسم الأخير'}
              value={form.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              error={!!errors.last_name}
              helperText={errors.last_name}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
                }
              }}
            />
          </Stack>

          {/* رقم الهاتف */}
          <TextField
            fullWidth
            label={t('profile.phone') || 'رقم الهاتف'}
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            dir="ltr"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                )
              }
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-1px)' },
                '&.Mui-focused': { boxShadow: '0 4px 12px rgba(51, 151, 184, 0.15)' }
              }
            }}
          />

          {/* زر الحفظ */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={saving || !isDirty}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              background: isDirty 
                ? 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)'
                : '#94a3b8',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: isDirty ? '0 6px 20px rgba(51, 151, 184, 0.35)' : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                bgcolor: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            {saving 
              ? (t('profile.saving') || 'جاري الحفظ...')
              : isDirty 
                ? (t('profile.save_changes') || 'حفظ التغييرات')
                : (t('profile.no_changes') || 'لا توجد تغييرات')
            }
          </Button>
        </Box>
      </Paper>
    </Fade>
  )
}