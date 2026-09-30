import React from 'react';
import { Outlet } from 'react-router-dom';
import BrandLogo from '../components/brand/BrandLogo';

/**
 * Clean Auth Layout for Login / Register pages matching the Transt brand
 */
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-transt-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <BrandLogo size="lg" />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-3xl sm:px-10 border border-transt-border">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
