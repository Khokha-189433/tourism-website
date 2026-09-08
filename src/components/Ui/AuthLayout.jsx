import { Box, Container, Typography, Stack, Paper, Grid, Fade, Slide, Grow } from '@mui/material'
import { FlightTakeoff as FlightIcon } from '@mui/icons-material'

/**
 * مكون تخطيط مشترك لصفحات المصادقة (Login, Register, ForgotPassword)
 * يوفر التصميم الاحترافي مع الصورة والترحيب
 */
export default function AuthLayout({ children, title, subtitle, icon, features = [], imageSrc, fallbackSrc }) {
  // Use a local asset so the auth pages do not depend on blocked external image hosts.
  const imageUrl = imageSrc || '/register-illustration.svg'
  const fallbackImage = fallbackSrc || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop'

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      py: { xs: 2, sm: 4, md: 6 },
      px: { xs: 1, sm: 2 },
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0f9ff 100%)',
    }}>
      {/* أشكال خلفية متحركة */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{
          position: 'absolute', top: '10%', right: '5%',
          width: { xs: 150, md: 400 }, height: { xs: 150, md: 400 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(51, 151, 184, 0.15) 0%, transparent 70%)',
          animation: 'float-slow 8s ease-in-out infinite',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '10%', left: '10%',
          width: { xs: 200, md: 500 }, height: { xs: 200, md: 500 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10, 37, 64, 0.1) 0%, transparent 70%)',
          animation: 'float-slow 10s ease-in-out infinite reverse',
        }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: { xs: 3, md: 5 },
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(10, 37, 64, 0.15)',
            bgcolor: 'white',
            maxWidth: { xs: '100%', sm: 600, md: 1200 },
            mx: 'auto',
          }}
        >
          <Grid
            container
            spacing={0}
            sx={{
              width: '100%',
              margin: 0,
              padding: 0,
              gap: 0,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {/* القسم الأيمن: الصورة والترحيب (يختفي على الموبايل) */}
            <Grid
              xs={12}
              md={5}
              sx={{
                display: 'flex',
                padding: 0,
                margin: 0,
                flex: { xs: '0 0 100%', md: '0 0 41.666667%' },
                maxWidth: { xs: '100%', md: '41.666667%' },
              }}
            >
              <Slide direction="right" in={true} timeout={1000}>
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minHeight: { xs: 360, sm: 480, md: 700 },
                  background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                  color: 'white',
                  p: { xs: 2.5, sm: 4, md: 4, lg: 5 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                }}>
                  <Box sx={{
                    position: 'absolute', top: -80, right: -80,
                    width: 300, height: 300, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    animation: 'float-slow 8s ease-in-out infinite',
                  }} />
                  <Box sx={{
                    position: 'absolute', bottom: -100, left: -100,
                    width: 400, height: 400, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    animation: 'float-slow 10s ease-in-out infinite reverse',
                  }} />

                  <Fade in={true} timeout={1500}>
                    <Stack direction="row" spacing={1.5} sx={{ position: 'relative', zIndex: 2 , alignItems:"center"}}>
                      <Box sx={{
                        width: 45, height: 45,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FlightIcon sx={{ color: 'white' }} />
                      </Box>
                      <Typography variant="h6" fontWeight="800" letterSpacing="-0.5px">
                        TravelGo
                      </Typography>
                    </Stack>
                  </Fade>

                  <Fade in={true} timeout={2000}>
                    <Box sx={{
                      position: 'relative', zIndex: 2,
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      my: 3, flex: 1,
                      animation: 'float 4s ease-in-out infinite',
                    }}>
                      <Box
                        component="img"
                        src={imageUrl}
                        alt="Travel Illustration"
                        onError={(e) => { e.currentTarget.src = fallbackImage }}
                        sx={{
                          width: '100%', maxWidth: { xs: 260, sm: 320, md: 320, lg: 380 },
                          height: 'auto',
                          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                          transition: 'transform 0.3s ease',
                          borderRadius: 3,
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                    </Box>
                  </Fade>

                  <Grow in={true} timeout={2500}>
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                      <Typography variant="h4" fontWeight="800" gutterBottom sx={{
                        lineHeight: 1.3,
                        fontSize: { md: '1.8rem', lg: '2.2rem' }
                      }}>
                        {title}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.7 }}>
                        {subtitle}
                      </Typography>

                      {features.length > 0 && (
                        <Stack spacing={2}>
                          {features.map((feature, idx) => (
                            <Grow in={true} timeout={2500 + idx * 300} key={idx}>
                              <Stack direction="row" spacing={2}  sx={{alignItems:"flex-start"}}>
                                <Box sx={{
                                  width: 44, height: 44, minWidth: 44,
                                  bgcolor: 'rgba(255,255,255,0.15)',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: 2,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: 'white',
                                  animation: 'pulse 2s ease-in-out infinite',
                                  animationDelay: `${idx * 0.5}s`,
                                }}>
                                  {feature.icon}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 0.5 }}>
                                    {feature.title}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.5 }}>
                                    {feature.desc}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grow>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Grow>
                </Box>
              </Slide>
            </Grid>

            {/* القسم الأيسر: محتوى الصفحة */}
            <Grid
              
              xs={12}
              md={7}
              sx={{
                padding: 0,
                margin: 0,
                flex: { xs: '0 0 100%', md: '0 0 58.333333%' },
                maxWidth: { xs: '100%', md: '58.333333%' },
              }}
            >
              <Fade in={true} timeout={800}>
                <Box sx={{
                  p: { xs: 3, sm: 4, md: 5, lg: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: { xs: 'auto', md: 700 },
                }}>
                  {children}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255,255,255,0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </Box>
  )
}