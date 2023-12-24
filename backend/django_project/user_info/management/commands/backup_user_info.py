import csv
import datetime
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from ...models import UserInfo

class Command(BaseCommand):
    help = "Backup UserInfo Data"
    
    def handle(self, *args, **options):
        # 実行時のYYYYMMDDを取得
        date = datetime.date.today().strftime("%Y%m%d")
        
        # 保存ファイルの相対パス
        backup_folder_path = os.path.join(settings.BACKUP_PATH, 'user_info')
        os.makedirs(backup_folder_path, exist_ok=True)
        
        file_path = os.path.join(backup_folder_path, f'user_info_{date}.csv')

        # create Backup file
        with open(file_path, 'w') as file:
            writer = csv.writer(file)
            
            header = [field.name for field in UserInfo._meta.fields]
            writer.writerow(header)
            
            user_infos = UserInfo.objects.all()
            
            for user_info in user_infos:
                writer.writerow([
                    user_info.id,
                    user_info.account.id,
                    user_info.date,
                    user_info.height,
                    user_info.weight,
                    user_info.metabolism,
                    user_info.body_fat_percentage,
                    user_info.muscle_mass,
                    user_info.target_weight,
                    user_info.target_body_fat_percentage,
                    user_info.target_muscle_mass
                ])
                
        # 古いバックアップの削除
        files = os.listdir(backup_folder_path)
        if len(files) >= settings.NUM_SAVED_BACKUP:
            files.sort()
            os.remove(os.path.join(backup_folder_path, files[0]))
