from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Product(models.Model):
    """
    Transt E-Commerce Product Model
    Represents a sellable catalog item.
    """
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Fashion', 'Fashion'),
        ('Shoes', 'Shoes'),
        ('Bags', 'Bags'),
        ('Watches', 'Watches'),
        ('Home & Lifestyle', 'Home & Lifestyle'),
        ('Beauty', 'Beauty'),
    ]

    name = models.CharField(
        max_length=255,
        help_text="Name of the product"
    )
    description = models.TextField(
        help_text="Detailed product description"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Price in USD"
    )
    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES,
        default='Home & Lifestyle',
        help_text="Product category"
    )
    image = models.URLField(
        max_length=500,
        help_text="Product image URL (free stock asset)"
    )
    stock = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Available inventory units"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the product was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the product was last updated"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.name} (${self.price})"
