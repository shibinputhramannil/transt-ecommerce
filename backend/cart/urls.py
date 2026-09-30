from django.urls import path
from .views import CartView, CartItemDetailView

urlpatterns = [
    # Cart endpoints: GET (view), POST (add), DELETE (clear)
    path('', CartView.as_view(), name='cart-root'),
    path('items/', CartView.as_view(), name='cart-items-alias'),

    # Cart Item endpoints: PATCH/PUT (update quantity), DELETE (remove item)
    path('<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail-alias'),
]
