import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  IconButton, Badge, Menu, Box, Typography, Stack, Button, Divider, List, CircularProgress
} from '@mui/material'
import {
  Notifications as BellIcon,
  DoneAll as DoneAllIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { useNotifications } from '../../context/NotificationsContext'
import NotificationItem from './NotificationItem'
import { BRAND } from '../styles/animations'

export default function NotificationsMenu() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget)
    fetchNotifications()
  }

  const handleClose = () => setAnchorEl(null)

  const handleClickItem = (n) => {
    if (!(n.read_at || n.is_read)) markAsRead(n.id)
    handleClose()
    // يمكن التوجيه حسب النوع لاحقاً
    if (String(n.type || '').includes('booking')) navigate('/my-bookings')
  }

  return (
    <>
      {/* 🔔 زر الجرس مع العدّاد */}
      <IconButton
        onClick={handleOpen}
        title={t('notifications.title', 'الإشعارات')}
        sx={{
          width: 40, height: 40,
          border: '1.5px solid',
          borderColor: unreadCount > 0 ? BRAND.primary : 'rgba(51,151,184,0.3)',
          bgcolor: unreadCount > 0 ? 'rgba(51,151,184,0.1)' : 'white',
          color: BRAND.primary,
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': { bgcolor: BRAND.primary, color: 'white', borderColor: BRAND.primary },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16, fontWeight: 700 } }}
        >
          <BellIcon sx={{
            fontSize: 20,
            ...(unreadCount > 0 && { animation: 'bellRing 2s ease-in-out infinite' }),
          }} />
        </Badge>
      </IconButton>

      {/* 📋 القائمة المنسدلة */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: { xs: 300, sm: 360 }, maxWidth: 400,
              borderRadius: 3, mt: 1.5,
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
            },
          },
        }}
        anchorOrigin={{ horizontal: isRTL ? 'left' : 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: isRTL ? 'left' : 'right', vertical: 'top' }}
      >
        {/* رأس القائمة */}
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" sx={{justifyContent:"space-between" , alignItems:"center"}}>
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
              {t('notifications.title', 'الإشعارات')}
              {unreadCount > 0 && (
                <Typography component="span" variant="caption" sx={{ ml: 1, color: BRAND.primary, fontWeight: 700 }}>
                  ({unreadCount} {t('notifications.unread', 'غير مقروءة')})
                </Typography>
              )}
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
                onClick={markAllAsRead}
                sx={{ color: BRAND.primary, fontWeight: 700, textTransform: 'none', fontSize: '0.75rem' }}
              >
                {t('notifications.mark_all_read', 'تحديد الكل كمقروء')}
              </Button>
            )}
          </Stack>
        </Box>

        {/* القائمة */}
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={28} sx={{ color: BRAND.primary }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <BellIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {t('notifications.empty_title', 'لا توجد إشعارات')}
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
            <Divider />
            {notifications.slice(0, 6).map((n) => (
              <NotificationItem key={n.id} n={n} onClick={handleClickItem} />
            ))}
          </List>
        )}

        {/* ذيل القائمة */}
        <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            fullWidth
            size="small"
            onClick={() => { handleClose(); navigate('/notifications') }}
            endIcon={<ArrowIcon sx={{ fontSize: 16, transform: isRTL ? 'rotate(180deg)' : 'none' }} />}
            sx={{ color: BRAND.primary, fontWeight: 700, textTransform: 'none' }}
          >
            {t('notifications.view_all', 'عرض كل الإشعارات')}
          </Button>
        </Box>
      </Menu>

      {/* 🔔 أنيميشن اهتزاز الجرس */}
      <Box component="style">{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0); }
          10% { transform: rotate(12deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(8deg); }
          40% { transform: rotate(-6deg); }
          50% { transform: rotate(0); }
        }
      `}</Box>
    </>
  )
}