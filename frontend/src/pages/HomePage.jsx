import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, 
  ShoppingBag, 
  ArrowRight, 
  Server, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  Headphones,
  Shirt,
  Watch,
  Footprints,
  Briefcase,
  Home as HomeIcon,
  Smile
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import ProductGrid from '../components/common/ProductGrid';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import { healthService } from '../services/api';
import { getProducts, selectProducts, selectProductsLoading } from '../store/slices/productsSlice';
import { ROUTES } from '../utils/constants';

const CATEGORY_ITEMS = [
  { name: 'Electronics', icon: Headphones, count: 'Smart Tech & Audio' },
  { name: 'Fashion', icon: Shirt, count: 'Apparel & Wear' },
  { name: 'Shoes', icon: Footprints, count: 'Footwear & Runners' },
  { name: 'Bags', icon: Briefcase, count: 'Packs & Travel' },
  { name: 'Watches', icon: Watch, count: 'Precision Timepieces' },
  { name: 'Home & Lifestyle', icon: HomeIcon, count: 'Living & Wellness' },
  { name: 'Beauty', icon: Smile, count: 'Personal Care' },
];

export const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);

  const [apiStatus, setApiStatus] = useState({
    loading: true,
    healthy: false,
    data: null,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    // Check backend health
    healthService
      .getApiRoot()
      .then((data) => {
        if (isMounted) {
          setApiStatus({
            loading: false,
            healthy: true,
            data: data,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiStatus({
            loading: false,
            healthy: false,
            data: null,
            error: err.message || 'Failed to connect to backend',
          });
        }
      });

    // Dispatch Redux action for products if not already loaded
    dispatch(getProducts());

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="py-8 md:py-14 space-y-16">
      {/* 1. Hero Section */}
      <Container>
        <div className="relative rounded-3xl bg-transt-bg-warm border border-transt-border p-8 md:p-16 overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-transt-surface-cream text-transt-green text-xs font-bold tracking-wider uppercase border border-transt-border shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-transt-accent-dark" />
              <span>Official Transt Collection</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transt-green-dark tracking-tight leading-tight">
                Move Forward with <span className="text-transt-green">Transt</span>
              </h1>
              <p className="text-transt-text-secondary text-base sm:text-lg leading-relaxed font-normal">
                Discover thoughtfully curated lifestyle essentials, everyday logistics gear, and certified goods built for seamless daily transit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" className="shadow-md py-3.5 px-6">
                  Explore Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link to={ROUTES.ORDERS}>
                  <Button variant="secondary" size="lg" className="py-3.5 px-6">
                    View Your Orders
                  </Button>
                </Link>
              ) : (
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" size="lg" className="py-3.5 px-6">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Decorative Warm Accent Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-transt-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-8 -mb-12 w-64 h-64 bg-transt-green/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Value Propositions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-white border border-transt-border flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-transt-green-light text-transt-green flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-transt-green-dark block">Complimentary Shipping</span>
              <span className="text-[11px] text-transt-text-muted">On all standard orders</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-transt-border flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-transt-green-light text-transt-green flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-transt-green-dark block">Quality Certified</span>
              <span className="text-[11px] text-transt-text-muted">Authentic goods only</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-transt-border flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-transt-green-light text-transt-green flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-transt-green-dark block">Price Snapshot Lock</span>
              <span className="text-[11px] text-transt-text-muted">Guaranteed purchase rate</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-transt-border flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-transt-green-light text-transt-green flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-transt-green-dark block">30-Day Easy Returns</span>
              <span className="text-[11px] text-transt-text-muted">Hassle-free guarantee</span>
            </div>
          </div>
        </div>
      </Container>

      {/* 2. Explore by Category Section */}
      <Container>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <Badge variant="accent">Categories</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-transt-green-dark mt-1 tracking-tight">
                Shop by Collection
              </h2>
            </div>
            <Link to={ROUTES.PRODUCTS} className="text-xs font-bold text-transt-green hover:underline">
              Browse All Categories →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORY_ITEMS.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="p-4 rounded-2xl bg-white border border-transt-border hover:border-transt-green hover:shadow-md transition-all text-center group flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-11 h-11 rounded-xl bg-transt-surface-cream text-transt-green flex items-center justify-center group-hover:bg-transt-green group-hover:text-white transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-transt-green-dark block group-hover:text-transt-green transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-transt-text-muted line-clamp-1">
                      {cat.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>

      {/* 3. Featured Products Grid */}
      <Container>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Curated Catalog</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-transt-green-dark mt-2 tracking-tight">
                Featured Products
              </h2>
              <p className="text-sm text-transt-text-muted mt-1">
                Explore handpicked goods ready for immediate dispatch and order placement.
              </p>
            </div>

            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline" size="sm">
                View All Products
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <LoadingState message="Loading Featured Products..." />
          ) : featuredProducts.length > 0 ? (
            <ProductGrid>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : null}
        </div>
      </Container>

      {/* 4. Brand Principles & Architectural Highlights */}
      <Container>
        <div className="rounded-3xl bg-white border border-transt-border p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge variant="accent">The Transt Advantage</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-transt-green-dark tracking-tight">
              Engineered for Seamless Commerce
            </h2>
            <p className="text-xs sm:text-sm text-transt-text-muted">
              Built on clean architecture with full-stack synchronization between React, Redux, Django REST Framework, and PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-transt-green text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-transt-green-dark">Real-Time Catalog</h3>
              <p className="text-xs text-transt-text-muted leading-relaxed">
                Dynamic category filtering, instant search debouncing, and live inventory stock monitoring.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-transt-green text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-transt-green-dark">Synchronized Cart</h3>
              <p className="text-xs text-transt-text-muted leading-relaxed">
                User-isolated shopping cart with subtotal computations and live item counters.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-transt-green text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-transt-green-dark">Atomic Orders</h3>
              <p className="text-xs text-transt-text-muted leading-relaxed">
                Database transactions guaranteeing inventory deduction, cart clearing, and price snapshots.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-transt-surface-cream border border-transt-border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-transt-green text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-transt-green-dark">JWT Security</h3>
              <p className="text-xs text-transt-text-muted leading-relaxed">
                Stateless token authentication with strict user data isolation on every API request.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
