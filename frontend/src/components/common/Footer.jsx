import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import BrandLogo from '../brand/BrandLogo';
import Container from './Container';
import { ROUTES, BRAND_TAGLINE } from '@/utils/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transt-green-dark text-transt-cream mt-auto border-t border-transt-green">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" variant="dark" />
            <p className="text-sm text-transt-cream/80 max-w-sm leading-relaxed">
              {BRAND_TAGLINE}. Thoughtfully engineered goods and seamless daily transit.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-transt-cream/70">
              <div className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-transt-accent" />
                <span>Express Logistics</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-transt-accent" />
                <span>Quality Certified</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="inline-flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-transt-accent" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-transt-cream-light tracking-wider uppercase mb-4">
              Explore Catalog
            </h4>
            <ul className="space-y-2.5 text-sm text-transt-cream/80">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CART} className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ORDERS} className="hover:text-white transition-colors">
                  Your Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Account / Support */}
          <div>
            <h4 className="text-xs font-bold text-transt-cream-light tracking-wider uppercase mb-4">
              Account & Service
            </h4>
            <ul className="space-y-2.5 text-sm text-transt-cream/80">
              <li>
                <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CHECKOUT} className="hover:text-white transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ORDERS} className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-transt-cream/60">
          <p>© {currentYear} TRANST E-Commerce. All rights reserved.</p>
          <p className="font-mono text-[11px] tracking-wider text-transt-accent/80">
            TRANST • BRAND SYSTEM
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
