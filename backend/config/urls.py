"""
URL configuration for Transt E-Commerce project.
"""
from django.contrib import admin
from django.urls import path, include
from .views import api_root, health_check

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Root & Health Check
    path('api/', api_root, name='api-root'),
    path('api/health/', health_check, name='api-health'),

    # Modular API routes (scaffolding for future phases)
    path('api/auth/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
]
