from meal.models import Meal
from django.db.models import Sum,F,FloatField, Value,Case, When
from django.db.models.functions import Coalesce

# 摂取カロリー計算
# 指定した日付の食事のそうカロリーを出す。
# 全ての日付にこの関数を実行しリストに入れていく
def calc_daily_meal_cals(user, date):
    # Calculate total calories for the specified date
    total_calories = Meal.objects.filter(account=user, meal_date=date).aggregate(
        total_calories=Coalesce(
            Sum(
                    Case(
                        When(serving__isnull=True, then=F('grams') * F('food__cal') / F('food__amount_per_serving')),
                        When(serving=0, then=F('grams') * F(f'food__cal') / F('food__amount_per_serving')),
                        default=F('serving') * F(f'food__cal'),
                        output_field=FloatField()
                    )
                    
                ),Value(0, output_field=FloatField()))
    
            )['total_calories']

    return total_calories
