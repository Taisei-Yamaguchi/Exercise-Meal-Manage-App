from rest_framework.generics import CreateAPIView
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework import generics
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token


class CustomUserCreateView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class CustomUserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
# Sign Up
class SignupAPIView(APIView):
    def post(self, request):
        # ユーザーが送信したパスワードをハッシュ化
        hashed_password = make_password(request.data['password'])
        # ハッシュ化したパスワードをセット
        request.data['password'] = hashed_password
        
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

# Login
class LoginView(APIView):
    def post(self, request):
        username= request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # 認証成功
            login(request, user)
            print(user.id)
            request.session['user_id']=user.id
            # request.session['test']='session_test'
            print(request.user)
            # print(request.session['test'])
            
            token, created = Token.objects.get_or_create(user=user)  # トークンを取得

            user_details = {
                'name': user.name,
                'email': user.email,
                'sex': user.sex,
                'metabolism': user.metabolism,
                'birthday': user.birthday,
                'token': token.key

                
                # 他のユーザー情報も必要に応じて追加
            }
            
            request.user = user
            print('login done')
            return Response(user_details, status=status.HTTP_200_OK)
        else:
            # 認証失敗
            return Response({'username': username,'password':password}, status=status.HTTP_401_UNAUTHORIZED)
        
        
# login check
class UserAuthenticationView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            return Response("User is authenticated.", status=status.HTTP_200_OK)
        else:
            return Response("Authentication required.", status=status.HTTP_401_UNAUTHORIZED)