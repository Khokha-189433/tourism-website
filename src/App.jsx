import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/Home/HomePage';
import TripsPage from './pages/trips/TripsPage';
import TourDetails from './pages/trips/TourDetails'; 
import Login from './pages/Auth/Login';
import Booking from './pages/Booking/Booking';
import BookingSuccess from './pages/Booking/BookingSuccess';
import MyBookings from './pages/Booking/MyBookings';
import Blog from './pages/blog/Blog'
import ArticleDetails from './pages/Articles/ArticleDetails'
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile/Profile';
import PaymentResult from './pages/Payment/PaymentResult'
import Packages from './pages/Packages/Packages'
import PackageDetails from './pages/Packages/PackageDetails'
import Favorites from './pages/Favorites/Favorites'
import Contact from './pages/Contac/Contact'
import Notifications from './pages/Notifications/Notifications'


function App() {  
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* الصفحة الرئيسية */}
        <Route index element={<HomePage />} />

        {/*  صفحات المصادقة */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/*  صفحات المستخدم */}
        <Route path="profile" element={<Profile />} />
        <Route path="my-bookings" element={<MyBookings />} />

        {/*  صفحات الرحلات */}
        <Route path="trips" element={<TripsPage />} />
        <Route path="tours/:id" element={<TourDetails />} /> 

        {/*  صفحات الباقات (تم التصحيح - بدون Redirect) */}
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:id" element={<PackageDetails />} />

        {/*  صفحات المدونة */}
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<ArticleDetails />} />

        {/*  صفحات الحجز والدفع */}
        <Route path="booking/:id" element={<Booking />} />
        <Route path="booking/package/:id" element={<Booking />} />
        <Route path="booking-success" element={<BookingSuccess />} />
        <Route path="payment/result" element={<PaymentResult />} />

          {/*  صفحة المفضلة  */}
        <Route path="favorites" element={<Favorites />} />
          {/*  الاشعارات  */}
        <Route path="notifications" element={<Notifications />} />
          {/*   اتصل بنا   */}
        <Route path="Contact" element={<Contact />} />
     
      </Route>
    </Routes>
  );
}

export default App;



