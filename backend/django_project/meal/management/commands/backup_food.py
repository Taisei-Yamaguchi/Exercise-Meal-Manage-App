import csv
import datetime
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from ...models import Food

class Command(BaseCommand):
    help = "Backup Food Data"
    
    def handle(self, *args, **options):
        # 実行時のYYYYMMDDを取得
        date = datetime.date.today().strftime("%Y%m%d")
        
        # 保存ファイルの相対パス
        backup_folder_path = os.path.join(settings.BACKUP_PATH, 'food')
        os.makedirs(backup_folder_path, exist_ok=True)
        
        file_path = os.path.join(backup_folder_path, f'food_{date}.csv')

        # create Backup file
        with open(file_path, 'w') as file:
            writer = csv.writer(file)
            
            header = [field.name for field in Food._meta.fields]
            writer.writerow(header)
            
            foods = Food.objects.all()
            
            for food in foods:
                writer.writerow([
                    food.id,
                    food.account.id,
                    food.name,
                    food.cal,
                    food.amount_per_serving,
                    food.is_open_api,
                    food.is_100g,
                    food.is_serving,
                    food.food_id,
                    food.carbohydrate,
                    food.fat,
                    food.protein,
                    food.sugars,
                    food.dietary_fiber,
                    food.salt,
                    food.sodium,
                    food.potassium,
                    food.calcium,
                    food.magnesium,
                    food.iron,
                    food.zinc,
                    food.vitamin_a,
                    food.vitamin_d,
                    food.vitamin_e,
                    food.vitamin_b1,
                    food.vitamin_b2,
                    food.vitamin_b12,
                    food.vitamin_b6,                        food.vitamin_c,
                    food.niacin,
                    food.cholesterol,
                    food.saturated_fat,
                ])
                
        # 古いバックアップの削除
        files = os.listdir(backup_folder_path)
        if len(files) >= settings.NUM_SAVED_BACKUP:
            files.sort()
            os.remove(os.path.join(backup_folder_path, files[0]))