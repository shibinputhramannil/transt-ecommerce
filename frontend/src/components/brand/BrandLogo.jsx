import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGO_PATH, BRAND_LOGO_LIGHT_PATH, APP_NAME } from '@/utils/constants';

/**
 * Reusable Brand Logo Component for Transt
 * Renders the official Transt logo seamlessly attached to any background with zero border artifacts.
 */
export const BrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  to = '/',
  variant = 'default', // 'default' | 'dark'
  className = '',
  imgClassName = '',
}) => {
  // Height definitions for crisp proportional rendering
  const heightMap = {
    sm: 'h-7 md:h-8',
    md: 'h-9 md:h-10',
    lg: 'h-12 md:h-14',
    xl: 'h-16 md:h-20',
  };

  const logoHeight = heightMap[size] || heightMap.md;
  const logoSrc = variant === 'dark' ? BRAND_LOGO_LIGHT_PATH : BRAND_LOGO_PATH;

  const content = (
    <div
      className={`brand-logo-container flex items-center justify-center select-none bg-transparent ${className}`}
    >
      <img
        src={logoSrc}
        alt={`${APP_NAME} Logo`}
        className={`w-auto ${logoHeight} object-contain transition-transform duration-200 ${imgClassName}`}
        loading="eager"
      />
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center transition-opacity hover:opacity-90 no-underline focus:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
