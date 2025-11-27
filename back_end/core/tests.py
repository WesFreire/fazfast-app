from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import (
    Usuario, Cliente, Profissional, Categoria, Servico, 
    Contrato, Avaliacao
)
from datetime import date, time

# ====================================================================
# TESTES DE BUSCA E FILTRO DE SERVIÇOS
# ====================================================================

class ServicoSearchTests(APITestCase):
    def setUp(self):
        # Setup básico: 1 Profissional e 1 Categoria
        self.user_pro = Usuario.objects.create_user(
            username='pro_search', email='search@test.com', password='123'
        )
        self.profissional = Profissional.objects.create(usuario=self.user_pro)
        self.categoria = Categoria.objects.create(nome="Manutenção", slug="manutencao")
        
        # Criar Serviços com nomes distintos
        Servico.objects.create(
            profissional=self.profissional,
            categoria=self.categoria,
            nome="Conserto de Ar Condicionado",
            descricao="Reparo geral",
            preco="150.00"
        )
        Servico.objects.create(
            profissional=self.profissional,
            categoria=self.categoria,
            nome="Instalação de Eletrica",
            descricao="Fiação nova",
            preco="200.00"
        )

        # URL da action personalizada 'buscar' definida no viewsets.py
        # Padrão do router: {basename}-{action_name}
        self.url_buscar = reverse('servico-buscar') 

    def test_busca_servico_por_termo(self):
        """Teste: A action 'buscar' deve filtrar serviços pelo nome (icontains)."""
        # Busca por 'Ar Condicionado'
        response = self.client.get(self.url_buscar, {'q': 'Condicionado'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], "Conserto de Ar Condicionado")

    def test_busca_retorna_vazio_se_nao_encontrar(self):
        """Teste: Busca por termo inexistente retorna lista vazia."""
        response = self.client.get(self.url_buscar, {'q': 'Encanamento'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


# ====================================================================
# TESTES DE CONTRATAÇÃO (FLUXO PRINCIPAL)
# ====================================================================

class ContratoTests(APITestCase):
    def setUp(self):
        # 1. Criar Profissional e Serviço
        self.user_pro = Usuario.objects.create_user(username='pro', email='pro@c.com', password='123')
        self.profissional = Profissional.objects.create(usuario=self.user_pro)
        self.categoria = Categoria.objects.create(nome="Limpeza", slug="limpeza")
        self.servico = Servico.objects.create(
            profissional=self.profissional,
            categoria=self.categoria,
            nome="Faxina Completa",
            descricao="Limpeza geral",
            preco="100.00"
        )

        # 2. Criar Cliente (que vai contratar)
        self.user_cli = Usuario.objects.create_user(username='cli', email='cli@c.com', password='123')
        self.cliente = Cliente.objects.create(usuario=self.user_cli)

        # URLs
        self.list_url = reverse('contrato-list')
        
        # Autenticar como cliente
        self.client.force_authenticate(user=self.user_cli)

    def test_cliente_cria_contrato_pendente(self):
        """Teste: Cliente cria uma solicitação de contrato."""
        data = {
            "servico": self.servico.id,
            "cliente_id": self.cliente.id,         # Exigido pelo Serializer (write_only)
            "profissional_id": self.profissional.id, # Exigido pelo Serializer (write_only)
            "data_agendada": str(date.today()),
            "hora_inicio": "14:00:00",
            "local_atendimento": "Rua Teste, 123",
            "preco": "100.00"
        }

        response = self.client.post(self.list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contrato.objects.count(), 1)
        
        contrato = Contrato.objects.first()
        self.assertEqual(contrato.status, 'pendente') # Default do model
        self.assertEqual(contrato.cliente, self.cliente)

    def test_atualizar_status_contrato(self):
        """Teste: Alterar status de 'pendente' para 'confirmado'."""
        # Cria um contrato existente
        contrato = Contrato.objects.create(
            servico=self.servico,
            cliente=self.cliente,
            profissional=self.profissional,
            local_atendimento="Rua X",
            status="pendente"
        )
        
        url_detail = reverse('contrato-detail', args=[contrato.id])
        
        # Simula o Profissional aceitando (autenticamos como o pro)
        self.client.force_authenticate(user=self.user_pro)
        
        data = {"status": "confirmado"}
        response = self.client.patch(url_detail, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        contrato.refresh_from_db()
        self.assertEqual(contrato.status, "confirmado")


# ====================================================================
# TESTES DE AVALIAÇÃO
# ====================================================================

class AvaliacaoTests(APITestCase):
    def setUp(self):
        self.user1 = Usuario.objects.create_user(username='u1', email='u1@a.com', password='123')
        self.user2 = Usuario.objects.create_user(username='u2', email='u2@a.com', password='123')
        
        # Criar perfis necessários para o contrato
        self.pro = Profissional.objects.create(usuario=self.user1)
        self.cli = Cliente.objects.create(usuario=self.user2)
        self.cat = Categoria.objects.create(nome="Test", slug="test")
        self.serv = Servico.objects.create(
            profissional=self.pro, categoria=self.cat, nome="Svc", descricao="D", preco="10"
        )

        # Criar um contrato CONCLUÍDO (geralmente só se avalia contratos concluídos, 
        # embora o model não force isso, é uma boa prática testar o fluxo)
        self.contrato = Contrato.objects.create(
            servico=self.serv,
            cliente=self.cli,
            profissional=self.pro,
            local_atendimento="Loc",
            status="concluido"
        )
        
        self.url = reverse('avaliacao-list')
        self.client.force_authenticate(user=self.user2) # Cliente avalia

    def test_criar_avaliacao_valida(self):
        """Teste: Criar avaliação com nota válida (1-5)."""
        data = {
            "contrato": self.contrato.id,
            "avaliador": self.user2.id,
            "avaliado": self.user1.id,
            "nota": 5,
            "comentario": "Excelente serviço!"
        }
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Avaliacao.objects.count(), 1)

    def test_validacao_nota_limites(self):
        """Teste: Serializer deve rejeitar nota > 5 ou < 1."""
        data = {
            "contrato": self.contrato.id,
            "avaliador": self.user2.id,
            "nota": 6, # Inválido
            "comentario": "Nota inválida"
        }
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nota', response.data) # Verifica se o erro é no campo nota