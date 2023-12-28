# from .settings_common import *
import os

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-p%--f)6an-r%5&ja&3woh6g*+#2ruc1us0r7*+tvx0=5jj!!s9"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

#setting of LOGGING
LOGGING={
    'version': 1,
    'disable_existing_loggers': False,

    #setting of LOGGER
    'loggers': {
        #logger for django
        'django': {
            'handlers':['console'],
            'level':'INFO',
        },
        #logger for diary app 
        # 'dairy': {
        #     'handlers':['console'],
        #     'level':'DEBUG',
        # },
    },

    #setting of handler
    'handlers': {
        'console': {
            'level': "DEBUG",
            'class': 'logging.StreamHandler',
            'formatter': 'dev'
        },
    },

    #setting of formatters
    'formatters': {
        'dev': {
            'format': '\t'.join([
                '%(asctime)s',
                '[%(levelname)s]',
                '%(pathname)s(LINE:%(lineno)d)',
                '%(message)s'
            ])
        },
    }
}



# CORS
CORS_ALLOWED_ORIGINS = [
    "https://localhost:5173",
    "http://localhost:5173",
]

CSRF_COOKIE_SAMESITE = None
CORS_ALLOW_CREDENTIALS = True

# SSL
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# ENDPOINT
FRONTEND_ENDPOINT = 'http://localhost:5173/'

# EMAIL
# EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend'
# EMAIL_TLS_VERSION = 'TLSv1.2'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "emma",
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST":"",
        "PORT":"",
    }
}

STATIC_URL = "static/"