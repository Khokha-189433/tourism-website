import { ListItemButton, Avatar, Box, Typography, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getNotificationMeta, timeAgo, getNotificationText } from '../utils/notificationHelper'

export default function NotificationItem({ n, onClick }) {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const { Icon, color } = getNotificationMeta(n)
  const { title, message } = getNotificationText(n, isRTL)
  const isRead = Boolean(n.read_at || n.is_read)

  return (
    <ListItemButton
      onClick={() => onClick?.(n)}
      sx={{
        py: 1.5, px: 2,
        bgcolor: isRead ? 'transparent' : 'rgba(51,151,184,0.06)',
        borderLeft: isRTL ? 'none' : `3px solid ${isRead ? 'transparent' : '#3397b8'}`,
        borderRight: isRTL ? `3px solid ${isRead ? 'transparent' : '#3397b8'}` : 'none',
        transition: 'all 0.25s ease',
        alignItems: 'flex-start',
        '&:hover': { bgcolor: 'rgba(51,151,184,0.08)' },
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: `${color}18`, color, width: 40, height: 40, flexShrink: 0 }}>
          <Icon sx={{ fontSize: 20 }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            fontWeight={isRead ? 600 : 800}
            color="#0f172a"
            sx={{ lineHeight: 1.4, mb: 0.25 }}
          >
            {title || message}
          </Typography>
          {title && message && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}
            >
              {message}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
            {timeAgo(n.createdAt || n.created_at, isRTL)}
          </Typography>
        </Box>

        {/* نقطة غير مقروء */}
        {!isRead && (
          <Box sx={{
            width: 9, height: 9, borderRadius: '50%',
            bgcolor: '#3397b8', flexShrink: 0, mt: 0.75,
            boxShadow: '0 0 8px rgba(51,151,184,0.7)',
          }} />
        )}
      </Stack>
    </ListItemButton>
  )
}