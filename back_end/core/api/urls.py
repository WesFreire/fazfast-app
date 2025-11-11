from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView
from .viewsets import (
    UsuarioViewSet,
    ServicoViewSet,
    PortfolioItemViewSet,
    ContratoViewSet,
    AvaliacaoViewSet,
    NotificacaoViewSet,
    ClienteViewSet, 
    ProfissionalViewSet
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

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]
