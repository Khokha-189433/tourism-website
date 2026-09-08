import { Typography } from '@mui/material'
import { gradientTextSx } from '../../components/styles/animations'

/** نص بتدرج لوني: <GradientText variant="h3">العنوان</GradientText> */
export default function GradientText({ children, sx = {}, ...props }) {
  return (
    <Typography sx={{ ...gradientTextSx, ...sx }} {...props}>
      {children}
    </Typography>
  )
}
