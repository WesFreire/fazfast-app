from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from core.models import User

class UserTests(APITestCase):
    def test_create_user(self):
        url = reverse("user-list")
        data = {"email": "test@example.com", "username": "tester", "password": "StrongPass123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_login_user(self):
        user = User.objects.create_user(email="login@test.com", username="login", password="123456")
        url = reverse("token_obtain_pair")  # endpoint do SimpleJWT
        response = self.client.post(url, {"email": user.email, "password": "123456"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
