from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from core.models import User, Service, Category, Contract

class ContractTests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(email="cli@test.com", username="cli", password="123456")
        self.provider = User.objects.create_user(email="prov@test.com", username="prov", password="123456", is_provider=True)
        self.category = Category.objects.create(name="Encanador", slug="encanador")
        self.service = Service.objects.create(title="Reparo", description="Teste", price=100, price_type="fixed", category=self.category, provider=self.provider, area="SP")
        self.client.force_authenticate(user=self.client_user)

    def test_create_contract(self):
        url = reverse("contract-list")
        data = {"service": self.service.id, "client": self.client_user.id, "provider": self.provider.id, "status": "pending"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contract.objects.count(), 1)
        self.assertEqual(Contract.objects.first().client, self.client_user)

    def test_confirm_contract(self):
        contract = Contract.objects.create(service=self.service, client=self.client_user, provider=self.provider, status="pending")
        self.client.force_authenticate(user=self.provider)
        url = reverse("contract-confirm", args=[contract.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        contract.refresh_from_db()
        self.assertEqual(contract.status, "confirmed")
