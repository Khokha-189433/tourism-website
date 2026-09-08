/**
 * 🎨 أنماط الأنيميشن الجاهزة (sx objects)
 * استورد ما تحتاجه: import { gradientButtonSx } from '../styles/animations'
 */

// ========== ألوان العلامة المركزية ==========
export const BRAND = {
  primary: '#3397b8',
  primaryDark: '#217490',
  navy: '#0a2540',
  navyLight: '#1e3a5f',
  gradient: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
  gradientDark: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)',
  pageBg: 'linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%)',
}

// ========== نص بتدرج لوني ==========
export const gradientTextSx = {
  background: BRAND.gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

// ========== دائرة خلفية عائمة ==========
export const floatingCircleSx = ({
  top, right, bottom, left,
  size = 300,
  color = 'rgba(51, 151, 184, 0.12)',
  duration = 15,
  reverse = false,
} = {}) => ({
  position: 'absolute',
  top, right, bottom, left,
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  animation: `floatBg ${duration}s ease-in-out infinite${reverse ? ' reverse' : ''}`,
})

// ========== بطاقة ترتفع عند التمرير ==========
export const liftCardSx = {
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 20px 50px rgba(10,37,64,0.15)',
    transform: 'translateY(-6px)',
  },
}

// ========== زر متدرج + لمعان دائم ==========
export const gradientButtonSx = {
  background: BRAND.gradient,
  boxShadow: '0 4px 16px rgba(51,151,184,0.35)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0, left: '-100%',
    width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    animation: 'shimmer 2.5s infinite',
    pointerEvents: 'none',
  },
  '& .MuiButton-startIcon, & .MuiButton-endIcon': { position: 'relative', zIndex: 1 },
  '&:hover': {
    background: BRAND.gradientDark,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(51,151,184,0.5)',
  },
  '&:disabled': {
    background: '#cbd5e1',
    boxShadow: 'none',
    '&::before': { display: 'none' },
  },
}

// ========== زر محدد يمتلئ بالتدرج عند التمرير ==========
export const fillOnHoverButtonSx = {
  borderWidth: 2,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: BRAND.gradient,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '& .MuiButton-startIcon, & .MuiButton-endIcon': { position: 'relative', zIndex: 1 },
  '&:hover': {
    color: 'white !important',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(51,151,184,0.3)',
    '&::before': { opacity: 1 },
  },
}

// ========== شارة نابضة ==========
export const pulseChipSx = (color, bgcolor, pulse = false) => ({
  bgcolor,
  color,
  fontWeight: 700,
  border: `1px solid ${color}`,
  animation: pulse ? 'pulseGlow 2s ease-in-out infinite' : 'none',
  transition: 'all 0.3s ease',
  '&:hover': { transform: 'scale(1.05)', bgcolor },
})

// ========== صندوق أيقونة يتلون عند التمرير ==========
export const statIconBoxSx = {
  width: 32,
  height: 32,
  bgcolor: 'rgba(51,151,184,0.1)',
  borderRadius: 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    bgcolor: BRAND.primary,
    '& .MuiSvgIcon-root': { color: 'white !important' },
  },
}

// ========== شريط حالة علوي متدرج ==========
export const statusStripeSx = (colorA, colorB, animated = false) => ({
  height: 4,
  background: `linear-gradient(90deg, ${colorA} 0%, ${colorB} 100%)`,
  backgroundSize: '200% 100%',
  animation: animated ? 'gradientBorder 3s ease infinite' : 'none',
})

// ========== توقيت ظهور متتابع للقوائم ==========
export const staggerTimeout = (index, base = 400, step = 120) => base + index * step