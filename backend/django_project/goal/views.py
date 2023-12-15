from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Goal
from .serializers import GoalSerializer
from rest_framework.permissions import IsAuthenticated



# Goal Create pr Upadate
class GoalCreateOrUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = self.request.user
                
        # Get the latest user info, if available.
        try:
            goal = Goal.objects.filter(account=user).first()
        except Goal.DoesNotExist:
            goal = None

        # Check if the latest info is available and its date matches with the provided date。
        if goal: # goal exist
            # Update only the fields provided in the request
            serializer = GoalSerializer(goal, data=request.data, partial=True)
            
        else: #latest_infoが存在しないか、存在してもそのdateがdate_from_requestと異なる場合
            # Create new user_info with request.data
            request.data['account']=user.id
            serializer = GoalSerializer(data=request.data)

        # serializer is available？
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





#get latest user info
class GetGoalView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = self.request.user
        try:
            goal = Goal.objects.filter(account=user).first()
            serializer = GoalSerializer(goal)
            return Response(serializer.data)
        except Goal.DoesNotExist:
            # if latest_info doesn't exist.
            return Response({"message": "No user info available for the current user."}, status=status.HTTP_200_OK)
