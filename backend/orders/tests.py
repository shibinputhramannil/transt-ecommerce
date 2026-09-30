from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from products.models import Product
from cart.models import Cart, CartItem
from .models import Order, OrderItem

User = get_user_model()


class OrderAPITests(APITestCase):
    """
    Test suite for Phase 5 Orders & Order History module
    """
    def setUp(self):
        # Create User A
        self.user_a = User.objects.create_user(
            username='user_a',
            email='user_a@example.com',
            password='Password123!',
            first_name='Alice',
            last_name='Walker'
        )
        token_a = RefreshToken.for_user(self.user_a).access_token
        self.auth_headers_a = {'HTTP_AUTHORIZATION': f'Bearer {token_a}'}

        # Create User B
        self.user_b = User.objects.create_user(
            username='user_b',
            email='user_b@example.com',
            password='Password123!',
            first_name='Bob',
            last_name='Smith'
        )
        token_b = RefreshToken.for_user(self.user_b).access_token
        self.auth_headers_b = {'HTTP_AUTHORIZATION': f'Bearer {token_b}'}

        # Create Products
        self.product_watch = Product.objects.create(
            name='Transt Chrono Watch',
            description='Luxury watch',
            price=Decimal('2499.00'),
            category='Watches',
            stock=10,
            image='https://images.unsplash.com/photo-1523275335684-37898b6baf30'
        )
        self.product_earbuds = Product.objects.create(
            name='Acoustic Earbuds',
            description='Wireless audio',
            price=Decimal('1799.00'),
            category='Electronics',
            stock=5,
            image='https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb'
        )

        # Create Cart for User A
        self.cart_a = Cart.objects.create(user=self.user_a)

        self.valid_shipping_data = {
            "shipping_name": "Alice Walker",
            "shipping_email": "alice@example.com",
            "shipping_phone": "9876543210",
            "shipping_address": "456 Transt Way, Suite 10, San Francisco, CA"
        }

    def test_create_order_success(self):
        """
        Test successful order creation:
        - Order and OrderItems created
        - Price snapshots saved
        - Stock decremented
        - Cart emptied
        """
        # Add items to Cart A
        CartItem.objects.create(cart=self.cart_a, product=self.product_watch, quantity=2)
        CartItem.objects.create(cart=self.cart_a, product=self.product_earbuds, quantity=1)

        url = reverse('orders:order-list-create')
        response = self.client.post(url, self.valid_shipping_data, **self.auth_headers_a)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('order_number', response.data)
        self.assertEqual(Decimal(str(response.data['total_amount'])), Decimal('6797.00')) # (2499 * 2) + 1799
        self.assertEqual(len(response.data['items']), 2)

        # Verify Cart is cleared
        self.assertEqual(self.cart_a.items.count(), 0)

        # Verify Stock decremented
        self.product_watch.refresh_from_db()
        self.product_earbuds.refresh_from_db()
        self.assertEqual(self.product_watch.stock, 8) # 10 - 2
        self.assertEqual(self.product_earbuds.stock, 4) # 5 - 1

    def test_price_snapshot_immutability(self):
        """
        Verify that changing a product's price later does NOT alter existing order prices.
        """
        CartItem.objects.create(cart=self.cart_a, product=self.product_watch, quantity=1)
        url = reverse('orders:order-list-create')
        res = self.client.post(url, self.valid_shipping_data, **self.auth_headers_a)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        order_id = res.data['id']

        # Change original product price
        self.product_watch.price = Decimal('3999.00')
        self.product_watch.save()

        # Fetch Order details
        detail_url = reverse('orders:order-detail', kwargs={'pk': order_id})
        detail_res = self.client.get(detail_url, **self.auth_headers_a)

        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        # Snapshot price must remain 2499.00
        self.assertEqual(Decimal(str(detail_res.data['items'][0]['product_price'])), Decimal('2499.00'))
        self.assertEqual(Decimal(str(detail_res.data['total_amount'])), Decimal('2499.00'))

    def test_create_order_empty_cart_fails(self):
        """
        Reject order creation if user's cart is empty.
        """
        url = reverse('orders:order-list-create')
        response = self.client.post(url, self.valid_shipping_data, **self.auth_headers_a)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("empty", response.data['error'].lower())

    def test_create_order_insufficient_stock_fails(self):
        """
        Reject order creation if requested quantity exceeds inventory stock.
        """
        # Request 15 watches when stock is 10
        CartItem.objects.create(cart=self.cart_a, product=self.product_watch, quantity=15)

        url = reverse('orders:order-list-create')
        response = self.client.post(url, self.valid_shipping_data, **self.auth_headers_a)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("insufficient stock", response.data['error'].lower())

        # Verify no order created and cart items retained
        self.assertEqual(Order.objects.count(), 0)
        self.assertEqual(self.cart_a.items.count(), 1)
        self.product_watch.refresh_from_db()
        self.assertEqual(self.product_watch.stock, 10)

    def test_user_data_isolation(self):
        """
        Verify that User B cannot view User A's order history or order detail.
        """
        CartItem.objects.create(cart=self.cart_a, product=self.product_watch, quantity=1)
        res = self.client.post(reverse('orders:order-list-create'), self.valid_shipping_data, **self.auth_headers_a)
        order_id = res.data['id']

        # User B requests order history: should be empty
        orders_b_res = self.client.get(reverse('orders:order-list-create'), **self.auth_headers_b)
        self.assertEqual(orders_b_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(orders_b_res.data), 0)

        # User B attempts to access User A's order by ID
        detail_b_res = self.client.get(reverse('orders:order-detail', kwargs={'pk': order_id}), **self.auth_headers_b)
        self.assertEqual(detail_b_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_request_rejected(self):
        """
        Verify that unauthenticated requests to orders endpoints are rejected with 401.
        """
        list_res = self.client.get(reverse('orders:order-list-create'))
        self.assertEqual(list_res.status_code, status.HTTP_401_UNAUTHORIZED)

        post_res = self.client.post(reverse('orders:order-list-create'), self.valid_shipping_data)
        self.assertEqual(post_res.status_code, status.HTTP_401_UNAUTHORIZED)
