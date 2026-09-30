import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone


def generate_order_number():
    """
    Generates a readable, unique order number format: TRN-XXXXX
    Example: TRN-10001, TRN-84920
    """
    # Use timestamp + short uuid hex for uniqueness and readability
    unique_suffix = uuid.uuid4().hex[:6].upper()
    return f"TRN-{unique_suffix}"


class Order(models.Model):
    """
    Order Model representing a purchase made by an authenticated user.
    """
    STATUS_PENDING = 'PENDING'
    STATUS_CONFIRMED = 'CONFIRMED'
    STATUS_PROCESSING = 'PROCESSING'
    STATUS_SHIPPED = 'SHIPPED'
    STATUS_DELIVERED = 'DELIVERED'
    STATUS_CANCELLED = 'CANCELLED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_SHIPPED, 'Shipped'),
        (STATUS_DELIVERED, 'Delivered'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        help_text="The authenticated user who placed the order"
    )
    order_number = models.CharField(
        max_length=32,
        unique=True,
        db_index=True,
        default=generate_order_number,
        help_text="Human-readable unique order identifier (e.g. TRN-10001)"
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Calculated total order price computed strictly on backend"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True,
        help_text="Current fulfillment status of the order"
    )
    shipping_name = models.CharField(
        max_length=255,
        help_text="Recipient full name for delivery"
    )
    shipping_email = models.EmailField(
        help_text="Contact email for order updates"
    )
    shipping_phone = models.CharField(
        max_length=30,
        help_text="Contact telephone number"
    )
    shipping_address = models.TextField(
        help_text="Complete physical street address and destination details"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the order was placed"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the order was last modified"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"Order {self.order_number} ({self.status}) - ${self.total_amount}"

    @property
    def item_count(self):
        """Sum of all item quantities across order items"""
        return sum(item.quantity for item in self.items.all())


class OrderItem(models.Model):
    """
    OrderItem Model containing immutable price and name snapshots
    for products purchased in an Order.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        help_text="Parent order containing this line item"
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items',
        help_text="Linked catalog product (nullable if product is later deleted)"
    )
    product_name = models.CharField(
        max_length=255,
        help_text="Immutable snapshot of product name at order creation time"
    )
    product_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Immutable snapshot of unit price at order creation time"
    )
    product_image = models.URLField(
        max_length=500,
        blank=True,
        default='',
        help_text="Snapshot of product catalog image URL for UI presentation"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Number of units ordered"
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Snapshot of total price for this line item (price * quantity)"
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.quantity} x {self.product_name} (${self.product_price}) in {self.order.order_number}"
