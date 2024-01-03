# EMMA with Pet

## 概要と目的

HealthTrackerは、運動、食事、日々の生活に関連するカロリーバランスと栄養バランスを正確に客観的に把握し、ユーザーがボディメイク、ダイエット、健康維持、増量、減量などに効果的に活用できるように設計されたプロジェクトです。

### 主な目的:

1. **正確なバランスの把握:** プロジェクトはユーザーに対して、摂取カロリーと消費カロリーのバランスを正確に計測し、栄養バランスを把握する手助けをします。

2. **ボディメイクのサポート:** ダイエットや筋力トレーニング、健康管理などの目標に対して、正確なデータをもとにしたサポートを提供します。

3. **バーチャルペット機能:** ユーザーが毎日の記録を続けるため、モチベーション向上のためにバーチャルペット機能を搭載しています。ユーザーの記録状況に応じてペットが成長し、ユーザーとの絆を深めます。

### 期待される利用シーン:

- ボディメイクを目指すユーザー
- ダイエットを行いたいユーザー
- 健康を維持・向上させたいユーザー
- カロリー摂取と消費の正確な記録を欲しいユーザー
- バーチャルペットを通じてモチベーションを維持したいユーザー

## システムと要件:

- Python
- Django
- Javascript
- React (vite)
- tailwind
- PostgreSQL

## 環境設定：

### 環境変数:
<!-- PostgreSQL -->
- export DB_USER
- export DB_PASSWORD
<!-- FatSecret -->
- export FOOD_API_CONSUMER_KEY
- export FOOD_API_CONSUMER_SECRET
<!-- Gmail -->
- export EMAIL_HOST_PASSWORD
<!-- React url -->
- export FRONTEND_ENDPOINT
<!-- Django -->
- export ALLOWED_HOSTS
- export DJANGO_SECRET_KEY

### 必要操作：
1. cd frontend/react-app-actual
- npm i
- 他 install (package.json参照)
- npm run build
- 起動

2. postgresql 設定　DB_NAME=emma

3. venv作成。activate
4. cd backend/django_project
- django install
- 他 install (settings_common.py参照)
- migrate
- 起動

## ユーザーの役割:

Meal,Exercise,UserInfo,Goalを入力。自分の目的と照らし合わせて、グラフなどを参考に客観的に自分の食事、運動習慣を見ることができる。また、ペットを育てるゲーム性も兼ね備えている。

## Bakcend:
<hr></hr>

## accounts 
### 1. Signup
- **Endpoint:** `/accounts/signup/`
- **役割:** ユーザーが新しいアカウントを作成するためのエンドポイント。

### 2. Signup Email Confirm
- **Endpoint:** `/accounts/signup-confirmation`
- **役割:** ユーザーがサインアップを確認し、アカウントを有効化するためのエンドポイント。uid,tokenを渡す必要がある。

### 3. Login
- **Endpoint:** `/accounts/login/`
- **役割:** ユーザーがアカウントにログインするためのエンドポイント。email(username),passwordでログイン。セッションにユーザーを登録し、tokenを発行。

### 4. Logout
- **Endpoint:** `/accounts/logout/`
- **役割:** ユーザーがアカウントからログアウトするためのエンドポイント。セッションからユーザーを削除し、tokenを無効にする。

### 5. Password Reset Request
- **Endpoint:** `/accounts/reset-password-request/`
- **役割:** ユーザーがパスワードリセットのリクエストを送信するためのエンドポイント。

### 6. Password Reset
- **Endpoint:** `/accounts/reset-password-confirm/`
- **役割:** ユーザーがパスワードをリセットするためのエンドポイント。uid,token,new_passwordを渡す。

### 7. Get Account
- **Endpoint:** `/accounts/get/`
- **役割:** 認証済みユーザーが自分のアカウント情報を取得するためのエンドポイント。

### 8. Update Account
- **Endpoint:** `/accounts/update/`
- **役割:** 認証済みユーザーが自分のアカウント情報を更新するためのエンドポイント。

### CustomUser Model
- ユーザーに関する基本情報を保持するデフォルトのDjangoユーザーモデル。email_checkがfalseだと利用できない。

### *
- 認証が必要な機能をログインで発行されたtokenをfrontendから渡してユーザーを識別。

<hr></hr>

## exercise
### 1. Get Workout
- **Endpoint:** `/exercise/get-workout/`
- **View:** `WorkoutListView`
- **役割:** 保存されたワークアウト情報を取得するためのエンドポイント。一緒にdefault_workoutのリストも返す。

### 2. Post Workout
- **Endpoint:** `/exrcise/post-workout/`
- **View:** `WorkoutCreateView`
- **役割:** 新しいワークアウト情報を作成するためのエンドポイント。

### 3. Post Exercise
- **Endpoint:** `/exercise/post-exercise/`
- **View:** `ExerciseCreateView`
- **役割:** 新しいエクササイズ情報を作成するためのエンドポイント。default_workout あるいは、workoutモデルから選んで作成。

### 4. Get Exercise by Date
- **Endpoint:** `/exercise/get-exercise-date/`
- **View:** `ExerciseGetByDateView`
- **役割:** 指定された日付のエクササイズ情報を取得するためのエンドポイント。

### 5. Exercise Update
- **Endpoint:** `/exercise/exercise/update/<int:exercise_id>/`
- **View:** `ExerciseUpdateView`
- **役割:** 特定のエクササイズ情報を更新するためのエンドポイント。

### 6. Exercise Delete
- **Endpoint:** `/exercise/exercise/delete/<int:pk>/`
- **View:** `ExerciseDeleteView`
- **役割:** 特定のエクササイズ情報を削除するためのエンドポイント。

### 7. Get Latest Exercise
- **Endpoint:** `/exercise/get-latest-exercise/`
- **View:** `GetLatestExerciseByTypeView`
- **役割:** 各エクササイズタイプごとの最新のエクササイズ情報を取得するためのエンドポイント。

### 8. Create Latest Exercise
- **Endpoint:** `/exercise/create-latest-exercise/`
- **View:** `CreateExercisesWithLatestHistoryByType`
- **役割:** 各エクササイズタイプの最新のエクササイズ情報を元に新しいエクササイズを作成するためのエンドポイント。

### Workout Model
workoutを登録。is_defaultフィールドでdefault_workoutか判別。
### Exercise Model
workoutモデルを使って、exerciseを登録。default_workoutもworkoutモデルに登録してから利用。


<hr></hr>

## meal

### 1. Food Post
- **Endpoint:** `/meal/food/post/`
- **View:** `FoodPostView`
- **役割:** foodを投稿するためのエンドポイント。

### 2. Food List
- **Endpoint:** `/meal/food/list/`
- **View:** `FoodListView`
- **役割:** 保存されたFoodのリストを取得するためのエンドポイント。

### 3. Meal Create
- **Endpoint:** `/meal/meal/create/`
- **View:** `MealCreateView`
- **役割:** Foodを使って、Mealを作成するためのエンドポイント。

### 4. Meals by Date
- **Endpoint:** `/meal/meals/date/`
- **View:** `MealByDateView`
- **役割:** 指定された日付のMealを取得するためのエンドポイント。

### 5. Meal Update
- **Endpoint:** `/meal/meal/update/<int:meal_id>/`
- **View:** `MealUpdateView`
- **役割:** 特定のMeal情報を更新するためのエンドポイント。

### 6. Meal Delete
- **Endpoint:** `/meal/meal/delete/<int:pk>/`
- **View:** `MealDeleteView`
- **役割:** 特定のMeal情報を削除するためのエンドポイント。

### 7. Meal Food Search
- **Endpoint:** `/meal/meal/food-search/`
- **View:** `FatSecretSearchAPIView`
- **役割:** FatSecret Open APIを使用して食材を検索するためのエンドポイント。＆ | 検索ができる。検索結果を整理してリストで返す。

### 8. Meal Create with FatSecret
- **Endpoint:** `/meal/meal/create-with-fatsecret/`
- **View:** `MealCreateWithFatSecretView`
- **役割:** FatSecret 検索で取得したデータを使用して新しいMealを作成するためのエンドポイント。このとき、is_open_api=trueのFoodを作成してそれを利用する。 

### 9. Get Searched Food History
- **Endpoint:** `/meal/food/get-searched-food-history/`
- **View:** `GetSearchedFoodHistoryView`
- **役割:** 検索されて登録されたFoodの履歴を新しい順で取得するためのエンドポイント。

### 10. Get Latest Meals
- **Endpoint:** `/meal/meal/latest-meals/`
- **View:** `GetLatestMealsByType`
- **役割:** 各食事タイプの最新のMeal情報を取得するためのエンドポイント。

### 11. Create Latest Meals
- **Endpoint:** `/meal/meal/create-latest/`
- **View:** `CreateMealsWithLatestHistoryByType`
- **役割:** 各食事タイプの最新のMeal情報を元に新しいMealを作成するためのエンドポイント。

### Food Model
- Foodを登録。is_open_apiで、FatSecret API 検索 により取得したfoodかを判別する。

### Meal Model
- Foodを使ってMealを登録。

<hr></hr>

## user_info

### 1. Create or Update UserInfo
- **ENDPOINT:** `/user_info/create-update/`
- **役割:** User Infoを作成する。もし、同日(dateフィールド)すでに登録してる場合、新規作成ではなくupdateする。weight,height,metabolismは必須だが、metabolismが渡されなかった場合、height,weight,account.sex,accountbirthdayから計算して代入。

### 2. Get Latest UserInfo
- **ENDPOINT:** `/user_info/get-latest/`
- **役割:** dateが最新のUseInfoを返す。

### UserInfo Model
- userの身体情報等を登録。グラフ作成などに利用。

<hr></hr>

## goal

### 1. Create or Update Goal
- **ENDPOINT:** `/goal/create-update/`
- **役割:** Goalを作成する。すでにデータがある場合、更新する。

### 2. Get Goal
- **ENDPOINT:** `/goal/get/`
- **役割:** Goalを取得。

### Goal Model
- userのGoalを登録。主にグラフ作成時に利用。

<hr></hr>

## pet
### 1. Get Pet , Create Pet every day.
- **ENDPOINT:** `/pet/get-pet/`
- **役割:** pet_dateにおける、meal,exercise,user_infoを参考にgrow,body_statusフィールドを指定してPetを作成。すでにその日(pet_date)において、Petを作成していた場合getする。
<br>

### Pet Model
- userのPetを登録。body_status,growに応じてfrontで表示するPetの見た目を変える。

## main
### 1. Registration Status
- **ENDPOINT:** `/main/registration-status-check/`
- **役割:** 日付別にmeal,exerciseを登録してるかどうかのデータをリストで返す。

### 2. Cals by Date
- **ENDPOINT:** `/main/cals-by-date/`
- **役割:** 指定した日付のカロリーデータ(intake_cals,food_cals,bm_cals,exercise_cals)を返す。

### 3. PFC by Date
- **ENDPOINT:** `/main/pfc-by-date/`
- **役割:** 指定した日付のprotein,fat,carbohydrate量を返す。

<hr></hr>

## graph

### 1. Weight Graph
- **Endpoint:** `/graph/weight-graph/`
- **View:** `WeightDataAPIView`
- **役割:** UserInfoモデルのweightデータをdateべつに返すためのエンドポイント。登録してない日のデータは直前のデータを利用。

### 2. Body Fat Percentage Graph
- **Endpoint:** `/graph/body_fat_percentage-graph/`
- **View:** `BodyFatDataAPIView`
- **役割:** UserInfoモデルのbody_fat_percentageデータをdateべつに返すためのエンドポイント。登録してない日のデータは直前のデータを利用。

### 3. Muscle Mass Graph
- **Endpoint:** `/graph/muscle_mass-graph/`
- **View:** `MuscleMassDataAPIView`
- **役割:** UserInfoモデルのmuscle_massデータをdateべつに返すためのエンドポイント。登録してない日のデータは直前のデータを利用。

### 4. Total Weight Graph
- **Endpoint:** `/graph/total-weight-graph/`
- **View:** `ExerciseTotalWeightGraphDataAPIView`
- **役割:** 部位別にexercise weight総重量のデータを返す。

### 5. Daily Nutrients Graph
- **Endpoint:** `/graph/daily-nutrients-graph/`
- **View:** `DailyNutrientsGraphDataAPIView`
- **役割:** 指定した日付の摂取栄養データを返す。

### 6. Daily Total Weight Graph
- **Endpoint:** `/graph/daily-total-weight-graph/`
- **View:** `DailyExerciseWeightGraphDataAPIView`
- **役割:** 指定した部位において、日別トータル重量データを返すためのエンドポイント。

### 7. Calories Graph
- **Endpoint:** `/graph/cals-graph/`
- **View:** `CalGraphAPIView`
- **役割:** 日別カロリーデータ(intake_cals,food_cals,exercise_cals,bm_cals)を返すためのエンドポイント。

<hr></hr><hr></hr>

## Frontend:
### 1. Account
- component/account/Logout
- pages/auth/Login
- pages/auth/SignUp
- pages/auth/SignUpConfirmation
- pages/auth/PasswordReset
- pages/auth/PasswordResetRequest
- pages/SettingsAccount
- *Loginで取得したtokenはlocalstorageに保存。Logoutで削除。

### 2. Calendar
- components/MainCalendar: main/registration-status-check/で取得したデータをカレンダーに反映。meal,exerciseそれぞれについて、入力がある日は ☑️。

### 3. Dashboard
- pages/Dashboard
- components/dashbord/pet/Pet: pet/getで取得した pet データに応じた画像をレンダリング。

### 4. Meal
- pages/meal/MealsByDate: クエリで指定したdateで取得。
- components/meal/meal-nav/MealNavigation
- components/meal/meal-nav/PFCByDate:PFCの量と、バランス比を示す横バーグラフ。
- components/meal/FoodCreate
- components/meal/FoodSearch: search expressionをバックエンドに渡すと検索結果が取得できる。そのfoodを利用してmeal登録できる。
- components/meal/LatestMealsByType
- components/meal/MealCreateForm
- components/meal/MealCreateWithHistory: 検索履歴からmeal作成
- components/meal/MealDelete
- components/meal/MealUpdate

### 5. Exercise
- pages/exercise/ExerciseByDate: クエリでしていした日付のexerciseを取得。
- pages/exercise/ExerciseTotalWeightGraph: exerciseの総重量を部位別に棒グラフで表示。全部位の総量も表示。
- pages/exercise/DailyExerciseWeightGraph: クエリで指定したtypeの日別重量を棒グラフで表示。
- components/exercise/exercise-nav/ExerciseNavigation
- components/exercise/ExerciseCreate
- components/exercise/ExerciseDelete
- components/exercise/ExerciseLivingCreate: workout_type=Livingのものを使ってexerciseを作成。mets,durationminutesのみを渡す。
- components/exercise/ExerciseLivingUpdate: workout_type=Livingのexerciseを更新。durationminutesのみを渡す。
- components/exercise/ExerciseUpdate
- components/exercise/LatestExerciseByType: type別に最新のexerciseを取得。ワンクリックで再利用。
- components/exercise/WorkoutCreate

### 6. Goal
- components/goal/GoalNavigation
- pages/goal/Goal: userのgoalを取得しformにレンダリング。更新できる。

### 7. User Info
- components/user_info/user_info-nav/UserInfoNavigation
- pages/user_info/UserInfo:最新のuser_infoを取得しformにレンダリング。作成、更新できる。
- pages/user_info/BodyFatPercentageGraph: body_fat_percentageの変化を表す折れ線グラフ。goal_body_fatもグラフに描画。
- pages/user_info/MuscleMassGraph: muscle_massの変化を表す折れ線グラフ。goal_muscle_massもグラフに描画。
- pages/user_info/WeightGraph: weightの変化を表す折れ線グラフ。goal_weightもグラフに描画。
- pages/user_info/CalsGraph: カロリーバランスの変遷を表すグラフ。intake_calsは折れ線。exercise_cals,food_cals,bm_calsからなるconsuming_calsはstackされた棒グラフ。

### 8. Sub
- components/sub/NavCalendar: meal,exerciseのnavで利用。useParamsでcolorを渡して色を変える。
- components/sub/CalsByDate: meal,exercise のnavで使う。指定した日付のintake_cals,exercise_cals,bm_cals,food_calsおよび、goal_intake,goal_consumingをグラフに描画。

### 9. Helper
- helpers/getCookie
- helpers/getToday
- helpers/useAuthCheck: 認証が必要なページファイルの冒頭で実行。localstorageのauthTokenの有無を確認。

### 10. Redux
- redux/store/ToastSlice
- redux/store/LoadingSlice 




## Reference:
### 1. Fat Secret API

- **概要:** 食品検索機能の実装に使用。
- **リンク:** [Fat Secret API](https://platform.fatsecret.com/platform-api)

### 2. Figma

- **概要:** ペットイラストのデザインに使用。

### 3. Icooon-mono

- **概要:** フリーアイコンの利用に使用。
- **リンク:** [Icooon-mono](https://icooon-mono.com/)

### 4. tailwind

- **概要:** tailwindに使用。
- **リンク:** [tailwindcss](https://tailwindcss.com/)

### 5. tailwind

- **概要:** tailwindに使用。
- **リンク:** [daisyUI](https://daisyui.com/)

### 6. Xserver

- **概要:** ドメイン取得に使用。
- **リンク:** [Xserver](https://www.xserver.ne.jp/)

### 7. AWS EC2

- **概要:** アプリケーションのデプロイに使用。
- **リンク:** [Amazon EC2](https://aws.amazon.com/ec2/)

### 8. Let's Encrypt

- **概要:** SSL証明書の取得に使用。






© 2024 EMMA with Pet Contributors