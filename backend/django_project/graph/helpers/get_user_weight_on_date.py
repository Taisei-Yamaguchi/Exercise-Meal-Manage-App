from user_info.models import UserInfo
from django.db.models import Max,Avg

# カロリー計算　関数1
#指定した日付以前で、最新の体重
def get_user_weight_on_date(user, date):
    # 指定された日付以前の最新のweightを取得
    user_info=UserInfo.objects.filter(account=user, date__lte=date)
    if user_info.exists():
        latest_weight = user_info.aggregate(latest_weight=Max('weight')).get('latest_weight')
    else:
        # user_infoが存在しない場合は、平均値を計算
        avg_weight = UserInfo.objects.filter(account=user).aggregate(avg_weight=Avg('weight')).get('avg_weight')
        # 一度もuser_infoを登録していない場合のデフォルト値（例: 60）
        latest_weight = avg_weight if avg_weight is not None else 60
    return latest_weight
