from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    biografia = models.TextField(blank=True, null=True)
    foto_perfil = models.ImageField(upload_to="perfil/", blank=True, null=True)
    papel_ativo = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


class Servico(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="servicos")
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    categoria = models.CharField(max_length=50)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    prazo_estimado = models.IntegerField()
    area_atendimento = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="ativo")


class Portfolio(models.Model):
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE, related_name="portfolio")
    arquivo_midia = models.FileField(upload_to="portfolio/")
    descricao = models.TextField()


class Contrato(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="contratos")
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE, related_name="contratos")
    data_hora = models.DateTimeField(auto_now_add=True)
    local_atendimento = models.CharField(max_length=255)
    observacoes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default="pendente")
    arquivo_pdf = models.FileField(upload_to="contratos/", blank=True, null=True)


class Avaliacao(models.Model):
    contrato = models.ForeignKey(Contrato, on_delete=models.CASCADE, related_name="avaliacoes")
    nota = models.IntegerField()
    comentario = models.TextField(blank=True, null=True)
    data = models.DateTimeField(auto_now_add=True)


class Notificacao(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="notificacoes")
    tipo = models.CharField(max_length=50)
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="não lida")
