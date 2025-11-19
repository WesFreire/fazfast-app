from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    foto_perfil = models.ImageField(upload_to="perfil/", blank=True, null=True)

    pode_prestar = models.BooleanField(default=False)
    papel_ativo = models.CharField(
        max_length=20,
        choices=(("cliente", "Cliente"), ("profissional", "Profissional")),
        default="cliente",
        help_text="Define qual papel o usuário está usando atualmente na interface."
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"


class Cliente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="cliente")
    data_nascimento = models.DateField(blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    preferencias = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Cliente: {self.usuario.get_full_name() or self.usuario.email}"


class Profissional(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="profissional")
    biografia = models.TextField(blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    experiencia_anos = models.PositiveSmallIntegerField(default=0)
    especialidades = models.ManyToManyField("Categoria", blank=True, related_name="profissionais")
    avaliacao_media = models.FloatField(default=0.0)
    data_criacao = models.DateTimeField(default=timezone.now)
    total_servicos = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Profissional: {self.usuario.get_full_name() or self.usuario.email}"


class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)

    def __str__(self):
        return self.nome


class Servico(models.Model):
    FIXO = "fixo"
    POR_HORA = "por_hora"
    TIPO_PRECO_CHOICES = ((FIXO, "Fixo"), (POR_HORA, "Por hora"))

    profissional = models.ForeignKey(
        Profissional,
        on_delete=models.CASCADE,
        related_name="servicos",
        help_text="Profissional que oferece o serviço."
    )

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="servicos",
        help_text="Categoria do serviço."
    )

    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_preco = models.CharField(max_length=20, choices=TIPO_PRECO_CHOICES, default=FIXO)
    prazo_estimado_minutos = models.PositiveIntegerField(blank=True, null=True)
    area_atendimento = models.CharField(max_length=200, blank=True)
    is_ativo = models.BooleanField(default=True)
    media_avaliacoes = models.FloatField(default=0.0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} - {self.profissional.usuario.email}"


class PortfolioItem(models.Model):
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE, related_name="portfolio")
    arquivo_midia = models.FileField(upload_to="servicos/portfolio/")
    legenda = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Portfolio: {self.servico.nome}"


class Disponibilidade(models.Model):
    profissional = models.ForeignKey(Profissional, on_delete=models.CASCADE, related_name="disponibilidades")
    data = models.DateField(null=True)
    inicio = models.TimeField(null=True)
    fim = models.TimeField(null=True)
    is_reservado = models.BooleanField(default=False)

    class Meta:
        unique_together = ("profissional", "data", "inicio", "fim")
        ordering = ("data", "inicio")

    def __str__(self):
        return f"{self.profissional.usuario.email} — {self.data} {self.inicio}-{self.fim}"


class Contrato(models.Model):
    PENDENTE = "pendente"
    CONFIRMADO = "confirmado"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"
    STATUS_CHOICES = (
        (PENDENTE, "Pendente"),
        (CONFIRMADO, "Confirmado"),
        (CONCLUIDO, "Concluído"),
        (CANCELADO, "Cancelado"),
    )

    servico = models.ForeignKey(Servico, on_delete=models.PROTECT, related_name="contratos")
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="contratos")
    profissional = models.ForeignKey(Profissional, on_delete=models.PROTECT, related_name="contratos")

    data_agendada = models.DateField(null=True)
    hora_inicio = models.TimeField(null=True)
    hora_fim = models.TimeField(blank=True, null=True)
    local_atendimento = models.CharField(max_length=255)
    observacoes = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDENTE)
    criado_em = models.DateTimeField(auto_now_add=True)
    arquivo_pdf = models.FileField(upload_to="contratos/pdfs/", blank=True, null=True)

    def __str__(self):
        return f"Contrato #{self.id} — {self.servico.nome}"


class Avaliacao(models.Model):
    contrato = models.ForeignKey(Contrato, on_delete=models.CASCADE, related_name="avaliacoes")
    avaliador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="avaliacoes_feitas", null=True)
    avaliado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="avaliacoes_recebidas", null=True)
    nota = models.PositiveSmallIntegerField()
    comentario = models.TextField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avaliação {self.nota} — contrato {self.contrato.id}"


class Notificacao(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="notificacoes")
    tipo = models.CharField(max_length=50)
    mensagem = models.TextField()
    is_lida = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-criado_em",)

    def __str__(self):
        return f"Notificação para {self.usuario.email} — {self.tipo}"
    
    
class ClienteProxy(Usuario):
    class Meta:
        proxy = True
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"


class ProfissionalProxy(Usuario):
    class Meta:
        proxy = True
        verbose_name = "Profissional"
        verbose_name_plural = "Profissionais"
