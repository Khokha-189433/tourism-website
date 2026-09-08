import { Chip } from '@mui/material'
import { pulseChipSx } from '../../styles/animations'

/** شارة نابضة: <PulseChip color="#f59e0b" bgcolor="#fef3c7" pulse label="قيد الانتظار" /> */
export default function PulseChip({ color, bgcolor, pulse = false, sx = {}, ...props }) {
  return <Chip size="small" sx={{ ...pulseChipSx(color, bgcolor, pulse), ...sx }} {...props} />
}