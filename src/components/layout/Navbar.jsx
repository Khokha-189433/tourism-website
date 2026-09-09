import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Container,
  Drawer, List, ListItem, ListItemButton, ListItemText, Divider,
  Avatar, Menu, MenuItem, Fade, Badge, useMediaQuery, useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language,
  FlightTakeoff as FlightIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  Close as CloseIcon,
  FavoriteBorder as FavoriteIcon,
  Notifications as NotificationsIcon,  
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotifications } from '../../context/NotificationsContext';  
import NotificationsMenu from '../../components/Ui/NotificationsMenu' ;

// ==================== مكونات مساعدة ====================

const IconActionButton = ({ icon, onClick, to, title, sx = {}, isActive = false, small = false }) => (
  <IconButton
    onClick={onClick}
    component={to ? RouterLink : 'button'}
    to={to}
    title={title}
    sx={{
      width: small ? 36 : 40,
      height: small ? 36 : 40,
      border: '1.5px solid',
      borderColor: isActive ? '#3397b8' : 'rgba(51, 151, 184, 0.3)',
      bgcolor: isActive ? 'rgba(51, 151, 184, 0.1)' : 'white',
      color: '#3397b8',
      borderRadius: 2,
      flexShrink: 0,
      transition: 'all 0.3s ease',
      '&:hover': { bgcolor: '#3397b8', color: 'white', borderColor: '#3397b8' },
      '& .MuiSvgIcon-root': { fontSize: small ? 18 : 20 },
      ...sx
    }}
  >
    {icon}
  </IconButton>
);

const NavMenuItem = ({ icon, label, to, onClick, color = 'inherit', hoverBg = 'rgba(51, 151, 184, 0.05)', isActive = false }) => (
  <MenuItem
    component={to ? RouterLink : 'div'}
    to={to}
    onClick={onClick}
    sx={{ py: 1.5, color, bgcolor: isActive ? 'rgba(51, 151, 184, 0.08)' : 'transparent', '&:hover': { bgcolor: hoverBg } }}
  >
    <Box sx={{ mr: 1.5, color: color === 'inherit' ? '#3397b8' : color, display: 'flex' }}>{icon}</Box>
    <Typography variant="body2" fontWeight={isActive ? 700 : 500}>{label}</Typography>
  </MenuItem>
);

const DrawerNavItem = ({ title, path, isActive }) => (
  <ListItem disablePadding sx={{ px: 2 }}>
    <ListItemButton
      component={RouterLink}
      to={path}
      sx={{
        borderRadius: 2, mb: 0.5,
        bgcolor: isActive ? 'rgba(51, 151, 184, 0.1)' : 'transparent',
        color: isActive ? '#3397b8' : 'text.primary',
        fontWeight: isActive ? 700 : 500,
        transition: 'all 0.2s ease',
        '&:hover': { bgcolor: 'rgba(51, 151, 184, 0.08)', transform: 'translateX(4px)' }
      }}
    >
      <ListItemText primary={title} />
    </ListItemButton>
  </ListItem>
);

const DrawerActionItem = ({ icon, label, to, onClick, color = 'inherit', isActive = false }) => (
  <ListItem disablePadding sx={{ px: 2 }}>
    <ListItemButton
      component={to ? RouterLink : 'div'}
      to={to}
      onClick={onClick}
      sx={{
        borderRadius: 2, mb: 0.5, color,
        bgcolor: isActive ? 'rgba(51, 151, 184, 0.1)' : 'transparent',
        fontWeight: isActive ? 700 : 500,
        '&:hover': { bgcolor: 'rgba(51, 151, 184, 0.08)' }
      }}
    >
      <Box sx={{ mr: 1.5, color: color === 'inherit' ? '#3397b8' : color, display: 'flex' }}>{icon}</Box>
      <ListItemText primary={label} />
    </ListItemButton>
  </ListItem>
);

// ==================== المكون الرئيسي ====================

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useApp();
  const { count } = useFavorites();
  const { unreadCount } = useNotifications();  // ✅ إضافة: عدّاد الإشعارات
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  const isRTL = i18n.language?.startsWith('ar');

  const navLinks = [
    { title: t('navbar.home') || 'الرئيسية', path: '/' },
    { title: t('navbar.trips') || 'الرحلات', path: '/trips' },
    { title: t('navbar.packages') || 'الباقات', path: '/packages' },
    { title: t('navbar.blog') || 'المدونة', path: '/blog' },
    { title: t('navbar.contact') || 'تواصل معنا', path: '/contact' },
    { title: t('navbar.about') || 'من نحن', path: '/about' },
    
  ];

  const isProfileActive = location.pathname === '/profile';
  const isMyBookingsActive = location.pathname === '/my-bookings';
  const isFavoritesActive = location.pathname === '/favorites';
  const isAboutActive = location.pathname === '/about';
  const isNotificationsActive = location.pathname === '/notifications';  // ✅ إضافة

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLanguageToggle = () => i18n.changeLanguage(isRTL ? 'en' : 'ar');
  const handleUserMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    handleUserMenuClose();
    navigate('/login');
  };

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // ============ Drawer ============
  const drawer = (
    <Box dir={isRTL ? 'rtl' : 'ltr'} sx={{ width: '100%', bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)', color: 'white', position: 'relative' }}>
        <IconButton onClick={handleDrawerToggle} sx={{ position: 'absolute', top: 8, right: isRTL ? 'auto' : 8, left: isRTL ? 8 : 'auto', color: 'white' }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{ width: 45, height: 45, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlightIcon sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight="800">{t('navbar.brand') || 'TravelGo'}</Typography>
        </Box>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>{user.first_name?.charAt(0) || 'U'}</Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="700">{user.first_name} {user.last_name}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>{user.email}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('navbar.welcome_guest') || 'مرحباً بك!'}</Typography>
        )}
      </Box>

      <List sx={{ flex: 1, py: 2 }}>
        {navLinks.map((link) => (
          <DrawerNavItem key={link.path} {...link} isActive={isActive(link.path)} />
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        {!user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button component={RouterLink} to="/login" variant="outlined" fullWidth sx={{ borderRadius: 2, borderColor: '#3397b8', color: '#3397b8' }}>
              {t('navbar.login') || 'تسجيل الدخول'}
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" fullWidth sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)', '&:hover': { background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)' } }}>
              {t('navbar.register') || 'إنشاء حساب'}
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            <DrawerActionItem icon={<PersonIcon />} label={t('navbar.profile') || 'الملف الشخصي'} to="/profile" isActive={isProfileActive} />
            <DrawerActionItem icon={<BookmarkIcon />} label={t('navbar.my_bookings') || 'حجوزاتي'} to="/my-bookings" isActive={isMyBookingsActive} />

            {/* ✅ إضافة: الإشعارات في Drawer (Mobile) */}
            <DrawerActionItem
              icon={
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                  <NotificationsIcon />
                </Badge>
              }
              label={t('navbar.notifications', 'الإشعارات')}
              to="/notifications"
              isActive={isNotificationsActive}
            />

            {/* المفضلة */}
            <DrawerActionItem
              icon={
                <Badge badgeContent={count} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                  <FavoriteIcon />
                </Badge>
              }
              label={t('navbar.favorites', 'المفضلة')}
              to="/favorites"
              isActive={isFavoritesActive}
            />
            <DrawerActionItem icon={<LogoutIcon />} label={t('navbar.logout') || 'تسجيل الخروج'} onClick={handleLogout} color="#ef4444" />
          </List>
        )}

        <Button fullWidth onClick={handleLanguageToggle} startIcon={<Language />} variant="outlined"
          sx={{ mt: 2, borderColor: '#e2e8f0', color: '#64748b', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#3397b8', color: '#3397b8' } }}>
          {isRTL ? 'English' : 'العربية'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 2 : 0}
        sx={{
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100vw',
          bgcolor: isMobile ? '#ffffff' : (scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)'),
          backdropFilter: isMobile ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: isMobile ? 'none' : 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 }, width: '100%' }}>
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64, md: 72 }, justifyContent: 'space-between', gap: 1 }}>

            {/* المجموعة اليمنى: القائمة + الشعار */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <IconButton
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' }, color: '#0f172a', p: 0.75, flexShrink: 0 }}
              >
                <MenuIcon />
              </IconButton>

              <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', minWidth: 0 }}>
                <Box sx={{
                  width: { xs: 34, sm: 38, md: 42 }, height: { xs: 34, sm: 38, md: 42 },
                  background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                  borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(51, 151, 184, 0.3)', flexShrink: 0,
                }}>
                  <FlightIcon sx={{ color: 'white', fontSize: { xs: 18, sm: 22, md: 24 } }} />
                </Box>
                <Typography variant="h6" noWrap sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  display: { xs: 'none', sm: 'block' },
                }}>
                  {t('navbar.brand') || 'TravelGo'}
                </Typography>
              </Box>
            </Box>

            {/* روابط التنقل (ديسكتوب فقط) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, justifyContent: 'center' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    position: 'relative',
                    color: isActive(link.path) ? '#3397b8' : '#475569',
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontSize: '0.95rem', textTransform: 'none', px: 2, py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { color: '#3397b8', bgcolor: 'rgba(51, 151, 184, 0.05)' },
                    '&::after': {
                      content: '""', position: 'absolute', bottom: 4, left: '50%',
                      transform: isActive(link.path) ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                      width: '60%', height: 3, bgcolor: '#3397b8', borderRadius: 2,
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::after': { transform: 'translateX(-50%) scaleX(0.6)' }
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Box>

            {/* المجموعة اليسرى: الإجراءات */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
              <IconActionButton
                small={isMobile}
                icon={<PersonIcon />}
                to={user ? '/profile' : '/login'}
                title={user ? (t('navbar.profile') || 'الملف الشخصي') : (t('navbar.login') || 'تسجيل الدخول')}
                isActive={isProfileActive}
              />

              {/* ✅ إضافة: زر الإشعارات (يظهر فقط للمسجلين) */}
              {user && <NotificationsMenu />}

              {/* زر المفضلة */}
              <IconActionButton
                small={isMobile}
                icon={
                  <Badge
                    badgeContent={count}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: 10,
                        height: 16,
                        minWidth: 16,
                        fontWeight: 700,
                      }
                    }}
                  >
                    <FavoriteIcon />
                  </Badge>
                }
                to="/favorites"
                title={t('navbar.favorites', 'المفضلة')}
                isActive={isFavoritesActive}
              />

              <IconActionButton
                small={isMobile}
                icon={<Language />}
                onClick={handleLanguageToggle}
                title={isRTL ? 'Switch to English' : 'التبديل للعربية'}
                sx={{ '&:hover': { transform: 'rotate(180deg)' } }}
              />

              {user && (
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                  <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, '&:hover': { transform: 'scale(1.05)' } }}>
                    <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot"
                      sx={{ '& .MuiBadge-badge': { bgcolor: '#10b981', border: '2px solid white', width: 12, height: 12, borderRadius: '50%' } }}>
                      <Avatar sx={{ width: { sm: 36, md: 40 }, height: { sm: 36, md: 40 }, bgcolor: '#3397b8', fontWeight: 700 }}>
                        {user.first_name?.charAt(0) || 'U'}
                      </Avatar>
                    </Badge>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={userMenuOpen}
                    onClose={handleUserMenuClose}
                    slots={{ transition: Fade }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    sx={{
                      mt: 1.5,
                      '& .MuiPaper-root': {
                        borderRadius: 3,
                        minWidth: 240,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}>
                      <Typography variant="subtitle2" fontWeight="700" color="#0f172a">{user.first_name} {user.last_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    </Box>
                    <NavMenuItem icon={<PersonIcon sx={{ fontSize: 20 }} />} label={t('navbar.profile') || 'الملف الشخصي'} to="/profile" onClick={handleUserMenuClose} isActive={isProfileActive} />
                    <NavMenuItem icon={<BookmarkIcon sx={{ fontSize: 20 }} />} label={t('navbar.my_bookings') || 'حجوزاتي'} to="/my-bookings" onClick={handleUserMenuClose} isActive={isMyBookingsActive} />

                    {/* ✅ إضافة: الإشعارات في قائمة المستخدم (Desktop) */}
                    <NavMenuItem
                      icon={
                        <Badge badgeContent={unreadCount} color="error"
                          sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16, fontWeight: 700 } }}>
                          <NotificationsIcon sx={{ fontSize: 20 }} />
                        </Badge>
                      }
                      label={t('navbar.notifications', 'الإشعارات')}
                      to="/notifications"
                      onClick={handleUserMenuClose}
                      isActive={isNotificationsActive}
                    />

                    {/* المفضلة */}
                    <NavMenuItem
                      icon={
                        <Badge
                          badgeContent={count}
                          color="error"
                          sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16, fontWeight: 700 } }}
                        >
                          <FavoriteIcon sx={{ fontSize: 20 }} />
                        </Badge>
                      }
                      label={t('navbar.favorites', 'المفضلة')}
                      to="/favorites"
                      onClick={handleUserMenuClose}
                      isActive={isFavoritesActive}
                    />
                    <Divider />
                    <NavMenuItem icon={<LogoutIcon sx={{ fontSize: 20 }} />} label={t('navbar.logout') || 'تسجيل الخروج'} onClick={handleLogout} color="#ef4444" hoverBg="#fef2f2" />
                  </Menu>
                </Box>
              )}

              {!user && (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
                  <Button component={RouterLink} to="/login" variant="text" sx={{ color: '#475569', fontWeight: 600, textTransform: 'none', '&:hover': { color: '#3397b8' } }}>
                    {t('navbar.login') || 'دخول'}
                  </Button>
                  <Button component={RouterLink} to="/register" variant="contained" sx={{ background: 'linear-gradient(135deg, #0a2540 0%, #3397b8 100%)', color: 'white', fontWeight: 700, textTransform: 'none', px: 3, borderRadius: 2, '&:hover': { background: 'linear-gradient(135deg, #1e3a5f 0%, #217490 100%)', transform: 'translateY(-2px)' } }}>
                    {t('navbar.register') || 'تسجيل'}
                  </Button>
                </Box>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor={isRTL ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: 'calc(100% - 32px)', sm: 320 },
            maxWidth: 'calc(100vw - 32px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            borderRadius: { xs: 0, sm: isRTL ? '12px 0 0 12px' : '0 12px 12px 0' },
            my: { xs: 2, sm: 0 },
            mx: { xs: 2, sm: 0 },
            height: { xs: 'calc(100% - 16px)', sm: '100%' }
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}