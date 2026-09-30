import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  getProductById,
  clearSelectedProduct,
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
} from '../store/slices/productsSlice';
import { addToCartAsync } from '../store/slices/cartSlice';
import { ROUTES } from '../utils/constants';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    if (!product || product.stock <= 0) return;

    setIsAdding(true);
    try {
      await dispatch(addToCartAsync({ productId: product.id, quantity })).unwrap();
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      alert(err || 'Failed to add product to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-20">
        <LoadingState message="Loading Product Details..." />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-16 space-y-6">
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center text-sm font-medium text-transt-text-muted hover:text-transt-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to All Products
        </Link>
        <ErrorMessage
          title="Product Unavailable"
          message={error || 'Product not found.'}
          onRetry={() => dispatch(getProductById(id))}
        />
      </Container>
    );
  }

  const { name, category, price, description, image, stock } = product;
  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 15;

  return (
    <Container className="py-12 space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center text-sm font-medium text-transt-text-muted hover:text-transt-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Products Catalog
        </Link>
        <span className="text-xs text-transt-text-muted font-medium">Product ID: #{id}</span>
      </div>

      {/* Main Product Presentation Card */}
      <div className="bg-white rounded-3xl border border-transt-border p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Product Image Stage */}
        <div className="w-full h-80 sm:h-[450px] rounded-2xl bg-transt-surface-cream border border-transt-border-subtle flex items-center justify-center relative overflow-hidden group">
          {image && !imageError ? (
            <img
              src={image}
              alt={name}
              onError={() => setImageError(true)}
              className="max-h-full max-w-full object-contain p-4 transition-all duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-transt-green/60 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-transt-green-light flex items-center justify-center text-transt-green">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold text-transt-text-muted uppercase tracking-wider">
                Transt Verified Parcel
              </span>
            </div>
          )}

          {/* Category Pill Tag */}
          <div className="absolute top-4 left-4">
            <Badge variant="accent">{category}</Badge>
          </div>
        </div>

        {/* Product Details & Ordering Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header / Title / Pricing */}
            <div className="space-y-2 pb-4 border-b border-transt-border-subtle">
              <span className="text-xs font-bold text-transt-text-muted uppercase tracking-wider">
                {category} • Official Collection
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transt-green-dark tracking-tight leading-tight">
                {name}
              </h1>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-transt-green">
                  ${formattedPrice}
                </span>
                <span className="text-xs text-transt-text-muted font-medium">
                  USD
                </span>
              </div>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-transt-error-light text-transt-error border border-transt-error">
                  <XCircle className="w-4 h-4" />
                  Currently Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Limited Stock ({stock} units remaining)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-transt-success-light text-transt-success border border-transt-green-subtle">
                  <CheckCircle2 className="w-4 h-4" />
                  In Stock & Ready for Transit ({stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-bold text-transt-text uppercase tracking-wider">
                Product Description
              </h2>
              <p className="text-sm text-transt-text-secondary leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Quantity Selector UI */}
            {!isOutOfStock && (
              <div className="pt-4 space-y-2">
                <label className="text-xs font-bold text-transt-text uppercase tracking-wider block">
                  Select Quantity
                </label>
                <div className="inline-flex items-center bg-transt-surface-cream rounded-xl p-1 border border-transt-border">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1 || isAdding}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-transt-green hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-transt-text select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= stock || isAdding}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-transt-green hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-transt-border space-y-4">
            {addSuccess && (
              <div className="p-3 rounded-xl bg-transt-success-light border border-transt-green-subtle text-transt-success text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Added {quantity} unit(s) of "{name}" to your cart.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <Button
                variant={addSuccess ? 'secondary' : 'primary'}
                size="lg"
                disabled={isOutOfStock || isAdding}
                isLoading={isAdding}
                onClick={handleAddToCart}
                className="w-full sm:flex-1 justify-center shadow-md py-3.5"
              >
                {addSuccess ? (
                  <>
                    <Check className="w-5 h-5 mr-2 text-transt-green" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart ({quantity})
                  </>
                )}
              </Button>

              <Link to={ROUTES.CART} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full justify-center py-3.5">
                  View Cart
                </Button>
              </Link>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-transt-border-subtle text-xs text-transt-text-muted">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-transt-green flex-shrink-0" />
                <span>Transt Express Logistics</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-transt-green flex-shrink-0" />
                <span>Verified Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-transt-green flex-shrink-0" />
                <span>30-Day Hassle Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
