import re


def extract_nutritional_values(food_description):
    # 正規表現パターン
    pattern = r"Per (\d+(\.\d+)?)\s*(g| serving) - Calories: (\d+)kcal \| Fat: (\d+\.\d+)g \| Carbs: (\d+\.\d+)g \| Protein: (\d+\.\d+)g"

    # 正規表現にマッチする部分を取得
    match = re.search(pattern, food_description)

    # マッチした場合は各値を返す
    if match:
        amount = float(match.group(1))
        unit = match.group(3).strip().lower()  # 'g' or 'serving'
        calories = float(match.group(4))
        fat = float(match.group(5))
        carbs = float(match.group(6))
        protein = float(match.group(7))

        
        # servingとして渡された場合、1人前にして返す
        if unit == 'serving':
            
            is_100g=False
            is_serving=True
            
            amount_per_serving_r=None
            cals_per_r = calories/amount 
            fat_per_r = fat/amount
            carbs_per_r = carbs/amount
            protein_per_r = protein/amount
        else:
            is_100g=True
            is_serving=False
            # amount_per_servingがgの場合, 100gの時の値を返す
            amount_per_serving_r=100
            cals_per_r = (calories / amount) * 100
            fat_per_r = (fat / amount) * 100
            carbs_per_r = (carbs / amount) * 100
            protein_per_r = (protein / amount) * 100

        
        return {
            'amount_per_serving': amount_per_serving_r, 
            'cal': cals_per_r, 
            'fat': fat_per_r, 
            'carbohydrate': carbs_per_r, 
            'protein': protein_per_r,
            'is_100g': is_100g,
            'is_serving': is_serving,
        }
    else:
        return None
    