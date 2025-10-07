from rest_framework import viewsets
from core.models import Usuario, Servico, Portfolio, Contrato, Avaliacao, Notificacao
from .serializers import (
    UsuarioSerializer,
    ServicoSerializer,
    PortfolioSerializer,
    ContratoSerializer,
    AvaliacaoSerializer,
    NotificacaoSerializer,
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer

class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer

class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = NotificacaoSerializer
