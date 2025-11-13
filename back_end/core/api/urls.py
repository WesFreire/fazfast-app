from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserProfileView
from .viewsets import (
    UsuarioViewSet,
    ClienteViewSet,
    ProfissionalViewSet,
    ServicoViewSet,
    PortfolioItemViewSet,
    ContratoViewSet,
    AvaliacaoViewSet,
    NotificacaoViewSet,
    CategoriaViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'profissionais', ProfissionalViewSet)
router.register(r'servicos', ServicoViewSet)
router.register(r'portfolio-items', PortfolioItemViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet)
router.register(r'notificacoes', NotificacaoViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('', include(router.urls)),
]
