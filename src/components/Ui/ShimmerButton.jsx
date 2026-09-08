import { Button, CircularProgress, Box } from '@mui/material'
import { BRAND, gradientButtonSx, fillOnHoverButtonSx } from '../../styles/animations'

/**
 * زر بأنيميشن جاهز
 * variant="gradient" → متدرج + لمعان دائم
 * variant="fill"     → محدد يمتلئ عند التمرير
 */
export default function ShimmerButton({ variant = 'gradient', loading = false, children, sx = {}, ...props }) {
  return (
    <Button
      variant={variant === 'gradient' ? 'contained' : 'outlined'}
      disabled={loading || props.disabled}
      {...props}
      sx={{
        fontWeight: 700,
        textTransform: 'none',
        borderRadius: 2.5,
        ...(variant === 'fill' ? { borderColor: BRAND.primary, color: BRAND.primary } : {}),
        ...(variant === 'gradient' ? gradientButtonSx : fillOnHoverButtonSx),
        ...sx,
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        {loading && <CircularProgress size={18} color="inherit" />}
        {children}
      </Box>
    </Button>
  )
}