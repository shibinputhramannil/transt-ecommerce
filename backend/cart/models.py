from django.db import models
from django.conf import settings
from decimal import Decimal

class Cart(models.Model):
    """
    Shopping Cart Model linked 1-to-1 with an authenticated User
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Cart of {self.user.username}"

    @property
    def total_items(self):
        """Sum of all item quantities in the cart"""
        return sum(item.quantity for item in self.items.all())

    @property
    def total_price(self):
        """Total price across all cart items"""
        total = sum(item.subtotal for item in self.items.all())
        return Decimal(str(total)).quantize(Decimal('0.01')) if total else Decimal('0.00')


class CartItem(models.Model):
    """
    Individual Product entry inside a user's Cart
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'product'],
                name='unique_cart_product'
            )
        ]

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"

    @property
    def subtotal(self):
        """Subtotal price: product.price * quantity"""
        sub = self.product.price * self.quantity
        return Decimal(str(sub)).quantize(Decimal('0.01'))
