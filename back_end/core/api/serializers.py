from rest_framework import serializers
from core.models import Usuario, Servico, Portfolio, Contrato, Avaliacao, Notificacao

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = "__all__"

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"

class ContratoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrato
        fields = "__all__"

class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = "__all__"

class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = "__all__"
