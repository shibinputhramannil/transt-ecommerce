import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * Main Layout with Transt warm cream background, sticky navbar, and botanical footer
 */
export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transt-bg text-transt-text">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
