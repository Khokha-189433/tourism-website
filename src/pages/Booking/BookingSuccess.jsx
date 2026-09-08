import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from '@mui/icons-material'
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'

export default function BookingSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const bookingId = state?.bookingId
  const total = state?.total

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, textAlign: 'center', borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <CheckCircle sx={{ fontSize: 76, color: '#10b981', mb: 2 }} />
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t('booking.success_title')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('booking.success_message')}
        </Typography>

        {(bookingId || total !== undefined) && (
          <Box sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2, mb: 4 }}>
            {bookingId && <Typography>{t('booking.booking_number')}: <strong>#{bookingId}</strong></Typography>}
            {total !== undefined && <Typography>{t('booking.total')}: <strong>{Number(total).toLocaleString()} {t('common.currency')}</strong></Typography>}
          </Box>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}  sx={{ justifyContent:"center"}} >
          <Button variant="contained" onClick={() => navigate('/')}>
            {t('booking.back_home')}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/my-bookings')}>
            {t('booking.my_bookings')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}