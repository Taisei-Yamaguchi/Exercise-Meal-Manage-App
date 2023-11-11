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
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.tokens import default_token_generator
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


class CustomUserCreateView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class CustomUserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
# Sign Up
# class SignupAPIView(APIView):
#     def post(self, request):
#         # ユーザーが送信したパスワードをハッシュ化
#         hashed_password = make_password(request.data['password'])
#         # ハッシュ化したパスワードをセット
#         request.data['password'] = hashed_password
        
#         serializer = CustomUserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#Sign Up with Email Confirm
class SignupAPIView(APIView):
    def post(self, request):
        hashed_password = make_password(request.data['password'])
        # ハッシュ化したパスワードをセット
        request.data['password'] = hashed_password
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # トークン生成
            email_confirmation = EmailConfirmation.create(user)
            email_confirmation.sent = timezone.now()
            email_confirmation.save()

            # トークンを含んだURLを構築
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            confirm_url = f"http://your-frontend-url/confirm/{uid}/{token}"

            # メール本文を作成
            message = render_to_string('account/email/confirmation_signup_message.txt', {
                'user': user,
                'confirm_url': confirm_url,
            })

            # メール送信
            send_mail('Confirm your email', message, 'from@example.com', [user.email])

            return Response({'detail': 'Check your email for confirmation.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    
    
    
# Login
class LoginView(APIView):
    def post(self, request):
        username= request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if (
            user is not None
            and user.is_active
            and user.email_check
        ):
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
        
        
        
# LogOut 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # トークンを無効化したり、セッションを削除したりする必要がある場合はここで処理を追加
        request.auth.delete()  # トークンの無効化

        return Response({'message': 'Logout successful.'}, status=status.HTTP_200_OK)
        
        
        
        
        
        
        
# # login check
# class UserAuthenticationView(APIView):
#     def post(self, request):
#         if request.user.is_authenticated:
#             return Response("User is authenticated.", status=status.HTTP_200_OK)
#         else:
#             return Response("Authentication required.", status=status.HTTP_401_UNAUTHORIZED)