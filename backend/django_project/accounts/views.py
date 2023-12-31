from .models import CustomUser
from .serializers import CustomUserSerializer,CustomUserUpdateSerializer
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
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import logout
from django.conf import settings


#Sign Up with Email Confirm
class SignupAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')

        # 既存のユーザーを確認
        existing_user = CustomUser.objects.filter(username=email).first()

        if existing_user:
            # 既存のユーザーが確認されていない場合
            # email_checkがtrueなら、勝手に変更されない
            if not existing_user.email_check:
                existing_user.delete()
                
        hashed_password = make_password(request.data['password'])
        # ハッシュ化したパスワードをセット
        request.data['password'] = hashed_password
        request.data['email_check'] = False #froendでどんな値があたえられても強制的にfalseにする
        
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # トークンを含んだURLを構築
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            confirm_url = f"{settings.FRONTEND_ENDPOINT}/signup/email-confirmation/{uid}/{token}"

            # メール本文を作成
            message = render_to_string('email/confirmation_signup_message.txt', {
                'user': user.name,
                'confirm_url': confirm_url,
            })
            
            # 実際にはここでメール送信
            send_result = send_mail('EMMA Activate Account', message, settings.DEFAULT_FROM_EMAIL, [user.email])

            if send_result == 1:
                return Response({'detail': 'Success! Check your email for confirmation.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'detail': 'Failed to send confirmation email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
# Signup Confirmation via email.
class SignUpConfirmEmailAPIView(APIView):
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')

        try:
            if uidb64 is None:
                return Response({'detail': 'uid is required.'}, status=status.HTTP_400_BAD_REQUEST)

            uid = urlsafe_base64_decode(uidb64).decode('utf-8')
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            # トークンが有効な場合、email_check を True に変更
            user.email_check = True
            user.save()
            return Response({'detail': 'Email confirmed successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid token or user not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    
    
# Pasword Reset Request
class PasswordResetRequestAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = get_object_or_404(CustomUser, email=email)

        # Create a password reset token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # user.password_reset_token = token
        user.password_reset_sent = timezone.now()
        user.save()

        # Send the reset link to the user's email (replace with your email sending logic)
        reset_url = f"{settings.FRONTEND_ENDPOINT}/password-reset/process/{uid}/{token}"
        
        # print(reset_url)  # For testing purposes
        # メール本文を作成
        message = render_to_string('email/reset_password_message.txt', {
            'user': user.name,
            'reset_url': reset_url,
        })
        # print(message)
        # 実際にはここでメール送信
        send_mail('EMMA PAssword Reset', message, settings.DEFAULT_FROM_EMAIL, [user.email])
        return Response({'detail': 'Password reset link sent successfully.'}, status=status.HTTP_200_OK)



# Passowrd Reset system
class PasswordResetConfirmAPIView(APIView):
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        try:
            
            uid = urlsafe_base64_decode(uidb64).decode('utf-8')
            user = get_user_model().objects.get(pk=uid)
            
            # Check if the token is valid and not expired
            if (
                user is not None 
                and default_token_generator.check_token(user, token) 
                and (timezone.now() - user.password_reset_sent).days < 1
            ):
                # Set the new password. ここでhash化もする
                user.set_password(new_password)
                user.save()

                # Invalidate the token
                
                user.password_reset_sent = None
                user.save()

                return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({'detail': 'Invalid uid.'}, status=status.HTTP_400_BAD_REQUEST)
        except get_user_model().DoesNotExist:
            return Response({'detail': 'Invalid uid.'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
        
# Login
class LoginView(APIView):
    def post(self, request):
        username= request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active and user.email_check:
                # 認証成功
                login(request, user)

                token, created = Token.objects.get_or_create(user=user)  # トークンを取得

                user_details = {
                    'name': user.name,
                    'email': user.email,
                    'sex': user.sex,
                    'birthday': user.birthday,
                    'token': token.key
                    # 他のユーザー情報も必要に応じて追加
                }
                
                request.user = user

                return Response(user_details, status=status.HTTP_200_OK)
            else:
                # ユーザーがアクティブでないか、メールが確認されていない場合
                return Response({'detail': 'User is not active or email is not checked'},
                                status=status.HTTP_401_UNAUTHORIZED)
        else:
            # 認証失敗
            return Response({'detail': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
# LogOut 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # トークンを無効化したり、セッションを削除したりする必要がある場合はここで処理を追加
        request.auth.delete()  # トークンの無効化
        logout(request) #logout セッションの削除

        return Response({'message': 'Logout successful.'}, status=status.HTTP_200_OK)
        
        
        
        
# Update Account
class UpdateAccountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        serializer = CustomUserUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response('detail: update success.', status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response('detail: update error.', status=status.HTTP_400_BAD_REQUEST)
        
        
        
# Get Account
class GetAccountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        data = {
            'name': serializer.data['name'],
            'email_address': user.email,
            'picture': serializer.data['picture'],
            'sex': serializer.data['sex'],
            'birthday': serializer.data['birthday'],
        }
        return Response(data)