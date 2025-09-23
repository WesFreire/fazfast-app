from rest_framework import serializers
from .models import User, Category, Service, PortfolioItem, Availability, Contract, Review, Notification

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password", "phone", "bio", "photo", "is_provider", "active_role"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.username = user.email.split("@")[0]
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ["id", "media", "caption"]


class ServiceSerializer(serializers.ModelSerializer):
    provider = UserSerializer(read_only=True)
    portfolio = PortfolioItemSerializer(many=True, read_only=True)
    category = CategorySerializer()

    class Meta:
        model = Service
        fields = ["id","provider","category","title","description","price","price_type","avg_duration_minutes","area","is_active","portfolio","created_at"]
        read_only_fields = ["id","provider","created_at"]

    def create(self, validated_data):
        cat_data = validated_data.pop("category", None)
        if cat_data:
            cat, _ = Category.objects.get_or_create(slug=cat_data.get("slug"), defaults={"name": cat_data.get("name")})
            validated_data["category"] = cat
        service = Service.objects.create(**validated_data)
        return service

    def update(self, instance, validated_data):
        cat_data = validated_data.pop("category", None)
        if cat_data:
            cat, _ = Category.objects.get_or_create(slug=cat_data.get("slug"), defaults={"name": cat_data.get("name")})
            instance.category = cat
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ["id","provider","date","start_time","end_time","is_booked"]
        read_only_fields = ["id","is_booked"]


class ContractSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    client = UserSerializer(read_only=True)
    provider = UserSerializer(read_only=True)

    service_id = serializers.IntegerField(write_only=True)
    date = serializers.DateField()
    start_time = serializers.TimeField()
    location = serializers.CharField()

    class Meta:
        model = Contract
        fields = ["id","service","service_id","client","provider","date","start_time","end_time","location","notes","price","status","contract_pdf","created_at"]
        read_only_fields = ["id","status","contract_pdf","created_at","provider","client","price"]

    def create(self, validated_data):
        # must set client, provider and price automatically
        service_id = validated_data.pop("service_id")
        request = self.context.get("request")
        client = request.user
        service = Service.objects.get(id=service_id)
        provider = service.provider
        # price negotiation not covered here — use provided or default
        contract = Contract.objects.create(
            service=service, client=client, provider=provider,
            date=validated_data["date"], start_time=validated_data["start_time"],
            location=validated_data["location"], notes=validated_data.get("notes",""),
            price=service.price
        )
        # optionally generate PDF asynchronously
        return contract


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    reviewee = UserSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ["id","contract","reviewer","reviewee","rating","comment","created_at"]
        read_only_fields = ["id","created_at","reviewer","reviewee"]
