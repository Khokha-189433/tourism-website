//     رأس الصفحة (الصورة + الاسم)
//    يعرض الصورة، الاسم، البريد الإلكتروني، وزر تعديل الصورة
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AvatarUploader from './AvatarUploader'
import { Box, Paper, Typography, Stack, Chip } from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'

export default function ProfileHeader({ profile, onUpdate, onNotify }) {
  const { t, i18n } = useTranslation()

  const memberSince = profile.created_at 
    ? new Date(profile.created_at).toLocaleDateString(
        i18n.language === 'ar' ? 'ar-SY' : 'en-US',
        { year: 'numeric', month: 'long' }
      )
    : null

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 4,
        overflow: 'hidden',
        mb: 4,
        border: '1px solid',
        borderColor: 'rgba(0,0,0,0.06)'
      }}
    >
      {/* خلفية متدرجة */}
      <Box sx={{
        height: 140,
        background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
        position: 'relative'
      }}>
        {/* دوائر زخرفية */}
        <Box sx={{
          position: 'absolute', top: -50, right: -50,
          width: 200, height: 200, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.05)'
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60,
          width: 250, height: 250, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.03)'
        }} />
      </Box>

      {/* محتوى البطاقة */}
      <Box sx={{ px: { xs: 3, md: 4 }, pb: 3 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 3 }}
         
            sx={{ mt: { xs: -6, sm: -7 }, mb: 3  ,  alignItems:{ xs: 'center', sm: 'flex-end' }}}
        >
          {/* الصورة الشخصية مع زر التعديل */}
          <AvatarUploader 
            profile={profile} 
            onUpdate={onUpdate}
            onNotify={onNotify}
          />

          {/* الاسم والمعلومات */}
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'start' } }}>
            <Typography variant="h4" fontWeight="800" color="#0f172a" sx={{ mb: 1.5, fontSize: { xs: '1.6rem', sm: '2.1rem' }, overflowWrap: 'anywhere' }}>
              {profile.first_name} {profile.last_name}
            </Typography>
            
            <Stack 
              direction="row" 
              spacing={{ xs: 1, sm: 2 }} 
              
              sx={{ mb: 2.5, rowGap: 1.5 , margin:2.6  , justifyContent:{ xs: 'center', sm: 'flex-start' }, flexWrap:"wrap" }}
            >
              <Chip 
                icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                label={t('profile.customer') || 'عميل'}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(51, 151, 184, 0.1)', 
                  color: '#3397b8',
                  fontWeight: 660
                }}
              />
              {memberSince && (
                <Chip 
                  label={`${t('profile.member_since') || 'عضو منذ'} ${memberSince}`}
                  size="small"
                  variant="outlined"
                  sx={{ color: '#64748b', borderColor: '#e2e8f0' }}
                />
              )}
            </Stack>

            {/* معلومات التواصل */}
            <Stack 
              direction="row" 
              spacing={{ xs: 1.5, sm: 3 }} 
              sx={{ rowGap: 2 ,   flexWrap:"wrap",
              justifyContent:{ xs: 'center', sm: 'flex-start' }}}
            >
              <Stack direction="row" spacing={3} sx={{ maxWidth: '100%', alignItems:"center"  }}>
                <EmailIcon sx={{ fontSize: 16, color: '#3397b8' }} />
                <Typography variant="body1" color="#475569" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                  {profile.email}
                </Typography>
              </Stack>

              {profile.phone && (
                <Stack direction="row" spacing={3} sx={{alignItems:"center"}} >
                  <PhoneIcon sx={{ fontSize: 16, color: '#3397b8' }} />
                  <Typography variant="body1" color="#475569" fontWeight={600} dir="ltr">
                    {profile.phone}
                  </Typography>
                </Stack>
              )}

              {profile.preferred_language && (
                <Stack direction="row" spacing={0.75}  sx={{alignItems:"center"}}>
                  <LanguageIcon sx={{ fontSize: 16, color: '#3397b8' }} />
                  <Typography variant="body1" color="#475569" fontWeight={600}>
                    {profile.preferred_language === 'ar' ? 'العربية' : 'English'}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}