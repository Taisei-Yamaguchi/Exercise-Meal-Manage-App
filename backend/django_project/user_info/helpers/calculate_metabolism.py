from datetime import datetime

#metabolism 自動計算関数
def calculate_metabolism(weight, height,sex,birthday):
    # ここで基礎代謝の計算ロジックを実装
    today = datetime.today().date()
    age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
    # 変数をfloat型に変換
    weight = float(weight)
    height = float(height)
    age = float(age)

    # Mifflin-St Jeorの式を用いる
    if sex: #True 女のとき
        metabolism= 10 * weight + 6.25 * height - 5 * age - 161
    else: #False 男のとき
        metabolism = 10 * weight + 6.25 * height - 5 * age + 5

    return metabolism