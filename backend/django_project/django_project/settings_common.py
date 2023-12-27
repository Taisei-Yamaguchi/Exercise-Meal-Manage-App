"""
Django settings for django_project project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/



# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    "manage_app.apps.ManageAppConfig",
    "accounts.apps.AccountsConfig",
    "meal.apps.MealConfig",
    "user_info.apps.UserInfoConfig",
    "exercise.apps.ExerciseConfig",
    "graph.apps.GraphConfig",
    "main.apps.MainConfig",
    "pet.apps.PetConfig",
    "goal.apps.GoalConfig",
    
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    'allauth.socialaccount',
    'rest_framework',
    'corsheaders',
    'rest_framework.authtoken',
    'django.contrib.postgres',
    'sslserver',
    'django_ses'
]

# django-allauthで利用するdjango.contirb.sitesを使うためにサイト識別用IDを設定
SITE_ID=1

AUTHENTICATION_BACKENDS=(
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
    # 'accounts.backends.CustomUserAuthBackend',
)

# メールアドレス認証に変更する設定
ACCOUNT_AUTHENTICATION_METHOD= 'email'
ACCOUNT_USERNAME_REQUIRED= True

#サインアップにメールアドレス確認を挟むよう設定尾
ACCOUNT_EMAIL_VERIFICATION= 'mandatory'
ACCOUNT_EMAIL_REQUIRED= True
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 1
# ログイン/ログアウトの遷移先を設定
LOGIN_REDIRECT_URL= 'diary:diary_list'
ACCOUNT_LOGOUT_REDIRECT_URL = 'account_login'

#ログアウトリンクのクリック一発でログアウトする設定
ACCOUNT_LOGIN_ON_GET = True

# django-allauthが送信するメールの件名に自動付与される接頭辞をブランクにする設定
ACCOUNT_EMAIL_SUBJECT_PREFIX =''

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    
    'corsheaders.middleware.CorsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = "django_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "django_project.wsgi.application"





# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "America/Vancouver"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"



AUTH_USER_MODEL ="accounts.CustomUser"


CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CSRF_COOKIE_HTTPONLY = False

SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_DB_ALIAS = 'default'  # 使用するデータベースエイリアスを指定（デフォルトは'default'）
SESSION_COOKIE_AGE = 36000  # 15分 × 60秒
SESSION_COOKIE_NAME = 'sessionid'


# これを追加することで認証のエラーが解決した
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        # 他の認証クラスも追加できます
    ],
}

# BACKUP batch
BACKUP_PATH = 'backup/'
NUM_SAVED_BACKUP = 30



# # Gmailを使用してメールを送信するための設定
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587  # GmailのSMTPポート 587
EMAIL_USE_SSL = False  
EMAIL_USE_TLS = True # GmailはTLSを使用するためTrueに設定
EMAIL_HOST_USER = 'aries0326business@gmail.com'  # Gmailのメールアドレス
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = 'aries0326business@gmail.com'#os.environ.get('FROM_EMAIL')