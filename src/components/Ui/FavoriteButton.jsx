import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconButton, Snackbar, Alert, CircularProgress } from '@mui/material'
import { Favorite as HeartFilled, FavoriteBorder as HeartEmpty } from '@mui/icons-material'
import { useFavorites } from '../../context/FavoritesContext'

/**
 * ❤️ زر المفضلة القابل لإعادة الاستخدام
 * @param {'trip'|'package'} type - نوع العنصر
 * @param {number|string} id - معرف العنصر
 * @param {'overlay'|'default'} variant - overlay للصور، default للعادي
 * @param {'small'|'medium'|'large'} size - حجم الزر
 */
function FavoriteButton({ type, id, variant = 'overlay', size = 'medium', sx = {} }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [busy, setBusy] = useState(false)
  const [burst, setBurst] = useState(false)
  const [snack, setSnack] = useState(null)

  const fav = isFavorite(type, id)
  const dim = { small: 36, medium: 44, large: 52 }[size] || 44
  const iconDim = { small: 18, medium: 22, large: 26 }[size] || 22

  // ========== معالجة الضغط ==========
  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (busy) return

    setBusy(true)
    try {
      const added = await toggleFavorite(type, id)
      if (added) {
        setBurst(true)
        setTimeout(() => setBurst(false), 700)
      }
      setSnack({
        severity: 'success',
        text: added
          ? t('favorites.added', 'تمت الإضافة إلى المفضلة ❤️')
          : t('favorites.removed', 'تمت الإزالة من المفضلة')
      })
    } catch (err) {
      if (err?.code === 'UNAUTHENTICATED' || err.response?.status === 401) {
        setSnack({ severity: 'warning', text: t('favorites.login_required', 'سجّل الدخول أولاً لإضافة المفضلة') })
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setSnack({ severity: 'error', text: err.response?.data?.message || t('favorites.error', 'حدث خطأ') })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={busy}
        title={fav ? t('favorites.remove_from', 'إزالة من المفضلة') : t('favorites.add_to', 'إضافة إلى المفضلة')}
        sx={{
          width: dim,
          height: dim,
          bgcolor: variant === 'overlay' ? 'rgba(255,255,255,0.2)' : 'white',
          backdropFilter: variant === 'overlay' ? 'blur(10px)' : 'none',
          border: variant === 'overlay' ? 'none' : '1px solid rgba(0,0,0,0.08)',
          color: fav ? '#ef4444' : (variant === 'overlay' ? 'white' : '#64748b'),
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: variant === 'overlay' ? 'rgba(255,255,255,0.35)' : '#fef2f2',
            color: '#ef4444',
            transform: 'scale(1.1)',
          },
          // 💥 أنيميشن النبض عند الإضافة
          ...(burst && { animation: 'heartPop 0.6s ease' }),
          '@keyframes heartPop': {
            '0%': { transform: 'scale(1)' },
            '35%': { transform: 'scale(1.35)' },
            '70%': { transform: 'scale(0.95)' },
            '100%': { transform: 'scale(1)' },
          },
          ...sx,
        }}
      >
        {busy ? (
          <CircularProgress size={iconDim} sx={{ color: 'inherit' }} />
        ) : fav ? (
          <HeartFilled sx={{ fontSize: iconDim }} />
        ) : (
          <HeartEmpty sx={{ fontSize: iconDim }} />
        )}
      </IconButton>

      {/* Snackbar للتنبيهات */}
      <Snackbar
        open={!!snack}
        autoHideDuration={2500}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack?.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snack?.text}
        </Alert>
      </Snackbar>
    </>
  )
}

export default FavoriteButton