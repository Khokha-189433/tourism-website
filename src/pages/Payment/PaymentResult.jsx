import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { parseSamaPayResult } from '../../components/utils/samapay'
import api from '../../API/axios'
import { BRAND, gradientTextSx, gradientButtonSx } from '../../components/styles/animations'
import AnimatedBackground from '../../components/Ui/AnimatedBackground'
import {
  Container, Box, Typography, Paper, Stack, Button, CircularProgress, Alert
} from '@mui/material'
import {
  CheckCircle as SuccessIcon,
  Cancel as FailIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
  Refresh as RetryIcon
} from '@mui/icons-material'

export default function PaymentResult() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success' | 'failed' | 'error'
  const [paymentInfo, setPaymentInfo] = useState(null)

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const result = parseSamaPayResult()
        console.log('[PaymentResult] SamaPay result:', result)

        if (!result.transactionRef) {
          setPaymentStatus('error')
          setLoading(false)
          return
        }

        // التحقق من حالة الدفع عبر Backend
        const { data } = await api.get(`/payments/status/${result.transactionRef}`)
        const payment = data.data || data

        setPaymentInfo({
          ref: result.transactionRef,
          status: payment.status || (result.isSuccess ? 'paid' : 'failed'),
          amount: payment.amount,
          currency: payment.currency || 'SYP',
          bookingId: payment.booking_id,
          bookingRef: payment.booking_ref,
        })

        setPaymentStatus(result.isSuccess || payment.status === 'paid' ? 'success' : 'failed')
      } catch (err) {
        console.error('[PaymentResult] Error:', err)
        // حتى لو فشل التحقق، نعتمد على بيانات URL
        const result = parseSamaPayResult()
        setPaymentStatus(result.isSuccess ? 'success' : 'failed')
        setPaymentInfo({ ref: result.transactionRef })
      } finally {
        setLoading(false)
      }
    }

    checkPayment()
  }, [])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.pageBg }}>
        <Stack  spacing={3} sx={{alignItems:"center"}}>
          <CircularProgress size={60} sx={{ color: BRAND.primary }} />
          <Typography variant="h6" color="text.secondary">
            {t('payment.checking', 'جاري التحقق من حالة الدفع...')}
          </Typography>
        </Stack>
      </Box>
    )
  }

  const isSuccess = paymentStatus === 'success'

  return (
    <Box sx={{
      minHeight: '100vh',
      background: BRAND.pageBg,
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      <AnimatedBackground />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
        <Paper elevation={0} sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 20px 60px rgba(10,37,64,0.1)',
        }}>
          {/* الأيقونة */}
          <Box sx={{
            width: 100, height: 100, mx: 'auto', mb: 3,
            borderRadius: '50%',
            background: isSuccess
              ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isSuccess
              ? '0 10px 40px rgba(16,185,129,0.3)'
              : '0 10px 40px rgba(239,68,68,0.3)',
            animation: 'floatIcon 3s ease-in-out infinite',
          }}>
            {isSuccess
              ? <SuccessIcon sx={{ fontSize: 50, color: 'white' }} />
              : <FailIcon sx={{ fontSize: 50, color: 'white' }} />
            }
          </Box>

          {/* العنوان */}
          <Typography variant="h4" fontWeight="800" sx={{
            ...gradientTextSx,
            mb: 1.5,
            ...(! isSuccess && {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
            })
          }}>
            {isSuccess
              ? t('payment.success_title', 'تم الدفع بنجاح! 🎉')
              : t('payment.failed_title', 'فشلت عملية الدفع')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            {isSuccess
              ? t('payment.success_desc', 'شكراً لك! تم تأكيد حجزك ودفعك بنجاح. سيصلك إشعار بالتفاصيل.')
              : t('payment.failed_desc', 'لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى من صفحة حجوزاتي.')}
          </Typography>

          {/* معلومات الدفع */}
          {paymentInfo?.ref && (
            <Alert
              severity={isSuccess ? 'success' : 'warning'}
              sx={{ mb: 4, borderRadius: 2, textAlign: 'left' }}
            >
              <Typography variant="body2">
                <strong>{t('payment.ref', 'الرقم المرجعي')}:</strong>{' '}
                <span style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{paymentInfo.ref}</span>
              </Typography>
              {paymentInfo.amount && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>{t('payment.amount', 'المبلغ')}:</strong>{' '}
                  {Number(paymentInfo.amount).toLocaleString()} {paymentInfo.currency}
                </Typography>
              )}
            </Alert>
          )}

          {/* الأزرار */}
          <Stack spacing={2}>
            {isSuccess ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ReceiptIcon />}
                  onClick={() => navigate('/my-bookings')}
                  sx={{ ...gradientButtonSx, borderRadius: 3, textTransform: 'none', fontWeight: 700, py: 1.5 }}
                >
                  {t('payment.go_to_bookings', 'عرض حجوزاتي')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    borderColor: BRAND.primary, color: BRAND.primary,
                    borderRadius: 3, textTransform: 'none', fontWeight: 700, borderWidth: 2,
                    '&:hover': { borderWidth: 2, borderColor: BRAND.primaryDark, bgcolor: 'rgba(51,151,184,0.05)' }
                  }}
                >
                  {t('payment.go_home', 'العودة للرئيسية')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RetryIcon />}
                  onClick={() => navigate('/my-bookings')}
                  sx={{ ...gradientButtonSx, borderRadius: 3, textTransform: 'none', fontWeight: 700, py: 1.5 }}
                >
                  {t('payment.retry', 'المحاولة مرة أخرى')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    borderColor: '#94a3b8', color: '#64748b',
                    borderRadius: 3, textTransform: 'none', fontWeight: 700, borderWidth: 2,
                    '&:hover': { borderWidth: 2, borderColor: '#64748b' }
                  }}
                >
                  {t('payment.go_home', 'العودة للرئيسية')}
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}