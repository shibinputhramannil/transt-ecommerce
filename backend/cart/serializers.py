from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product

class CartProductSerializer(serializers.ModelSerializer):
    """
    Lightweight Product representation nested inside CartItem responses
    """
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'stock', 'category']


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for individual CartItem rows
    """
    product = CartProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer for the entire Cart including aggregated totals
    """
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """
    Validates input payload for adding products to cart
    """
    product_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=False, default=1)

    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError(f"Product with ID {value} does not exist.")
        return value

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be an integer greater than zero.")
        return value


class UpdateCartItemSerializer(serializers.Serializer):
    """
    Validates payload for updating quantity of an existing cart item
    """
    quantity = serializers.IntegerField(required=True)

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be an integer greater than zero.")
        return value
