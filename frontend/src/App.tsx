import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

import Home from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const PublicLayout = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const RequireAuth = () => {
  const { user, initializing } = useAuth();
  const loc = useLocation();
  if (initializing) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Outlet />;
};

const RequireAdmin = () => {
  const { user, initializing } = useAuth();
  if (initializing) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_admin) return <Navigate to="/" replace />;
  return <Outlet />;
};

const AdminLayout = () => (
  <div className="flex flex-col md:flex-row min-h-screen bg-ink-50">
    <AdminSidebar />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-ink-900" />
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', fontSize: '0.875rem' } }} />
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            <Route element={<RequireAuth />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="order-success/:id" element={<OrderSuccess />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
