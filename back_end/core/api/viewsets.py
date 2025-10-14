from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from core.models import Usuario, Servico, PortfolioItem, Contrato, Avaliacao, Notificacao
from .serializers import (
    UsuarioSerializer,
    ServicoSerializer,
    PortfolioItemSerializer,
    ContratoSerializer,
    AvaliacaoSerializer,
    NotificacaoSerializer,
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by("id")
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all().order_by("id")
    serializer_class = ServicoSerializer
    permission_classes = [AllowAny]

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all().order_by("id")
    serializer_class = PortfolioItemSerializer
    permission_classes = [IsAuthenticated]

class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.all().order_by("id")
    serializer_class = ContratoSerializer
    permission_classes = [IsAuthenticated]
    

class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all().order_by("id")
    serializer_class = AvaliacaoSerializer
    permission_classes = [IsAuthenticated]

class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all().order_by("id")
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]
