# React App Actual

<h1> 開発用:  http://127.0.0.1:8000 </h1>

<br>
<h2>Account</h2>
<br>

<h3>Get ( /accounts/get/ ) </h3>
<p>・ログイン中のアカウントのデータを取得する</p>
<h3>Update ( /accounts/update/ )</h3>
<p>・アカウントのデータを更新する</p>
<h3>Login ( /accounts/login/ )</h3>
<p>・email,passwordをpostで渡す。成功したら返ってきた、login用tokenをlocalStorageにセットする。</p>
<h3>LogOut ( /accounts/logout/ )</h3>
<p>・ローカルで保存していた認証情報もクリアする</p>
<h3>SignUp ( /accounts/signup/ )</h3>
<p>・新規ユーザーのデータをpostで渡す</p>
<h3>SignUp Confirmation ( /accounts/signup-confirmation/ )</h3>
<p>・SignUp時に送られたeamilのリンクに含まれている、uid,tokenを一緒にpostで渡す</p>
<h3>Password Reset Request ( /accounts/reset-password-request/ )</h3>
<p>・emailをpostで渡す。バックエンドはそのemailアドレスにパスワードリセットリンクを返す</p>
<h3>Passowrd Reset ( /accounts/reset-password-confirm/ )</h3>
<p>・uid,token,new_passwordを渡す。</p>

<br>
<h2>Exercise</h2>
<br>

<h3>Get Workout ( /exercise/get-workout/ )</h3>
<p>・ログインユーザーのworkoutをget</p>
<h3>Create Workout ( /exercise/post-workout/ )</h3>
<p>・workout dataをpostで渡す</p>
<h3>Create Exercise ( /exercise/post-exercise/ )</h3>
<p>・exercise　dataをpostで渡す</p>
<h3>Get Exercise By Date ( /exercise/get-exercise-date/?date=${date} )</h3>
<p>・指定した日付のexerciseをget</p>
<h3>Exercise Delete ( /exercise/exercise/delete/${exerciseId}/ )</h3>
<p>・指定したexerciseのdelete</p>
<h3>Exercise Update ( /exercise/exercise/update/${exerciseId}/ )</h3>
<p>・指定したexerciseIdにおいて、updateDataをputで渡す</p>

<br>
<h2>Meal</h2>
<br>

<h3>Food List ( /meal/food/list/ )</h3>
<p>・ログインユーザーのfoodをgetする</p>
<h3>Create Food ( /meal/food/post/ )</h3>
<p>・Food dataをpostで渡す</p>
<h3>Create Meal ( /meal/meal/create/ )</h3>
<p>・meal dataをpostで渡す</p>
<h3>Get Meal By Date ( /meal/meals/date/?meal_date=${date} )</h3>
<p>・指定した日付のmealをget</p>
<h3>Meal Delete ( /meal/meal/delete/${mealId}/ )</h3>
<p>・指定したmealのdelete</p>
<h3>Meal Update ( /meal/meal/update/${meal.id}/ )</h3>
<p>・指定したmealIdにおいて、updateDataをputで渡す</p>
<h3>Food Search ( /meal/meal/food-search/?search_expression=${escapedSearchExpression}/ )</h3>
<p>・search_expressionをpostで渡し、fatsecretのfoodを検索し取得する</p>
<h3>Create Meal With Fatsecret ( /meal/meal/create-with-fatsecret/ ) </h3>
<p>・food searchで取得したfoodをpostで渡す。</p>

<br>
<h2>User Info</h2>
<br>

<h3>UserInfo Create or Update ( /user_info/create-update/ )</h3>
<p>・userInfoをpostで渡す</p>
<h3>Get Latest UserInfo ( /user_info/get-latest/ )</h3>
<p>・ログインユーザーの最新のuser_infoをgetする</p>

<br>
<h2>Graph</h2>
<br>

<h3>Body Fat Percentage Graph ( /graph/body_fat_percentage-graph/ )</h3>
<p>・body fat percentageの日々の変化グラフを作るためのdataをget</p>
<h3>Body Weight Graph ( /graph/weight-graph/ )</h3>
<p>・weightの日々の変化グラフを作るためのdataをget</p>
<h3>Muscle Mass Graph ( /graph/muscle_mass-graph// )</h3>
<p>・muscle massの日々の変化グラフを作るためのdataをget</p>
<h3>Daily Exercise Weight Graph ( /graph/daily-total-weight-graph/?workout_type=${workout_type})</h3>
<p>・指定したworkout_typeの日々の総重量の変化データを取得</p>
<h3>Total Exercise Weight Graph ( /graph/total-weight-graph/ )</h3>
<p>・これまでの全日のworkout_type別総重量と、全部位の重量（grand_total)を取得</p>
<h3>Daily Nutrients Graph ( /graph/daily-nutrients-graph/?date=${date} )</h3>
<p>・指定した日付の各栄養素の合計摂取量のデータを取得</p>
<h3>Cals Graph ( /graph/cals-graph/ )</h3>
<p>・これまでの全日の,intake_cals,consuming_calsのデータを取得</p>




