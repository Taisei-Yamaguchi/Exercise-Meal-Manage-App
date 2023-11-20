# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Workout,Exercise
from .serializers import WorkoutSerializer,POSTExerciseSerializer,GetExerciseSerializer
from rest_framework.permissions import IsAuthenticated
from .default_workout import default_workout_data
from django.shortcuts import get_object_or_404
from rest_framework.generics import  DestroyAPIView



# get Workout
class WorkoutListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = self.request.user
        workouts = Workout.objects.filter(account=user.id)
        workout_serializer = WorkoutSerializer(workouts, many=True)
            
        return Response({'workout': workout_serializer.data, 'default_workout': default_workout_data})




#create new Workout
class WorkoutCreateView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def post(self, request):
        user = self.request.user
        request.data['account'] = user.id
        serializer = WorkoutSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




#get Exercise By Date
class ExerciseGetByDateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user
        # get date from query. respond data depending on this date.
        exercise_date = self.request.query_params.get('date', None)

        # 'exercise_date' query is required
        if not exercise_date:
            return Response({'detail': 'exercise_date parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Return the exercises with workout or with dfault_workout differently.
        workout_exercise = Exercise.objects.filter(account=user.id, exercise_date=exercise_date,workout__isnull=False)
        default_workout_exercise= Exercise.objects.filter(account=user.id, exercise_date=exercise_date,default_workout__isnull=False)
        # use GetExerciseSerializer
        w_exercise_serializer = GetExerciseSerializer(workout_exercise, many=True).data
        d_exercise_serializer = GetExerciseSerializer(default_workout_exercise, many=True).data
        return Response({'w_exercise':w_exercise_serializer,'d_exercise':d_exercise_serializer}, status=status.HTTP_200_OK)
        




#create new Exercise
class ExerciseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user
        
        #　The frontend sends not workout or workout_default, but the workout_id to identify it first
        if 'workout_id' in request.data:
            workout_id = request.data['workout_id']

            # If workout_id is a number, it is associated with workout.
            if isinstance(workout_id, int):
                #Check if the workout exists and the account of the workout matches the logged-in user.
                workout = get_object_or_404(Workout, id=workout_id, account=user.id)
                
                if workout is not None: 
                    request.data['workout']=workout.id #bind workout
                    request.data['workout_id'] =None
                else:
                    return Response({'detail': 'Workout not found.'}, status=status.HTTP_400_BAD_REQUEST)


            # If workout_id is a str, it is associated with default_workout.
            elif isinstance(workout_id, str):
                # Extract elements with IDs that match workout_id (search in default_workout.py).
                matching_default_workout = next(
                    (item for item in default_workout_data if item['id'] == workout_id),
                    None
                )
                    
                if matching_default_workout:
                    request.data['default_workout']=matching_default_workout
                    request.data['workout_id'] =None
                else:
                    return Response({'detail': 'Matching default workout not found.'}, status=status.HTTP_400_BAD_REQUEST)

            # If workout_id is not a str or a number, response error.
            else:
                return Response({'detail': 'workout_id is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

            # bind account.
            request.data['account']=user.id
                
            # create new Exercise with request.data
            # use POSTExrciseSerializer
            print(f"Type of request.data: {type(request.data)}")
            serializer = POSTExerciseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            print('Error: workout_id')
            return Response({'detail': 'workout_id is required in the request data.'}, status=status.HTTP_400_BAD_REQUEST)
        




# exercise Update
class ExerciseUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, exercise_id):
        user = self.request.user
        # uppdate the specified exercise_id with the data passed from the request as a complement.
        exercise = get_object_or_404(Exercise, id=exercise_id, account=user.id)
        serializer = POSTExerciseSerializer(exercise, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



#exercise Delete
class ExerciseDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Exercise.objects.all()
    serializer_class = POSTExerciseSerializer
    

    def perform_destroy(self, instance):
        # check wheter login user and exercise.accound matches or not.
        if self.request.user == instance.account:
            instance.delete()
        else:
            # if they dosen't match, response authority error.
            return Response({'detail': 'You do not have permission to delete this meal.'}, status=status.HTTP_403_FORBIDDEN)