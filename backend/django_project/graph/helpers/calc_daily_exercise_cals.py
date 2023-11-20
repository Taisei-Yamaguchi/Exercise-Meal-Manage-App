from exercise.models import Exercise
from .get_user_weight_on_date import get_user_weight_on_date

# 個別のexerciseにおける運動消費カロリーを計算する関数
# dateごとの合計の計算はまた別でやる
def calculate_exercise_calories(exercise):
    # duration_minutesがnullの場合はsetsとrepsから計算
    if exercise.duration_minutes is None:
        # 1 repあたりの時間（秒）を計算
        rep_duration = 4  
        
        # setsとrepsからトータルの運動時間（秒）を計算
        total_duration = rep_duration * exercise.sets * exercise.reps
    else:
        total_duration = exercise.duration_minutes * 60  # 分を秒に変換

    # exerciseのMetsが指定されていない場合はデフォルト値を使う
    mets = float(exercise.mets) if exercise.mets is not None else 1.0

    # exerciseの日付に対応するuser_infoのweightを取得
    user_weight = get_user_weight_on_date(exercise.account, exercise.exercise_date)
    # 運動消費カロリーの計算（MET * 体重 * 時間）
    calories = mets * user_weight * (total_duration / 3600)
    calories = calories if calories is not None else 0

    return calories


#その日の,exerciseのカロリーの合計を求める
def calc_daily_exercise_cals(user,date):
    # 指定した日付のExerciseモデルのデータを取得
    exercises = Exercise.objects.filter(account=user, exercise_date=date)
    cals=0
    for exercise in  exercises:
        cals+=calculate_exercise_calories(exercise)

    return cals