from decimal import Decimal
from django.db import transaction
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from cart.models import Cart
from .models import Order, OrderItem
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    CreateOrderRequestSerializer,
)


class OrderListCreateView(APIView):
    """
    API view for:
    - GET /api/orders/  -> List authenticated user's order history
    - POST /api/orders/ -> Create a new order from authenticated user's cart
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all orders placed by the authenticated user in reverse chronological order.
        Strictly isolates user data.
        """
        orders = Order.objects.filter(user=request.user).prefetch_related('items').order_by('-created_at')
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new Order atomically from the user's shopping cart.
        Validates cart status, product availability, stock, and captures price snapshots.
        """
        # 1. Validate shipping input
        serializer = CreateOrderRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Validation error", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        shipping_data = serializer.validated_data

        # 2. Fetch authenticated user's cart
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or cart.items.count() == 0:
            return Response(
                {"error": "Cannot create an order because the cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Perform atomic order transaction
        try:
            with transaction.atomic():
                cart_items = list(cart.items.select_related('product').all())

                if not cart_items:
                    return Response(
                        {"error": "Cannot create an order because the cart is empty."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # 3a. Validate stock for all items before any modifications
                for item in cart_items:
                    product = item.product
                    if product.stock < item.quantity:
                        return Response(
                            {
                                "error": f"Insufficient stock for '{product.name}'. Available: {product.stock}, requested: {item.quantity}."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                # 3b. Calculate total amount computed strictly on the backend
                total_amount = Decimal('0.00')
                for item in cart_items:
                    item_subtotal = Decimal(str(item.product.price * item.quantity)).quantize(Decimal('0.01'))
                    total_amount += item_subtotal

                # 3c. Create the Order header
                order = Order.objects.create(
                    user=request.user,
                    total_amount=total_amount,
                    status=Order.STATUS_PENDING,
                    shipping_name=shipping_data['shipping_name'].strip(),
                    shipping_email=shipping_data['shipping_email'].strip(),
                    shipping_phone=shipping_data['shipping_phone'].strip(),
                    shipping_address=shipping_data['shipping_address'].strip(),
                )

                # 3d. Create OrderItems with price snapshots and decrement inventory stock
                for item in cart_items:
                    product = item.product
                    item_subtotal = Decimal(str(product.price * item.quantity)).quantize(Decimal('0.01'))

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_name=product.name,
                        product_price=product.price,
                        product_image=product.image or '',
                        quantity=item.quantity,
                        subtotal=item_subtotal,
                    )

                    # Deduct purchasable product stock
                    product.stock -= item.quantity
                    product.save(update_fields=['stock', 'updated_at'])

                # 3e. Clear the user's cart
                cart.items.all().delete()

            # 4. Return the fully serialized created order
            order_detail = OrderDetailSerializer(order)
            return Response(order_detail.data, status=status.HTTP_201_CREATED)

        except Exception as exc:
            return Response(
                {"error": f"An error occurred while creating the order: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderDetailView(APIView):
    """
    API view for:
    - GET /api/orders/<id>/ -> Retrieve full details for a specific order.
    Enforces user data isolation: User A cannot inspect User B's order.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Fetch order by primary key ID or order_number matching the authenticated user.
        """
        # Look up by ID or order_number for user friendliness
        order_query = Order.objects.filter(user=request.user).prefetch_related('items')
        
        if str(pk).isdigit():
            order = order_query.filter(Q(id=pk) | Q(order_number=str(pk))).first()
        else:
            order = order_query.filter(order_number=str(pk)).first()

        if not order:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
