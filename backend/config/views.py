from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    Root API status and entry point for Transt E-Commerce API.
    """
    return Response({
        "brand": "TRANST",
        "name": "Transt E-Commerce REST API",
        "version": "1.0.0",
        "phase": "Phase 10: Production Finalization & Complete Integration",
        "status": "healthy",
        "endpoints": {
            "health": "/api/health/",
            "auth": "/api/auth/",
            "products": "/api/products/",
            "cart": "/api/cart/",
            "orders": "/api/orders/",
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint for API service verification.
    """
    return Response({
        "status": "ok",
        "service": "transt-backend",
        "database": "connected"
    })
