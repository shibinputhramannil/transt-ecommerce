from django.urls import path
from .views import OrderListCreateView, OrderDetailView

app_name = 'orders'

urlpatterns = [
    # GET /api/orders/  -> List user's order history
    # POST /api/orders/ -> Create order from user's cart
    path('', OrderListCreateView.as_view(), name='order-list-create'),

    # GET /api/orders/<id>/ -> Retrieve single order details
    path('<str:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
