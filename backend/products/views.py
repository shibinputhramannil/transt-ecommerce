from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer

class ProductListAPIView(APIView):
    """
    API View to retrieve the catalog of products.
    Supports optional category filtering via ?category=<category_name>
    and multi-field search filtering via ?search=<query> (name, description, category)
    """
    def get(self, request):
        try:
            products = Product.objects.all()

            # Optional category filter
            category = request.query_params.get('category', None)
            if category and category.strip().lower() != 'all':
                products = products.filter(category__iexact=category.strip())

            # Optional search query filter across name, description, and category
            search = request.query_params.get('search', None)
            if search and search.strip():
                query = search.strip()
                products = products.filter(
                    Q(name__icontains=query) |
                    Q(description__icontains=query) |
                    Q(category__icontains=query)
                )

            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "Failed to retrieve products.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductDetailAPIView(APIView):
    """
    API View to retrieve details of a specific product by ID.
    Returns 404 if product does not exist.
    """
    def get(self, request, pk):
        try:
            product = Product.objects.filter(pk=pk).first()
            if not product:
                return Response(
                    {"detail": f"Product with ID {pk} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "An error occurred while fetching the product.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
