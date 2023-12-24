import csv
import datetime
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from ...models import Workout

class Command(BaseCommand):
    help = "Backup Workout Data"
    
    def handle(self, *args, **options):
        # 実行時のYYYYMMDDを取得
        date = datetime.date.today().strftime("%Y%m%d")
        
        # 保存ファイルの相対パス
        backup_folder_path = os.path.join(settings.BACKUP_PATH, 'workout')
        os.makedirs(backup_folder_path, exist_ok=True)
        
        file_path = os.path.join(backup_folder_path, f'workout_{date}.csv')

        # create Backup file
        with open(file_path, 'w') as file:
            writer = csv.writer(file)
            
            header = [field.name for field in Workout._meta.fields]
            writer.writerow(header)
            
            workouts = Workout.objects.all()
            
            for workout in workouts:
                writer.writerow([
                    workout.id,
                    workout.account.id,
                    workout.name,
                    workout.workout_type,
                    workout.is_default,
                    workout.d_id
                ])
                
        # 古いバックアップの削除
        files = os.listdir(backup_folder_path)
        if len(files) >= settings.NUM_SAVED_BACKUP:
            files.sort()
            os.remove(os.path.join(backup_folder_path, files[0]))
