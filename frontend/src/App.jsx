import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage key="home" setCurrentPage={setCurrentPage} />;
      case 'menu': return <MenuPage key="menu" setCurrentPage={setCurrentPage} />;
      case 'auth': return <AuthPage key="auth" onSuccess={setCurrentPage} />;
      case 'cart': return <CartPage key="cart" setCurrentPage={setCurrentPage} />;
      case 'orders': return <OrdersPage key="orders" setCurrentPage={setCurrentPage} />;
      case 'admin': return <AdminPage key="admin" />;
      default: return <HomePage key="home" setCurrentPage={setCurrentPage} />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
