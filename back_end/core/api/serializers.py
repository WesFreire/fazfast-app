from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from core.models import (
    Usuario,
    Cliente,
    Profissional,
    Categoria,
    Servico,
    PortfolioItem,
    Contrato,
    Avaliacao,
    Notificacao,
)


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = "__all__"

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = self.Meta.model(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance 


UsuarioModel = get_user_model()


# serializers.py

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )
    password2 = serializers.CharField(write_only=True, required=True)
    papel = serializers.ChoiceField(
        choices=[("cliente", "Cliente"), ("profissional", "Profissional")],
        write_only=True
    )

    class Meta:
        model = UsuarioModel
        fields = ["username", "email", "password", "password2", "papel"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        papel = validated_data.pop("papel")
        validated_data.pop("password2")
        password = validated_data.pop("password")

        user = UsuarioModel(**validated_data)
        user.set_password(password)
        user.save()

        # Cria o modelo relacionado automaticamente
        if papel == "cliente":
            Cliente.objects.create(usuario=user)
        elif papel == "profissional":
            Profissional.objects.create(usuario=user)
            user.pode_prestar = True  # marca que ele pode prestar serviços
            user.save(update_fields=["pode_prestar"])

        user.papel_ativo = papel
        user.save(update_fields=["papel_ativo"])
        return user


class ClienteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source="usuario", write_only=True
    )

    class Meta:
        model = Cliente
        fields = ["id", "usuario", "usuario_id", "data_nascimento", "cpf", "preferencias"]


class ProfissionalSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source="usuario", write_only=True
    )
    especialidades = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Profissional
        fields = [
            "id",
            "usuario",
            "usuario_id",
            "biografia",
            "cnpj",
            "experiencia_anos",
            "avaliacao_media",
            "especialidades",
        ]


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


class ServicoSerializer(serializers.ModelSerializer):
    profissional = ProfissionalSerializer(read_only=True)
    profissional_id = serializers.PrimaryKeyRelatedField(
        queryset=Profissional.objects.all(), source="profissional", write_only=True
    )

    class Meta:
        model = Servico
        fields = "__all__"


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = "__all__"


class ContratoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    profissional = ProfissionalSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(), source="cliente", write_only=True
    )
    profissional_id = serializers.PrimaryKeyRelatedField(
        queryset=Profissional.objects.all(), source="profissional", write_only=True
    )

    class Meta:
        model = Contrato
        fields = "__all__"


class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = "__all__"

    def validate_nota(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("A nota deve estar entre 1 e 5.")
        return value


class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = "__all__"
