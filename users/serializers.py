from rest_framework import serializers
from django.contrib.auth.models import User
from subscriptions.serializers import UserSubscriptionSerializer

class UserSerializer(serializers.ModelSerializer):
    # Fetch the related subscription using the related_name="subscription" from the model
    subscription = UserSubscriptionSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'subscription']

class RegisterSerializer(serializers.ModelSerializer):
    # Ensure password is only used for writing and never returned in API responses
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Use create_user to properly hash the password
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )