from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from products.models import Product
from .serializers import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)

class CartView(APIView):
    """
    GET /api/cart/ - Retrieve current authenticated user's cart
    POST /api/cart/ - Add product to current user's cart
    DELETE /api/cart/ - Clear all items from current user's cart
    """
    permission_classes = [IsAuthenticated]

    def get_user_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_user_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data.get('quantity', 1)

        product = Product.objects.get(id=product_id)
        cart = self.get_user_cart(request.user)

        # Check existing item
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        current_qty = cart_item.quantity if cart_item else 0
        total_requested = current_qty + quantity

        # Validate available product stock
        if total_requested > product.stock:
            return Response(
                {"detail": f"Requested quantity exceeds available stock. Only {product.stock} available."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if cart_item:
            cart_item.quantity = total_requested
            cart_item.save()
        else:
            CartItem.objects.create(cart=cart, product=product, quantity=quantity)

        # Return updated cart representation
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        cart = self.get_user_cart(request.user)
        cart.items.all().delete()
        cart_serializer = CartSerializer(cart)
        return Response(
            {
                "message": "Cart cleared successfully.",
                "cart": cart_serializer.data
            },
            status=status.HTTP_200_OK
        )


class CartItemDetailView(APIView):
    """
    PATCH /api/cart/<item_id>/ - Update quantity of a specific cart item
    DELETE /api/cart/<item_id>/ - Remove a specific cart item from current user's cart
    """
    permission_classes = [IsAuthenticated]

    def get_cart_item(self, user, item_id):
        return CartItem.objects.filter(id=item_id, cart__user=user).first()

    def patch(self, request, item_id):
        cart_item = self.get_cart_item(request.user, item_id)
        if not cart_item:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UpdateCartItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        new_quantity = serializer.validated_data['quantity']

        # Validate stock
        if new_quantity > cart_item.product.stock:
            return Response(
                {"detail": f"Requested quantity exceeds available stock. Only {cart_item.product.stock} available."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = new_quantity
        cart_item.save()

        cart = cart_item.cart
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    def put(self, request, item_id):
        # Support PUT as alias for PATCH
        return self.patch(request, item_id)

    def delete(self, request, item_id):
        cart_item = self.get_cart_item(request.user, item_id)
        if not cart_item:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        cart = cart_item.cart
        cart_item.delete()

        cart_serializer = CartSerializer(cart)
        return Response(
            {
                "message": "Item removed from cart successfully.",
                "cart": cart_serializer.data
            },
            status=status.HTTP_200_OK
        )
