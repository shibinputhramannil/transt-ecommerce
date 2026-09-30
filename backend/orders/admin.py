from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'product_price', 'quantity', 'subtotal')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'user',
        'status',
        'total_amount',
        'item_count',
        'created_at',
    )
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__username', 'user__email', 'shipping_name', 'shipping_email')
    readonly_fields = ('order_number', 'user', 'total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    ordering = ('-created_at',)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'order',
        'product_name',
        'product_price',
        'quantity',
        'subtotal',
    )
    list_filter = ('order__status',)
    search_fields = ('product_name', 'order__order_number')
    readonly_fields = ('order', 'product', 'product_name', 'product_price', 'quantity', 'subtotal')
