from django.db import models
from accounts.models import CustomUser
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator

class Food(models.Model):
    name = models.CharField(max_length=100)  # 食品名
    cal = models.FloatField(validators=[MinValueValidator(1)],default=1)  # カロリー
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーアカウントへの参照
    amount_per_serving = models.FloatField(validators=[MinValueValidator(1)],default=1)  # 1人前あたりの量
    
    # Nutrients Field with MinValueValidator
    carbohydrate = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    fat = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    protein = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    sugars = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    dietary_fiber = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    salt = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    sodium = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    potassium = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    calcium = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    magnesium = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    iron = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    zinc = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_a = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_d = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_e = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_b1 = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_b2 = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_b12 = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_b6 = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    vitamin_c = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    niacin = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    cholesterol = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    saturated_fat = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0)])
    def __str__(self):
        return self.name
    
    
class Meal(models.Model):
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーに関連付ける外部キー
    food = models.ForeignKey(Food, on_delete=models.CASCADE)  # 食品に関連付ける外部キー
    meal_date = models.DateField()  # 食事の日付

    serving = models.FloatField(null=True, blank=True,validators=[MinValueValidator(0)])  # 人前
    grams = models.FloatField(null=True, blank=True,validators=[MinValueValidator(0)])  # グラム
    MEAL_TYPE_CHOICES = [
        ('breakfast', '朝食'),
        ('lunch', '昼食'),
        ('dinner', '夕食'),
        ('snack', 'スナック'),
    ]
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPE_CHOICES)  # 食事のタイプ

    def clean(self):
        if self.serving is None and self.grams is None:
            raise ValidationError("Serving or grams is required.")
        
        if self.grams is not None and self.serving is not None:
            if self.serving > 0 and self.grams >0:
                raise ValidationError("Only one of serving or grams should be provided.")

        if self.grams is not None and self.grams < 0:
            raise ValidationError("Grams should be greater than 0.")

        if self.serving is not None and self.serving < 0:
            raise ValidationError("Serving should be greater than 0.")

    def save(self, *args, **kwargs):
        self.full_clean()  # インスタンスが保存される前にバリデーションを実行
        super(Meal, self).save(*args, **kwargs)  # インスタンスを保存