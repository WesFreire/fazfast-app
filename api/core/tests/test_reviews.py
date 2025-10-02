from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from core.models import User, Category, Service, Contract, Review

class ReviewTests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(email="cli@test.com", username="cli", password="123456")
        self.provider = User.objects.create_user(email="prov@test.com", username="prov", password="123456", is_provider=True)
        category = Category.objects.create(name="Jardinagem", slug="jardinagem")
        self.service = Service.objects.create(title="Corte de grama", description="ok", price=50, price_type="fixed", category=category, provider=self.provider, area="SP")
        self.contract = Contract.objects.create(service=self.service, client=self.client_user, provider=self.provider, status="completed")
        self.client.force_authenticate(user=self.client_user)

    def test_create_review(self):
        url = reverse("review-list")
        data = {"contract": self.contract.id, "rating": 5, "comment": "Excelente!"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        self.assertEqual(Review.objects.first().reviewer, self.client_user)
