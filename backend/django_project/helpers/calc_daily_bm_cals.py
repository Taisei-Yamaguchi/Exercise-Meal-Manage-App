from user_info.models import UserInfo
from django.db.models import Max

# その日の基礎代謝計算
def calc_daily_bm_cals(user,date):
    metabolism_info = UserInfo.objects.filter(account=user,date=date).values('metabolism').first()
    
    if metabolism_info is not None:
        return metabolism_info['metabolism']
    else:
        # 指定した日付より前の最新の基礎代謝を取得
        latest_metabolism = UserInfo.objects.filter(account=user, date__lt=date).aggregate(Max('date'))

        if latest_metabolism['date__max'] is not None:
            latest_metabolism_data = UserInfo.objects.filter(account=user, date=latest_metabolism['date__max']).first()
            return latest_metabolism_data.metabolism
        else:
            # 過去のデータも存在しない場合はデフォルトで1500を返す
            return 1500