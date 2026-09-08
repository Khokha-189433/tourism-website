//        رفع وتغيير الصورة
// يتعامل مع رفع الصورة ومعاينتها، مع التحقق من الحجم والنوع
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../API/axios'
import { Box, Avatar, IconButton, CircularProgress, Fade } from '@mui/material'
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material'

export default function AvatarUploader({ profile, onUpdate, onNotify }) {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)
  
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من النوع
    if (!file.type.startsWith('image/')) {
      onNotify(t('profile.image_type_error') || 'يرجى اختيار ملف صورة فقط', 'error')
      return
    }

    // التحقق من الحجم
    if (file.size > MAX_FILE_SIZE) {
      onNotify(t('profile.image_size_error') || 'حجم الصورة يجب أن لا يتجاوز 5MB', 'error')
      return
    }

    // معاينة فورية
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)

    // رفع الصورة
    await uploadAvatar(file)

    // إعادة تعيين قيمة المدخل للسماح برفع نفس الصورة مرة أخرى
    e.target.value = ''
  }

  const uploadAvatar = async (file) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const { data } = await api.put('/auth/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const newAvatar = data.data?.avatar || data.avatar
      onUpdate({ ...profile, avatar: newAvatar })
      onNotify(t('profile.avatar_updated') || 'تم تحديث الصورة بنجاح', 'success')
    } catch (err) {
      console.error('Avatar upload error:', err)
      onNotify(err.response?.data?.message || t('profile.avatar_failed') || 'فشل رفع الصورة', 'error')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const avatarSrc = preview || profile.avatar || null
  const userInitial = profile.first_name?.charAt(0) || 'U'

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        {/* الصورة الشخصية */}
        <Avatar
          src={avatarSrc}
          sx={{
            width: 130,
            height: 130,
            border: '4px solid white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            bgcolor: '#3397b8',
            fontSize: '3rem',
            fontWeight: 700
          }}
        >
          {userInitial}
        </Avatar>

        {/* زر تغيير الصورة */}
        <IconButton
          onClick={handleClick}
          disabled={uploading}
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            bgcolor: '#3397b8',
            color: 'white',
            width: 40,
            height: 40,
            boxShadow: '0 4px 12px rgba(51, 151, 184, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#217490',
              transform: 'scale(1.1)',
            }
          }}
        >
          {uploading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <PhotoCameraIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Box>

      {/* مدخل الملف المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  )
}