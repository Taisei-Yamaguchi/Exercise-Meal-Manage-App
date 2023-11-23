# React App Actual

<h1> 開発用:  http://127.0.0.1:8000 </h1>

<br>
<h2>Account</h2>
<br>

<h3>Get (/accounts/get/)</h3>
<p>・ログイン中のアカウントのデータを取得する</p>
<h3>Update (/accounts/update/)</h3>
<p>・アカウントのデータを更新する</p>
<h3>Login (/accounts/login/)</h3>
<p>email,passwordをpostで渡す。成功したら返ってきた、login用tokenをlocalStorageにセットする。</p>
<h3>LogOut (/accounts/logout/)</h3>
<p>ローカルで保存していた認証情報もクリアする</p>
<h3>SignUp (/accounts/signup/)</h3>
<p>新規ユーザーのデータをpostで渡す</p>
<h3>SignUp Confirmation (/accounts/signup-confirmation/)</h3>
<p>SignUp時に送られたeamilのリンクに含まれている、uid,tokenを一緒にpostで渡す</p>
<h3>Password Reset Request (/accounts/reset-password-request/)</h3>
<p>emailをpostで渡す。バックエンドはそのemailアドレスにパスワードリセットリンクを返す</p>
<h3>Passowrd Reset (/accounts/reset-password-confirm/)</h3>
<p>uid,token,new_passwordを渡す。</p>

<br>
<h2>Exercise</h2>
<br>

<h3>Get Workout (/exercise/get-workout/)</h3>
<p>・ログインユーザーのworkoutをget</p>
<h3>Create Workout (/exercise/post-workout/)</h3>
<p>・workout dataをpostで渡す</p>
<h3>Create Exercise (/exercise/post-exercise/)</h3>
<p>exercise　dataをpostで渡す</p>
<h3>Get Exercise By Date (/exercise/get-exercise-date/?date=${date})</h3>
<p>・指定した日付のexerciseをget</p>
<h3>Exercise Delete (/exercise/exercise/delete/${exerciseId}/)</h3>
<p>指定したexerciseのdelete</p>
<h3>Exercise Update (/exercise/exercise/update/${exerciseId}/)</h3>
<p>指定したexerciseIdにおいて、updateDataをputで渡す</p>

<br>
<h2>Meal</h2>
<br>

<br>
<h2>User Info</h2>
<br>

<br>
<h2>Graph</h2>
<br>





