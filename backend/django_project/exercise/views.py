# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Workout,Exercise
from .serializers import WorkoutSerializer
from rest_framework.permissions import IsAuthenticated
from .default_workout import default_workout_data


# get Workout
class WorkoutListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = self.request.user
        if user.is_authenticated:
            
            workouts = Workout.objects.filter(account=user.id)
            workout_serializer = WorkoutSerializer(workouts, many=True)
            
            return Response({'workout': workout_serializer.data, 'default_workout': default_workout_data})
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        


#create new Workout
class WorkoutCreateView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def post(self, request):
        user = self.request.user
        if user.is_authenticated:
            request.data['account'] = user.id
            serializer = WorkoutSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        



