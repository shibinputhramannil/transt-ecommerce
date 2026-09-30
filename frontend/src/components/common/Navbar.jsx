import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Package, User, LogIn, LogOut, Menu, X, Layers, Search } from 'lucide-react';
import BrandLogo from '../brand/BrandLogo';
import Container from './Container';
import Button from './Button';
import { logout } from '../../store/slices/authSlice';
import { resetCartState } from '../../store/slices/cartSlice';
import { ROUTES } from '@/utils/constants';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCartState());
    setIsMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
      isActive
        ? 'bg-transt-green-light text-transt-green font-bold shadow-sm'
        : 'text-transt-text-secondary hover:text-transt-green hover:bg-transt-accent-light'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2.5 rounded-lg text-base font-medium ${
      isActive
        ? 'bg-transt-green-light text-transt-green font-bold'
        : 'text-transt-text hover:bg-transt-accent-light hover:text-transt-green'
    }`;

  const displayCartCount = isAuthenticated ? totalItems : 0;

  return (
    <header className="sticky top-0 z-50 bg-transt-surface-cream/95 backdrop-blur-md border-b border-transt-border">
      <Container>
        <div className="flex items-center justify-between h-18 sm:h-20 py-2">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center gap-6 xl:gap-8">
            <BrandLogo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <NavLink to={ROUTES.HOME} className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink to={ROUTES.PRODUCTS} className={navLinkClass}>
                <Layers className="w-4 h-4" />
                Products
              </NavLink>
              <NavLink to={ROUTES.ORDERS} className={navLinkClass}>
                <Package className="w-4 h-4" />
                Orders
              </NavLink>
            </nav>
          </div>

          {/* Desktop Center: Modern Quick Search Bar */}
          <form onSubmit={handleNavSearchSubmit} className="hidden lg:flex items-center relative w-56 xl:w-72">
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-8 pr-7 py-2 rounded-full border border-transt-border bg-white text-xs text-transt-text placeholder:text-transt-text-muted/60 focus:outline-none focus:border-transt-green focus:ring-2 focus:ring-transt-green/20 shadow-xs transition-all"
            />
            <Search className="w-3.5 h-3.5 text-transt-text-muted absolute left-3 pointer-events-none" />
            {navSearch && (
              <button
                type="button"
                onClick={() => setNavSearch('')}
                className="absolute right-2.5 p-0.5 text-transt-text-muted hover:text-transt-text cursor-pointer"
                title="Clear"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Desktop Right Actions (Cart & Dynamic Auth) */}
          <div className="hidden md:flex items-center gap-3.5">
            <NavLink
              to={ROUTES.CART}
              className={({ isActive }) =>
                `p-2.5 rounded-xl relative flex items-center justify-center text-transt-green hover:bg-transt-green-light transition-colors ${
                  isActive ? 'bg-transt-green-light' : ''
                }`
              }
              title={`Shopping Cart (${displayCartCount} items)`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2.5 bg-transt-green text-white text-[11px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white shadow-sm leading-none select-none">
                  {displayCartCount}
                </span>
              </div>
            </NavLink>

            <div className="h-5 w-px bg-transt-border mx-1"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Authenticated User Chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-transt-green-light border border-transt-green-subtle">
                  <div className="w-6 h-6 rounded-full bg-transt-green text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-bold text-transt-green-dark max-w-[120px] truncate">
                    {user?.name || user?.email || 'Account'}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Sign In
                  </Button>
                </Link>

                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    <User className="w-4 h-4 mr-1.5" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-2">
            <NavLink
              to={ROUTES.CART}
              className="p-2.5 text-transt-green hover:bg-transt-green-light rounded-xl relative flex items-center justify-center"
              title={`Shopping Cart (${displayCartCount} items)`}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2.5 bg-transt-green text-white text-[11px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white shadow-sm leading-none select-none">
                  {displayCartCount}
                </span>
              </div>
            </NavLink>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-transt-green hover:bg-transt-green-light focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-transt-border bg-transt-surface-cream px-4 pt-4 pb-6 space-y-3 shadow-lg animate-fade-in">
          {/* Mobile Search Bar */}
          <form onSubmit={handleNavSearchSubmit} className="relative">
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-transt-border bg-white text-sm text-transt-text placeholder:text-transt-text-muted/60 focus:outline-none focus:border-transt-green focus:ring-2 focus:ring-transt-green/20 shadow-xs"
            />
            <Search className="w-4 h-4 text-transt-text-muted absolute left-3 top-3.5 pointer-events-none" />
            {navSearch && (
              <button
                type="button"
                onClick={() => setNavSearch('')}
                className="absolute right-2.5 top-3 p-0.5 text-transt-text-muted hover:text-transt-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <div className="space-y-1">
            <NavLink
              to={ROUTES.HOME}
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.PRODUCTS}
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </NavLink>
            <NavLink
              to={ROUTES.ORDERS}
              className={mobileNavLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Orders
            </NavLink>
          </div>

          <div className="pt-4 border-t border-transt-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 px-2 py-1">
                  <div className="w-7 h-7 rounded-full bg-transt-green text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-transt-green-dark block">
                      {user?.name || 'Customer'}
                    </span>
                    <span className="text-xs text-transt-text-muted block">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLogout}
                  className="w-full justify-center text-transt-error border-transt-error/40 hover:bg-transt-error-light"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
