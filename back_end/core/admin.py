from django.contrib import admin
from .models import Usuario, Servico, Portfolio, Contrato, Avaliacao, Notificacao
from django.contrib.auth.admin import UserAdmin


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ("id", "username", "email", "telefone", "endereco", "papel_ativo", "is_staff")
    search_fields = ("username", "email", "telefone")
    list_filter = ("papel_ativo", "is_staff", "is_superuser")
    ordering = ("id",)

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Informações pessoais", {"fields": ("telefone", "endereco", "biografia", "foto_perfil", "papel_ativo")}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "is_staff", "is_superuser", "papel_ativo")}
        ),
    )


@admin.register(Servico)
class ServicoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "categoria", "preco", "prazo_estimado", "status", "usuario")
    list_filter = ("status", "categoria")
    search_fields = ("nome", "descricao", "categoria")


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("id", "servico", "descricao", "arquivo_midia")
    search_fields = ("descricao",)
    list_filter = ("servico",)


@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "servico", "data_hora", "local_atendimento", "status")
    list_filter = ("status", "data_hora")
    search_fields = ("local_atendimento", "observacoes")


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "contrato", "nota", "comentario", "data")
    list_filter = ("nota", "data")
    search_fields = ("comentario",)


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "tipo", "mensagem", "data_envio", "status")
    list_filter = ("status", "tipo")
    search_fields = ("mensagem",)
