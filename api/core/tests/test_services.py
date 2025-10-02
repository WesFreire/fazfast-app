from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from core.models import User, Service, Category

class ServiceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="provider@test.com", username="prov", password="123456", is_provider=True)
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(name="Eletricista", slug="eletricista")

    def test_create_service(self):
        url = reverse("service-list")
        data = {
            "title": "Instalação elétrica",
            "description": "Serviço de instalação",
            "price": 100,
            "price_type": "fixed",
            "category": self.category.id,
            "area": "São Paulo"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Service.objects.count(), 1)
        self.assertEqual(Service.objects.first().provider, self.user)

    def test_list_services(self):
        Service.objects.create(title="Teste", description="ok", price=50, price_type="fixed", category=self.category, provider=self.user, area="SP")
        url = reverse("service-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
