from rest_framework.routers import DefaultRouter
from .viewsets import (
    UsuarioViewSet,
    ServicoViewSet,
    PortfolioViewSet,
    ContratoViewSet,
    AvaliacaoViewSet,
    NotificacaoViewSet,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'servicos', ServicoViewSet)
router.register(r'portfolios', PortfolioViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet)
router.register(r'notificacoes', NotificacaoViewSet)

urlpatterns = router.urls
