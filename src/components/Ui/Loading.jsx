import { Box, CircularProgress, Typography, Button } from '@mui/material'

// مكون صفحة التحميل (Loader)
export function PageLoader({ message = 'جاري التحميل...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh', // يأخذ نصف ارتفاع الشاشة على الأقل
        gap: 2,
      }}
    >
      <CircularProgress size={40} color="primary" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

// مكون عرض الأخطاء (مفيد جداً عند فشل جلب البيانات من الـ API)
export function ErrorMessage({ message, onRetry }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        gap: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography color="error" variant="h6">
        {message || 'حدث خطأ غير متوقع'}
      </Typography>
      
      {/* زر إعادة المحاولة يظهر فقط إذا تم تمرير دالة onRetry */}
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </Box>
  )
}