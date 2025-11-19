from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import ProfissionalHomeSerializer

from core.models import (
    Usuario,
    Cliente,
    Profissional,
    Categoria,
    Servico,
    PortfolioItem,
    Contrato,
    Avaliacao,
    Notificacao,
)
from .serializers import (
    RegisterSerializer,
    UsuarioSerializer,
    ClienteSerializer,
    ProfissionalSerializer,
    CategoriaSerializer,
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

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by("id")
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]


class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all().order_by("id")
    serializer_class = ProfissionalSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get"])
    def destaques(self, request):
        profissionais = Profissional.objects.order_by("-avaliacao_media")[:10]
        serializer = ProfissionalHomeSerializer(profissionais, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def novos(self, request):
        profissionais = Profissional.objects.order_by("-usuario__date_joined")[:10]
        serializer = ProfissionalHomeSerializer(profissionais, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def populares(self, request):
        profissionais = Profissional.objects.order_by("-avaliacao_media")[:10]
        serializer = ProfissionalHomeSerializer(profissionais, many=True)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by("id")
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all().order_by("id")
    serializer_class = ServicoSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get"])
    def buscar(self, request):
        termo = request.query_params.get("q", "")
        qs = Servico.objects.filter(nome__icontains=termo)[:20]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

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
