from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, ServiceViewSet, PortfolioItemViewSet, AvailabilityViewSet, ContractViewSet, ReviewViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"services", ServiceViewSet)
router.register(r"portfolio", PortfolioItemViewSet)
router.register(r"availability", AvailabilityViewSet)
router.register(r"contracts", ContractViewSet)
router.register(r"reviews", ReviewViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
