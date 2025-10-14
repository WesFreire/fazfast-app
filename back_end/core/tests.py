from django.test import TestCase
from rest_framework.test import APIClient
from core.models import Usuario, Categoria, Servico, Contrato, Avaliacao, Notificacao


class BaseTest(TestCase):
    @classmethod
    def setUpTestData(cls):

        cls.prestador = Usuario.objects.create_user(
            username="prestador",
            email="prestador@test.com",
            password="12345678",
            pode_prestar=True
        )


        cls.cliente = Usuario.objects.create_user(
            username="cliente",
            email="cliente@test.com",
            password="12345678"
        )


        cls.categoria = Categoria.objects.create(nome="Limpeza", slug="limpeza")


        cls.servico = Servico.objects.create(
            nome="Serviço Teste",
            descricao="Descrição teste",
            preco=100,
            categoria=cls.categoria,
            prestador=cls.prestador
        )


        cls.contrato = Contrato.objects.create(
            cliente=cls.cliente,
            prestador=cls.prestador,
            servico=cls.servico,
            status="pendente",
            local_atendimento="Rua Teste, 123",
            preco=100
        )


        cls.avaliacao = Avaliacao.objects.create(
            contrato=cls.contrato,
            avaliador=cls.cliente,
            avaliado=cls.prestador,
            nota=5,
            comentario="Muito bom!"
        )

  
        cls.notificacao = Notificacao.objects.create(
            usuario=cls.prestador,
            tipo="novo_contrato",
            mensagem="Novo contrato recebido"
        )


class UsuarioTests(BaseTest):
    def test_list_usuarios(self):
        usuarios = Usuario.objects.all()
        self.assertEqual(usuarios.count(), 2)

    def test_create_usuario(self):
        user = Usuario.objects.create_user(
            username="novo",
            email="novo@test.com",
            password="12345678"
        )
        self.assertEqual(user.email, "novo@test.com")

class ServicoTests(BaseTest):
    def test_list_servicos(self):
        servicos = Servico.objects.all()
        self.assertEqual(servicos.count(), 1)

    def test_create_servico(self):
        servico = Servico.objects.create(
            nome="Outro Serviço",
            descricao="Outro teste",
            preco=50,
            categoria=self.categoria,
            prestador=self.prestador
        )
        self.assertEqual(servico.nome, "Outro Serviço")


class ContratoTests(BaseTest):
    def test_list_contratos(self):
        contratos = Contrato.objects.all()
        self.assertEqual(contratos.count(), 1)


class AvaliacaoTests(BaseTest):
    def test_list_avaliacoes(self):
        avaliacoes = Avaliacao.objects.all()
        self.assertEqual(avaliacoes.count(), 1)


class NotificacaoTests(BaseTest):
    def test_list_notificacoes(self):
        notificacoes = Notificacao.objects.all()
        self.assertEqual(notificacoes.count(), 1)


class JWTAuthTests(BaseTest):
    def setUp(self):
        self.client = APIClient()

    def test_obter_token_jwt(self):
        response = self.client.post("/api/token/", {
            "email": self.cliente.email,
            "password": "12345678"
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.token = response.data["access"]

    def test_usar_token_para_endpoint_protegido(self):

        response = self.client.post("/api/token/", {
            "email": self.cliente.email,
            "password": "12345678"
        }, format="json")
        token = response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/usuarios/")
        self.assertEqual(response.status_code, 200)
