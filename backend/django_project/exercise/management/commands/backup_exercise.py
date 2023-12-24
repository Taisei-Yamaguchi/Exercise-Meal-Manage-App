import csv
import datetime
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from ...models import Exercise

class Command(BaseCommand):
    help = "Backup Exercise Data"
    
    def handle(self, *args, **options):
        # 実行時のYYYYMMDDを取得
        date = datetime.date.today().strftime("%Y%m%d")
        
        # 保存ファイルの相対パス
        backup_folder_path = os.path.join(settings.BACKUP_PATH, 'exercise')
        os.makedirs(backup_folder_path, exist_ok=True)
        
        file_path = os.path.join(backup_folder_path, f'exercise_{date}.csv')

        # create Backup file
        with open(file_path, 'w') as file:
            writer = csv.writer(file)
            
            header = [field.name for field in Exercise._meta.fields]
            writer.writerow(header)
            
            exercises = Exercise.objects.all()
            
            for exercise in exercises:
                writer.writerow([
                    exercise.id,
                    exercise.account.id,
                    exercise.exercise_date,
                    
                    exercise.workout.id,
                    
                    exercise.sets,
                    exercise.reps,
                    exercise.weight_kg,
                    
                    exercise.duration_minutes,
                    exercise.distance,
                    exercise.mets,
                    exercise.memos,
                    
                ])
                
        # 古いバックアップの削除
        files = os.listdir(backup_folder_path)
        if len(files) >= settings.NUM_SAVED_BACKUP:
            files.sort()
            os.remove(os.path.join(backup_folder_path, files[0]))
