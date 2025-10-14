from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Servico, PortfolioItem, Contrato, Avaliacao, Notificacao


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario

    list_display = (
        "id",
        "username",
        "email",
        "telefone",
        "endereco",
        "papel_ativo",
        "pode_prestar",
        "is_staff",
    )
    search_fields = ("username", "email", "telefone")
    list_filter = ("papel_ativo", "pode_prestar", "is_staff", "is_superuser")
    ordering = ("id",)

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (
            "Informações pessoais",
            {
                "fields": (
                    "telefone",
                    "endereco",
                    "biografia",
                    "foto_perfil",
                )
            },
        ),
        (
            "Funções no sistema",
            {
                "fields": (
                    "pode_prestar",
                    "papel_ativo",
                )
            },
        ),
        (
            "Permissões",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "pode_prestar",
                    "papel_ativo",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


@admin.register(Servico)
class ServicoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "categoria", "preco", "prazo_estimado_minutos", "is_ativo", "prestador")
    list_filter = ("is_ativo", "categoria")
    search_fields = ("nome", "descricao", "categoria__nome")


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ("id", "servico", "arquivo_midia", "legenda")
    search_fields = ("legenda",)
    list_filter = ("servico",)


@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    list_display = ("id", "servico", "cliente", "prestador", "data_agendada", "hora_inicio", "hora_fim", "local_atendimento", "status")
    list_filter = ("status", "data_agendada")
    search_fields = ("local_atendimento", "observacoes")


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "contrato", "avaliador", "avaliado", "nota", "comentario", "criado_em")
    list_filter = ("nota", "criado_em")
    search_fields = ("comentario",)


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "tipo", "mensagem", "is_lida", "criado_em")
    list_filter = ("is_lida", "tipo")
    search_fields = ("mensagem",)
