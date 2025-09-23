from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# ---------- Custom User ----------
class User(AbstractUser):
    # email como identificador único (opcionalmente)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to="users/photos/", blank=True, null=True)
    is_provider = models.BooleanField(default=False)  # can act as prestador
    # papel ativo para UX (cliente/prestador). Não é garantido no modelo; só UI
    active_role = models.CharField(max_length=10, choices=(("client","Cliente"),("provider","Prestador")), default="client")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # username still present for compatibility

    def __str__(self):
        return f"{self.email} ({self.get_full_name()})"
    

# ---------- Categoria ----------
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)

    def __str__(self):
        return self.name


# ---------- Serviço ----------
class Service(models.Model):
    FIXED = "fixed"
    HOURLY = "hourly"
    PRICE_TYPE_CHOICES = ((FIXED, "Fixo"), (HOURLY, "Por hora"))

    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="services")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="services")
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=10, choices=PRICE_TYPE_CHOICES, default=FIXED)
    avg_duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    area = models.CharField(max_length=200, blank=True)  # cidade/bairro ou raio
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rating_average = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.title} - {self.provider.email}"


# ---------- Portfolio ----------
class PortfolioItem(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="portfolio")
    media = models.FileField(upload_to="services/portfolio/")
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"PortfolioItem {self.service.title}"


# ---------- Disponibilidade (Calendário simples) ----------
class Availability(models.Model):
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="availabilities")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ("provider", "date", "start_time", "end_time")

    def __str__(self):
        return f"{self.provider.email} {self.date} {self.start_time}-{self.end_time}"


# ---------- Contrato / Booking ----------
class Contract(models.Model):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    STATUS_CHOICES = ((PENDING, "Pendente"), (CONFIRMED, "Confirmado"), (COMPLETED, "Concluído"), (CANCELLED, "Cancelado"))

    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name="contracts")
    client = models.ForeignKey(User, on_delete=models.PROTECT, related_name="client_contracts")
    provider = models.ForeignKey(User, on_delete=models.PROTECT, related_name="provider_contracts")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    contract_pdf = models.FileField(upload_to="contracts/pdfs/", blank=True, null=True)  # generated file

    def __str__(self):
        return f"Contract {self.id} {self.service.title} ({self.client.email})"


# ---------- Avaliação ----------
class Review(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_made")
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews_received")
    rating = models.PositiveSmallIntegerField()  # 1..5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # deixar possibilidade de múltiplas, porém podemos impor 1 por contratante+contrato via validação
        pass

    def __str__(self):
        return f"Review {self.id} {self.rating} for {self.reviewee.email}"


# ---------- Notificação ----------
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=50)  # e.g., "contract_confirmed", "new_message"
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)