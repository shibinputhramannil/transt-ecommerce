import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Eye, Star, ShieldCheck, Heart, Check, XCircle, RotateCw, RotateCcw, Sparkles, Truck } from 'lucide-react';
import Button from './Button';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { ROUTES } from '../../utils/constants';

/**
 * Flipkart-style Product Card Component for Transt with 3D Flip Card Shopping System
 * Features 3D interactive flip preview, object-contain image, ratings, Transt Assured badge, and quick cart action.
 */
export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!product) return null;

  const {
    id,
    name = 'Transt Product',
    category = 'General',
    price = '0.00',
    description = '',
    image,
    stock = 0,
  } = product;

  const numPrice = typeof price === 'number' ? price : parseFloat(price || 0);
  const formattedPrice = numPrice.toFixed(2);
  // Calculate simulated MSRP and discount %
  const originalPrice = (numPrice * 1.35).toFixed(2);
  const discountPercent = 25;

  // Stable pseudo-rating based on product ID
  const rating = (4.0 + ((id * 3) % 10) / 10).toFixed(1);
  const reviewsCount = 45 + ((id * 37) % 350);

  const isOutOfStock = stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    if (isOutOfStock) return;

    setIsAdding(true);
    try {
      await dispatch(addToCartAsync({ productId: id, quantity: 1 })).unwrap();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      alert(err || 'Could not add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const toggleFlip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="rounded-xl border border-transt-border bg-white p-3.5 sm:p-4 flex flex-col justify-between shadow-sm product-card-hover group h-full relative">
      <div>
        {/* 3D Flip Card Shopping Stage */}
        <div className="w-full h-44 sm:h-48 relative perspective-1000 mb-2">
          <div
            className={`w-full h-full relative flip-card-inner rounded-lg ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE: Product Image & Badges */}
            <div className="absolute inset-0 backface-hidden rounded-lg bg-white border border-transt-border-subtle flex items-center justify-center overflow-hidden p-2 group-hover:bg-transt-surface-cream/50 transition-colors">
              <Link
                to={`/products/${id}`}
                className="w-full h-full flex items-center justify-center"
              >
                {image && !imageError ? (
                  <img
                    src={image}
                    alt={name}
                    onError={() => setImageError(true)}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-transt-green/60 p-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-transt-green-light flex items-center justify-center text-transt-green">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-transt-text-muted tracking-wider uppercase">
                      {category}
                    </span>
                  </div>
                )}
              </Link>

              {/* Top-Left Flip Trigger Button */}
              <button
                type="button"
                onClick={toggleFlip}
                className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-transt-border-subtle text-[10px] font-bold text-transt-green flex items-center gap-1 shadow-xs hover:bg-transt-green hover:text-white transition-all z-10 cursor-pointer"
                title="Flip card for quick specs"
              >
                <RotateCw className="w-3 h-3" />
                <span>Quick View</span>
              </button>

              {/* Top-Right Wishlist Heart Button */}
              <button
                type="button"
                onClick={toggleWishlist}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-transt-border-subtle flex items-center justify-center text-transt-text-muted hover:text-red-500 hover:bg-white shadow-xs transition-colors z-10 cursor-pointer"
                title="Add to Wishlist"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-transt-text-muted'
                  }`}
                />
              </button>

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-transt-error-light text-transt-error border border-transt-error">
                    <XCircle className="w-3.5 h-3.5" />
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* BACK FACE: Quick Specs & 1-Click Instant Add */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg bg-transt-surface-cream border border-transt-green/30 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="flex items-center justify-between pb-1.5 border-b border-transt-border-subtle">
                <span className="text-[10px] font-extrabold text-transt-green uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quick Specs
                </span>
                <button
                  type="button"
                  onClick={toggleFlip}
                  className="p-1 rounded-full text-transt-text-muted hover:text-transt-green hover:bg-white transition-colors cursor-pointer"
                  title="Flip back"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <p className="text-[11px] text-transt-text-secondary line-clamp-3 leading-snug my-1">
                {description || 'Certified botanical product formulated for everyday essentials.'}
              </p>

              <div className="space-y-1 text-[10px] text-transt-text-muted pt-1 border-t border-transt-border-subtle">
                <div className="flex justify-between">
                  <span>Stock Status:</span>
                  <strong className={isOutOfStock ? 'text-red-600' : 'text-transt-green'}>
                    {isOutOfStock ? 'Out of Stock' : `${stock} units in stock`}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Logistics:</span>
                  <span className="text-transt-green font-semibold flex items-center gap-0.5">
                    <Truck className="w-2.5 h-2.5" /> Express Free
                  </span>
                </div>
              </div>

              <Button
                variant={justAdded ? 'secondary' : 'primary'}
                size="sm"
                disabled={isOutOfStock || isAdding}
                isLoading={isAdding}
                onClick={handleAddToCart}
                className="w-full py-1 text-[11px] font-semibold justify-center mt-1"
              >
                {justAdded ? 'Added to Cart!' : 'Quick Add to Cart'}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-1.5 mt-2.5 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-transt-text-muted uppercase tracking-wider truncate">
              {category}
            </span>
            <span className="text-[10px] font-semibold text-transt-text-muted flex-shrink-0">
              Transt Official
            </span>
          </div>

          <Link to={`/products/${id}`} className="block group-hover:text-transt-green transition-colors">
            <h3 className="text-xs sm:text-sm font-bold text-transt-green-dark line-clamp-2 leading-snug min-h-[2.4rem] sm:min-h-[2.6rem]" title={name}>
              {name}
            </h3>
          </Link>

          <p className="text-[11px] text-transt-text-muted line-clamp-1 min-h-[1.1rem]">
            {description}
          </p>

          {/* Flipkart-style Rating & Assured Badge */}
          <div className="flex items-center gap-2 pt-1 mt-auto">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-transt-green text-white text-[10px] font-extrabold leading-none">
              <span>{rating}</span>
              <Star className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-[11px] text-transt-text-muted font-medium">
              ({reviewsCount})
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-transt-green-dark ml-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-transt-green" />
              <span className="text-[10px] tracking-tight uppercase text-transt-green">Assured</span>
            </span>
          </div>
        </div>
      </div>

      {/* Flipkart-style Pricing & Quick Actions */}
      <div className="mt-auto pt-2.5 border-t border-transt-border-subtle">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm sm:text-base font-black text-transt-green-dark">
            ${formattedPrice}
          </span>
          <span className="text-[11px] text-transt-text-muted line-through">
            ${originalPrice}
          </span>
          <span className="text-[11px] font-bold text-transt-success">
            {discountPercent}% off
          </span>
        </div>

        <p className="text-[10px] font-semibold text-transt-green mt-0.5">
          Special Transt Price
        </p>

        {/* Buttons Row */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <Link to={`/products/${id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full py-1.5 text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              Details
            </Button>
          </Link>
          <Button
            variant={justAdded ? 'secondary' : 'primary'}
            size="sm"
            disabled={isOutOfStock || isAdding}
            isLoading={isAdding}
            onClick={handleAddToCart}
            className="flex-1 py-1.5 text-xs font-semibold"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-transt-green" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

