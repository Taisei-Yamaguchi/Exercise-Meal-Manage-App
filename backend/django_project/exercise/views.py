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

from django.db.models import Max


# get Workout
class WorkoutListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = self.request.user
        workouts = Workout.objects.filter(account=user.id,is_default=False)
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

        
        workout_exercise = Exercise.objects.filter(account=user.id, exercise_date=exercise_date).order_by('id')
        exercise_serializer = GetExerciseSerializer(workout_exercise, many=True).data
        
        return Response({'exercise':exercise_serializer}, status=status.HTTP_200_OK)
        


#create new Exercise
class ExerciseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user
        
        #　The frontend sends not workout or workout_default, but the workout_id to identify it first
        if 'workout_id' in request.data:
            workout_id = request.data['workout_id']

            # If it's not default workout.
            if request.data['is_default'] == False:
                #Check if the workout exists and the account of the workout matches the logged-in user.
                workout = get_object_or_404(Workout, id=workout_id, account=user.id)
                
                if workout is not None: 
                    request.data['workout']=workout.id #bind workout
                    request.data['workout_id'] =None
                else:
                    return Response({'detail': 'Workout not found.'}, status=status.HTTP_400_BAD_REQUEST)


            # If it is default_workout.
            else:
                # Try to find the workout with d_id=workout_id
                workout = Workout.objects.filter(d_id=workout_id, account=user.id).first()
                #もし、すでにworkoutにそのdefault_workoutを登録していたのであれば、それを利用する。
                if workout is not None:
                    request.data['workout']=workout.id #bind workout
                    request.data['workout_id'] =None
                else:
                    matching_default_workout = next(
                        (item for item in default_workout_data if item['id'] == workout_id),
                        None
                    )
                        
                    if matching_default_workout:
                        # Save the matching default workout to Workout model
                        workout = Workout.objects.create(
                            account=user,
                            d_id=matching_default_workout['id'],
                            name=matching_default_workout['name'],
                            workout_type=matching_default_workout['workout_type'],
                            is_default= True,
                        )
                        request.data['workout'] = workout.id  # bind workout
                        request.data['workout_id'] = None
                    else:
                        return Response({'detail': 'Matching default workout not found.'}, status=status.HTTP_400_BAD_REQUEST)

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
        print("Performing destroy for Exercise ID:", instance.id)
        
        # check wheter login user and exercise.accound matches or not.
        if self.request.user == instance.account:
            instance.delete()
        else:
            # if they dosen't match, response authority error.
            return Response({'detail': 'You do not have permission to delete this meal.'}, status=status.HTTP_403_FORBIDDEN)
        
        
        
#get latest exercise by type
class GetLatestExerciseByTypeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = self.request.user
        workout_type = request.query_params.get('workout_type', None)
        
        # 最新のexercise_dateを取得
        latest_exercise_date = (
            Exercise.objects.filter(workout__workout_type=workout_type, account=user.id)
            .aggregate(max_date=Max('exercise_date'))
            .get('max_date')
        )
        exercises = Exercise.objects.filter(workout__workout_type=workout_type,account=user.id,exercise_date=latest_exercise_date).order_by('id')   # ログインユーザーのmealを取得

        serialized_exercises = GetExerciseSerializer(exercises, many=True)
        return Response({'exercises':serialized_exercises.data})
    
    
    
    
# 最新履歴からデータを登録する
class CreateExercisesWithLatestHistoryByType(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = self.request.user
    
        workout_type = request.data['workout_type']
        exercise_date = request.data['exercise_date']
        
        # 最新のmeal_dateを取得
        latest_exercise_date = (
            Exercise.objects.filter(workout__workout_type=workout_type, account=user.id)
            .aggregate(max_date=Max('exercise_date'))
            .get('max_date')
        )
        latest_exercises = Exercise.objects.filter(workout__workout_type=workout_type,account=user.id,exercise_date=latest_exercise_date).order_by('id')   # ログインユーザーのexerciseを取得

        new_exercises = []
        for exercise in latest_exercises:
            # 例として現在の日時を新しいmeal_dateとして設定
            new_exercise = Exercise.objects.create(
                exercise_date=exercise_date,
                workout=exercise.workout,
                sets=exercise.sets,
                reps= exercise.reps,
                weight_kg=exercise.weight_kg,
                duration_minutes=exercise.duration_minutes,
                distance=exercise.distance,
                mets=exercise.mets,
                memos=exercise.memos,
                account=exercise.account,
            )
            
            serializer = POSTExerciseSerializer(data=new_exercise)
            if serializer.is_valid():
                serializer.save()
                new_exercises.append(new_exercise)
            else:
                print(serializer.errors)

        # 新しいMealオブジェクトをシリアライズしてレスポンス
        serialized_new_exercise = GetExerciseSerializer(new_exercises, many=True)
        return Response({'exercises': serialized_new_exercise.data})
