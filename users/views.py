from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    # Only authenticated users with a valid JWT token can access this endpoint
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        # Return the currently authenticated user based on the JWT token
        return self.request.user