from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import User, Category, Service, PortfolioItem, Availability, Contract, Review, Notification
from .serializers import UserSerializer, CategorySerializer, ServiceSerializer, PortfolioItemSerializer, AvailabilitySerializer, ContractSerializer, ReviewSerializer
from .permissions import IsOwnerOrReadOnly

# Auth endpoints (JWT) ficam em urls principais fornecidos por simplejwt

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # criar/ler. proteger endpoints sensíveis em produção

    def get_permissions(self):
        if self.action in ["create"]:
            return [AllowAny()]
        return [IsAuthenticated()]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related("provider", "category")
    serializer_class = ServiceSerializer
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["category__slug", "price", "price_type", "area"]
    search_fields = ["title", "description", "provider__first_name", "provider__last_name"]
    ordering_fields = ["price","rating_average","created_at"]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsOwnerOrReadOnly]


class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # providers manage own availability; clients can view providers' availability
        user = self.request.user
        if user.is_provider:
            return Availability.objects.filter(provider=user)
        return Availability.objects.filter(is_booked=False)


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().select_related("service","client","provider")
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "provider", "client", "date"]

    def get_queryset(self):
        user = self.request.user
        # clientes veem contratos que são seus; providers veem também os seus
        return Contract.objects.filter(models.Q(client=user) | models.Q(provider=user))

    def perform_create(self, serializer):
        serializer.save()
        # aqui: disparar notificação para provider (usar signals/celery)
        # ex: create Notification
        # Notification.objects.create(user=serializer.instance.provider, type="new_contract", message="Novo contrato...")

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        contract = self.get_object()
        if contract.provider != request.user:
            return Response({"detail":"Somente o prestador pode confirmar."}, status=status.HTTP_403_FORBIDDEN)
        contract.status = Contract.CONFIRMED
        contract.save()
        # gerar PDF do contrato (pode ser assincronamente)
        return Response({"status":"confirmado"})


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        contract = serializer.validated_data["contract"]
        reviewer = self.request.user
        # inferir reviewee:
        if contract.client == reviewer:
            reviewee = contract.provider
        elif contract.provider == reviewer:
            reviewee = contract.client
        else:
            raise serializers.ValidationError("Usuário não participa deste contrato.")
        serializer.save(reviewer=reviewer, reviewee=reviewee)
        # atualizar média do serviço
        # recalcular rating_average
