from rest_framework import serializers
from decimal import Decimal
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for Order line items displaying snapshot values.
    """
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            'product_image',
            'quantity',
            'subtotal',
        ]
        read_only_fields = fields


class OrderListSerializer(serializers.ModelSerializer):
    """
    Lightweight Order Serializer for Order History listing.
    """
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'status',
            'total_amount',
            'item_count',
            'created_at',
        ]
        read_only_fields = fields


class OrderDetailSerializer(serializers.ModelSerializer):
    """
    Comprehensive Order Serializer with nested line items and delivery info.
    """
    items = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'status',
            'shipping_name',
            'shipping_email',
            'shipping_phone',
            'shipping_address',
            'total_amount',
            'item_count',
            'items',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields


class CreateOrderRequestSerializer(serializers.Serializer):
    """
    Input serializer validating shipping destination details for order creation.
    """
    shipping_name = serializers.CharField(
        max_length=255,
        required=True,
        error_messages={'required': 'Please provide the recipient full name.'}
    )
    shipping_email = serializers.EmailField(
        required=True,
        error_messages={'required': 'Please provide a contact email for order notifications.'}
    )
    shipping_phone = serializers.CharField(
        max_length=30,
        required=True,
        error_messages={'required': 'Please provide a valid phone number.'}
    )
    shipping_address = serializers.CharField(
        required=True,
        error_messages={'required': 'Please provide the full delivery address.'}
    )
