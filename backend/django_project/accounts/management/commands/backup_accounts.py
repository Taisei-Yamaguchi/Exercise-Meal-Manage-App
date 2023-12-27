import csv
import datetime
import os

from django.conf import settings
from django.core.management.base import BaseCommand
from ...models import CustomUser

class Command(BaseCommand):
    help = "Backup Accounts Data"
    
    def handle(self, *args, **options):
        # 実行時のYYYYMMDDを取得
        date = datetime.date.today().strftime("%Y%m%d")
        
        # 保存ファイルの相対パス
        backup_folder_path = os.path.join(settings.BACKUP_PATH, 'accounts')
        os.makedirs(backup_folder_path, exist_ok=True)
        
        file_path = os.path.join(backup_folder_path, f'accounts_{date}.csv')

        # create Backup file
        with open(file_path, 'w') as file:
            writer = csv.writer(file)
            
            header = [field.name for field in CustomUser._meta.fields]
            writer.writerow(header)
            
            # CustomUserの全データを取得
            accounts = CustomUser.objects.all()
            
            for account in accounts:
                writer.writerow([
                    account.id,
                    account.last_login,
                    account.is_superuser,
                    account.username,
                    account.first_name,
                    account.last_name,
                    account.is_staff,
                    account.is_active,
                    account.date_joined,
                    account.name,
                    account.email,
                    account.password,
                    account.birthday,
                    account.sex,
                    account.picture,
                    account.email_check,
                    account.password_reset_sent,
                ])
                
        # 古いバックアップの削除
        files = os.listdir(backup_folder_path)
        if len(files) >= settings.NUM_SAVED_BACKUP:
            files.sort()
            os.remove(os.path.join(backup_folder_path, files[0]))
