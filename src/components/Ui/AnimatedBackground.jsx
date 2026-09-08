import { Box } from '@mui/material'
import { floatingCircleSx } from '../styles/animations'

/** خلفية بدوائر عائمة — ضعها داخل Box بـ position: relative */
export default function AnimatedBackground() {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <Box sx={floatingCircleSx({ top: '5%', right: '-5%', size: { xs: 200, md: 400 }, duration: 15 })} />
      <Box sx={floatingCircleSx({ bottom: '10%', left: '-5%', size: { xs: 250, md: 500 }, color: 'rgba(10, 37, 64, 0.08)', duration: 18, reverse: true })} />
    </Box>
  )
}