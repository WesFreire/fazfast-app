from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Usuario, Cliente, Profissional, Categoria, Servico,
    PortfolioItem, Disponibilidade, Contrato, Avaliacao, Notificacao
)

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = (
        "email",
        "username",
        "telefone",
        "endereco",
        "genero",
        "papel_ativo",
        "pode_prestar",
        "is_staff"
    )
    list_filter = ("papel_ativo", "pode_prestar", "genero", "is_staff", "is_superuser")
    search_fields = ("email", "username", "telefone")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Informações pessoais", {
            "fields": (
                "username",
                "telefone",
                "endereco",
                "genero", 
                "foto_perfil"
            )
        }),
        ("Permissões", {
            "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
        ("Papel no sistema", {
            "fields": ("papel_ativo", "pode_prestar")
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2"),
        }),
    )

    filter_horizontal = ("groups", "user_permissions")


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "cpf", "data_nascimento")
    search_fields = ("usuario__email", "usuario__username", "cpf")


@admin.register(Profissional)
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "cnpj", "experiencia_anos", "avaliacao_media")
    search_fields = ("usuario__email", "usuario__username", "cnpj")


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("nome",)}
    list_display = ("id", "nome", "slug")
    search_fields = ("nome",)


@admin.register(Servico)
class ServicoAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "profissional", "categoria", "preco", "tipo_preco", "is_ativo")
    list_filter = ("tipo_preco", "is_ativo", "categoria")
    search_fields = ("nome", "profissional__usuario__email")


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ("id", "servico", "legenda")


@admin.register(Disponibilidade)
class DisponibilidadeAdmin(admin.ModelAdmin):
    list_display = ("profissional", "data", "inicio", "fim", "is_reservado")
    list_filter = ("is_reservado", "data")
    ordering = ("-data",)


@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    list_display = ("id", "servico", "cliente", "profissional", "status", "data_agendada")
    list_filter = ("status",)
    search_fields = ("servico__nome", "cliente__usuario__email", "profissional__usuario__email")


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "contrato", "nota", "avaliador", "avaliado", "criado_em")
    list_filter = ("nota",)
    search_fields = ("avaliador__email", "avaliado__email")


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "tipo", "is_lida", "criado_em")
    list_filter = ("is_lida", "tipo")
    search_fields = ("usuario__email", "mensagem")
