import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* flexGrow: 1 يجعل هذا الجزء يتمدد ليملأ المساحة المتبقية، مما يدفع الـ Footer للأسفل دائماً */}
      <Box component="main" sx={{
        flexGrow: 1,
        width: '100%',
        py: { xs: 1, sm: 1.5, md: 1 },
        px: 0,
        overflowX: 'hidden'
      }}>
        <Outlet /> 
      </Box>
      <Footer />
    </Box>
  );
}