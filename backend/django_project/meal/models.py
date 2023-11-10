from django.db import models
from accounts.models import CustomUser
from django.core.exceptions import ValidationError

class Food(models.Model):
    name = models.CharField(max_length=100)  # 食品名
    cal = models.FloatField()  # カロリー
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーアカウントへの参照
    amount_per_serving = models.FloatField()  # 1人前あたりの量
    
    # Nutrients Field
    carbohydrate = models.FloatField(blank=True, null=True)  # 炭水化物 g
    fat = models.FloatField(blank=True, null=True)  # 脂質 g
    protein = models.FloatField(blank=True, null=True)  # たんぱく質 g
    sugars = models.FloatField(blank=True, null=True)  # 糖質
    dietary_fiber = models.FloatField(blank=True, null=True)  # 食物繊維
    salt = models.FloatField(blank=True, null=True)  # 塩分
    sodium = models.FloatField(blank=True, null=True)  # ナトリウム
    potassium = models.FloatField(blank=True, null=True)  # カリウム
    calcium = models.FloatField(blank=True, null=True)  # カルシウム
    magnesium = models.FloatField(blank=True, null=True)  # マグネシウム
    iron = models.FloatField(blank=True, null=True)  # 鉄分
    zinc = models.FloatField(blank=True, null=True)  # 亜鉛
    vitamin_a = models.FloatField(blank=True, null=True)  # ビタミンA
    vitamin_d = models.FloatField(blank=True, null=True)  # ビタミンD
    vitamin_e = models.FloatField(blank=True, null=True)  # ビタミンE
    vitamin_b1 = models.FloatField(blank=True, null=True)  # ビタミンB1
    vitamin_b2 = models.FloatField(blank=True, null=True)  # ビタミンB2
    vitamin_b12 = models.FloatField(blank=True, null=True)  # ビタミンB12
    vitamin_b6 = models.FloatField(blank=True, null=True)  # ビタミンB6
    vitamin_c = models.FloatField(blank=True, null=True)  # ビタミンC
    niacin = models.FloatField(blank=True, null=True)  # ナイアシン
    cholesterol = models.FloatField(blank=True, null=True)  # コレステロール
    saturated_fat = models.FloatField(blank=True, null=True)  # 飽和脂肪酸

    def __str__(self):
        return self.name
    
    
class Meal(models.Model):
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーに関連付ける外部キー
    food = models.ForeignKey(Food, on_delete=models.CASCADE)  # 食品に関連付ける外部キー
    meal_date = models.DateField()  # 食事の日付

    serving = models.FloatField(null=True, blank=True)  # 人前
    grams = models.FloatField(null=True, blank=True)  # グラム
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
    def save(self, *args, **kwargs):
        self.full_clean()  # インスタンスが保存される前にバリデーションを実行
        super(Meal, self).save(*args, **kwargs)  # インスタンスを保存