from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserInfo
from .serializers import UserInfoSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from .helpers.calculate_metabolism import calculate_metabolism



# UserInfo Create pr Upadate
class UserInfoCreateOrUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = self.request.user
        
        # frontendから取得したdate,metabolismを適切な形に変換。
        request.data['date']= datetime.strptime(request.data.get('date'), '%Y-%m-%d').date()
        if request.data['metabolism'] is None: #'metabolism'がnullだったら、weight,height,sex,birthdayから計算
            request.data['metabolism'] = calculate_metabolism(request.data['weight'], request.data['height'],user.sex,user.birthday)


        # Get the latest user info, if available.
        try:
            latest_info = UserInfo.objects.filter(account=user).latest('date')
        except UserInfo.DoesNotExist:
            latest_info = None

        
        # Check if the latest info is available and its date matches with the provided date。
        if latest_info and latest_info.date == request.data['date']: # latest_infoが存在し、かつそのdateがdatef_from_requestと一致する場合
            # Update only the fields provided in the request
            serializer = UserInfoSerializer(latest_info, data=request.data, partial=True)
            
        else: #latest_infoが存在しないか、存在してもそのdateがdate_from_requestと異なる場合
            # Create new user_info with request.data
            request.data['account']=user.id
            serializer = UserInfoSerializer(data=request.data)

        # serializer is available？
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





#get latest user info
class LatestUserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = self.request.user
        
        try:
            latest_info = UserInfo.objects.filter(account=user).latest('date')
            serializer = UserInfoSerializer(latest_info)
            return Response(serializer.data)
        except UserInfo.DoesNotExist:
            # if latest_info doesn't exist.
            return Response({"message": "No user info available for the current user."}, status=status.HTTP_200_OK)
