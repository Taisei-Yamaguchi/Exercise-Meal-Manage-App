# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Workout,Exercise
from .serializers import WorkoutSerializer,POSTExerciseSerializer,DExerciseSerializer,WExerciseSerializer
from rest_framework.permissions import IsAuthenticated
from .default_workout import default_workout_data
from django.shortcuts import get_object_or_404


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
        



#get Exercise By Date
class ExerciseGetByDateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user

        if user.is_authenticated:
            # クエリパラメータから日付を取得
            exercise_date = self.request.query_params.get('date', None)

            if not exercise_date:
                return Response({'detail': 'exercise_date parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # 指定された日付と一致するExercise(workoutをもつもの)を取得
            workout_exercise = Exercise.objects.filter(account=user.id, exercise_date=exercise_date,workout__isnull=False)
            default_workout_exercise= Exercise.objects.filter(account=user.id, exercise_date=exercise_date,default_workout__isnull=False)
            # シリアライザを使ってデータを整形
            w_exercise_serializer = WExerciseSerializer(workout_exercise, many=True).data
            d_exercise_serializer = DExerciseSerializer(default_workout_exercise, many=True).data
            return Response({'w_exercise':w_exercise_serializer,'d_exercise':d_exercise_serializer}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
        
        

#create new Exercise
class ExerciseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user
        if user.is_authenticated:

            # 受け取ったデータから適切な処理を行う
            if 'workout_id' in request.data:
                workout_id = request.data['workout_id']

                # workout_idが数字の場合はworkoutに関連付け
                if isinstance(workout_id, int):
                    print(f"Type of request.data: {type(request.data)}")
                    print(f"Type of workout_id: {type(workout_id)}")
                    #workoutが存在しかつ、workoutのaccountがログインユーザーと一致するかチェック
                    print('workout_id=number',workout_id)
                    workout = get_object_or_404(Workout, id=workout_id, account=user.id)
                    print('workout',workout)
                    
                    if workout is not None: 
                        print('workout.id',workout.id)
                        request.data['workout']=workout.id
                        request.data['workout_id'] =None
                        
                        print('request.data[workout]',request.data['workout'])
                    print(f"Type of workout: {type(request.data['workout'])}")

                # workout_idが文字列の場合はdefault_workoutに関連付け
                elif isinstance(workout_id, str):
                    # workout_idと一致するIDを持つ要素を抽出
                    print('workout_id=str',workout_id)
                    
                    matching_default_workout = next(
                        (item for item in default_workout_data if item['id'] == workout_id),
                        None
                    )
                    
                    if matching_default_workout:
                        request.data['default_workout']=matching_default_workout
                        request.data['workout_id'] =None
                    else:
                        # 一致するIDが見つからなかった場合のエラー処理を追加
                        return Response({'detail': 'Matching default workout not found.'}, status=status.HTTP_400_BAD_REQUEST)

                # それ以外の場合はエラーを返すなどの適切な処理を行う
                else:
                    return Response({'detail': 'workout not found.'}, status=status.HTTP_400_BAD_REQUEST)

                # accountの紐付け
                request.data['account']=user.id
                
                # Exerciseを作成
                
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
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
