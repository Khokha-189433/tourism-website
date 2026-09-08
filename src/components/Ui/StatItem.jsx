import { Box, Stack, Typography } from '@mui/material'
import { statIconBoxSx } from '../../styles/animations'

/** عنصر إحصائية: أيقونة + عنوان + قيمة مع hover */
export default function StatItem({ icon, label, value, sx = {} }) {
  return (
    <Stack direction="row" spacing={1}
      sx={{  alignItems:"center",   transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' }, ...sx }}>
      <Box sx={statIconBoxSx}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{label}</Typography>
        <Typography variant="body2" fontWeight="700"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}