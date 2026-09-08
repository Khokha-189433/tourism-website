import { useState, useEffect } from 'react'
import { Box, Stack } from '@mui/material'

// ========== قائمة الصور (عدّلها بحرية) ==========
const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2400&q=80',
    alt: 'مناطيد ملونة'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80',
    alt: 'شاطئ استوائي'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80',
    alt: 'قمم جبال'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80',
    alt: 'غروب على بحيرة'
  },
  {
    url: 'https://images.unsplash.com/photo-1547235001-d703406d3f17?auto=format&fit=crop&w=2400&q=80',
    alt: 'صحراء ذهبية'
  },
]

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=80'

/**
 * 🎬 هيرو متحرك: سلايدشو بتأثير Ken Burns (زوم بطيء سينمائي)
 * @param {number} interval - مدة كل شريحة بالميلي ثانية
 */
export default function HeroSlideshow({ interval = 6000 }) {
  const [index, setIndex] = useState(0)

  // ✅ تبديل تلقائي كل interval
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* ========== الشرائح ========== */}
      {HERO_IMAGES.map((img, i) => (
        <Box
          key={img.url}
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1.6s ease-in-out',
            zIndex: i === index ? 1 : 0,
          }}
        >
          <Box
            component="img"
            src={img.url}
            alt={img.alt}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              // 🎥 تأثير Ken Burns: زوم بطيء أثناء عرض الشريحة
              animation: i === index ? 'heroKenBurns 9s ease-out forwards' : 'none',
            }}
          />
        </Box>
      ))}

      {/* ========== طبقة التدرج لوضوح النص ========== */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 2,
        background:
          'linear-gradient(180deg, rgba(10,37,64,0.55) 0%, rgba(10,37,64,0.25) 45%, rgba(10,37,64,0.7) 100%)',
      }} />

      {/* ========== مؤشرات التنقل (نقاط) ========== */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute', bottom: 24, left: '50%',
          transform: 'translateX(-50%)', zIndex: 3,
        }}
      >
        {HERO_IMAGES.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 30 : 10,
              height: 10,
              borderRadius: 5,
              cursor: 'pointer',
              bgcolor: i === index ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.4s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
            }}
          />
        ))}
      </Stack>

      {/* ========== Keyframes لتأثير الزوم ========== */}
      <Box component="style">{`
        @keyframes heroKenBurns {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-1.5%, 1%); }
        }
      `}</Box>
    </Box>
  )
}