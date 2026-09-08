import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Container, Box, Typography, Stack, Chip, Button, Paper, List,
  Divider, Fade, Grow, Skeleton
} from '@mui/material'
import {
  Notifications as BellIcon,
  DoneAll as DoneAllIcon,
  MarkEmailUnread as UnreadIcon,  // ✅ رسالة غير مقروءة
  Inbox as AllIcon,
} from '@mui/icons-material'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import NotificationItem from '../../components/Ui/NotificationItem'
import { useNotifications } from '../../context/NotificationsContext'
import { BRAND, gradientButtonSx } from '../../components/styles/animations'

export default function Notifications() {



  const { t } = useTranslation()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead , addLocalNotification } = useNotifications()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'unread'
    ? notifications.filter(n => !(n.read_at || n.is_read))
    : notifications

  return (
    <Box sx={{ minHeight: '100vh', background: BRAND.pageBg, position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />

      {/* ========== الهيرو ========== */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
        color: 'white',
        py: { xs: 6, md: 8 },
        mb: 5,
        position: 'relative',
        overflow: 'hidden',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in>
            <Box>
              <BellIcon sx={{
                fontSize: { xs: 40, md: 52 }, color: '#7fd4e8', mb: 1,
                filter: 'drop-shadow(0 0 12px rgba(127,212,232,0.9))',
                animation: 'notifFloat 3s ease-in-out infinite',
              }} />
              <Typography variant="h3" fontWeight="900" sx={{
                fontSize: { xs: '1.8rem', md: '2.6rem' },
                animation: 'notifGlow 3s ease-in-out infinite',
              }}>
                {t('notifications.title', 'الإشعارات')}
              </Typography>
              <Typography variant="body1" sx={{ color: '#d7e9f2', mt: 1, textShadow: '0 0 10px rgba(127,212,232,0.5)' }}>
                {t('notifications.subtitle', 'ابق على اطلاع بكل تحديثات حجوزاتك ورحلاتك')}
              </Typography>
            </Box>
          </Fade>
        </Container>
        <Box component="style">{`
          @keyframes notifGlow {
            0%, 100% { text-shadow: 0 0 14px rgba(127,212,232,0.75), 0 0 34px rgba(51,151,184,0.5); }
            50% { text-shadow: 0 0 26px rgba(127,212,232,1), 0 0 60px rgba(51,151,184,0.85); }
          }
          @keyframes notifFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</Box>
      </Box>

      <Container maxWidth="md" sx={{ pb: 6, position: 'relative', zIndex: 1 }}>

        {/* ========== الفلاتر + تعليم الكل ========== */}
        <Stack direction="row"  gap={2} sx={{ mb: 3 , justifyContent:"space-between", alignItems:"center"  , flexWrap:"wrap" }}>
          <Stack direction="row" spacing={1} sx={{flexWrap:"wrap"}} useFlexGap>
            <Chip
              icon={<AllIcon sx={{ fontSize: 18 }} />}
              label={`${t('notifications.all', 'الكل')} (${notifications.length})`}
              onClick={() => setFilter('all')}
              sx={{
                fontWeight: 700, cursor: 'pointer',
                bgcolor: filter === 'all' ? BRAND.primary : 'white',
                color: filter === 'all' ? 'white' : '#475569',
                border: '1px solid', borderColor: filter === 'all' ? BRAND.primary : 'rgba(0,0,0,0.08)',
                '& .MuiChip-icon': { color: filter === 'all' ? 'white' : BRAND.primary },
              }}
            />
            <Chip
              icon={<UnreadIcon sx={{ fontSize: 18 }} />}
              label={`${t('notifications.unread', 'غير مقروءة')} (${unreadCount})`}
              onClick={() => setFilter('unread')}
              sx={{
                fontWeight: 700, cursor: 'pointer',
                bgcolor: filter === 'unread' ? '#ef4444' : 'white',
                color: filter === 'unread' ? 'white' : '#475569',
                border: '1px solid', borderColor: filter === 'unread' ? '#ef4444' : 'rgba(0,0,0,0.08)',
                '& .MuiChip-icon': { color: filter === 'unread' ? 'white' : '#ef4444' },
              }}
            />
          </Stack>

          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<DoneAllIcon />}
              onClick={markAllAsRead}
              sx={{ borderColor: BRAND.primary, color: BRAND.primary, fontWeight: 700, textTransform: 'none', borderRadius: 2 }}
            >
              {t('notifications.mark_all_read', 'تحديد الكل كمقروء')}
            </Button>
          )}

        <Button
        variant="outlined"
        onClick={() => addLocalNotification({
        title: '🎉 اختبار الإشعارات',
        message: 'إذا رأيت هذا الإشعار فالواجهة تعمل بنجاح! المشكلة في الباكند.',
        type: 'general',
        })}
        sx={{ 
        borderColor: '#10b981', color: '#10b981', 
        fontWeight: 700, textTransform: 'none', borderRadius: 2 
        }}
        >
        🧪 إرسال إشعار تجريبي
        </Button>
        </Stack>

        {/* ========== القائمة ========== */}
        {loading ? (
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton height={16} width="60%" sx={{ mb: 1 }} />
                  <Skeleton height={12} width="90%" sx={{ mb: 0.5 }} />
                  <Skeleton height={12} width="30%" />
                </Box>
              </Box>
            ))}
          </Paper>
        ) : filtered.length === 0 ? (
          <Fade in>
            <Paper elevation={0} sx={{
              p: 6, textAlign: 'center', borderRadius: 4,
              border: '2px dashed #cbd5e1', bgcolor: 'rgba(255,255,255,0.9)',
            }}>
              <Box sx={{
                width: 90, height: 90, mx: 'auto', mb: 2,
                bgcolor: 'rgba(51,151,184,0.08)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BellIcon sx={{ fontSize: 44, color: BRAND.primary }} />
              </Box>
              <Typography variant="h6" fontWeight="700" color="#0f172a" gutterBottom>
                {filter === 'unread'
                  ? t('notifications.no_unread', 'لا توجد إشعارات غير مقروءة')
                  : t('notifications.empty_title', 'لا توجد إشعارات')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('notifications.empty_desc', 'ستصلك هنا كل التحديثات المتعلقة بحجوزاتك ورحلاتك')}
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', bgcolor: 'white' }}>
            <List disablePadding>
              {filtered.map((n, i) => (
                <Grow in key={n.id} timeout={200 + i * 60}>
                  <Box>
                    <NotificationItem n={n} onClick={(item) => !(item.read_at || item.is_read) && markAsRead(item.id)} />
                    {i < filtered.length - 1 && <Divider component="li" />}
                  </Box>
                </Grow>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  )
}