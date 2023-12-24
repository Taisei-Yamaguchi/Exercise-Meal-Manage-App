import csv
import datetime
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from ...models import Goal

class Command(BaseCommand):
    help = "Backup Goal Data"
    
    def handle(self, *args, **options):
        # 実行時のYYYYMMDDを取得
        date = datetime.date.today().strftime("%Y%m%d")
        
        # 保存ファイルの相対パス
        backup_folder_path = os.path.join(settings.BACKUP_PATH, 'goal')
        os.makedirs(backup_folder_path, exist_ok=True)
        
        file_path = os.path.join(backup_folder_path, f'goal_{date}.csv')

        # create Backup file
        with open(file_path, 'w') as file:
            writer = csv.writer(file)
            
            header = [field.name for field in Goal._meta.fields]
            writer.writerow(header)
            
            goals = Goal.objects.all()
            
            for goal in goals:
                writer.writerow([
                    goal.id,
                    goal.account.id,
                    
                    goal.goal_intake_cals,
                    goal.goal_consuming_cals,
                    goal.goal_weight,
                    goal.goal_body_fat,
                    goal.goal_muscle_mass,
                    
                    goal.weekly_goal_chest,
                    goal.weekly_goal_leg,
                    goal.weekly_goal_shoulder,
                    goal.weekly_goal_arm,
                    goal.weekly_goal_back,
                    goal.weekly_goal_abs

                ])
                
        # 古いバックアップの削除
        files = os.listdir(backup_folder_path)
        if len(files) >= settings.NUM_SAVED_BACKUP:
            files.sort()
            os.remove(os.path.join(backup_folder_path, files[0]))
