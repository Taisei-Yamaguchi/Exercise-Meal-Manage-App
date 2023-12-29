import os
from .settings_common import BASE_DIR

DEBUG = False

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
ALLOWED_HOSTS =[os.environ.get('ALLOWED_HOSTS')]

STATIC_URL = "static/"
STATIC_ROOT="/usr/share/nginx/html/static"

# Amazon SES 代わりにGmailを使う
# AWS_SES_ACCESS_KEY_ID = os.environ.get("AWS_SES_ACCESS_KEY_ID")
# AWS_SES_SECRET_ACCESS_KEY = os.environ.get("AWS_SES_SECRET_ACCESS_KEY")
# EMAIL_BACKEND ='django_ses.SESBackend'

# # # logging
# LOGGING ={
#     'version':1,
#     'disable_existing_loggers': False,
    
#     # Logger Setting
#     'loggers': {
#         'django':{
#             'handlers':['file'],
#             'level':'INFO',
#         },
#     },
    
#     # handler
#     'handlers':{
#         'file':{
#             'level':'INFO',
#             'class': 'logging.handlers.TimedRotatingFileHandler',
#             'filename':os.path.join(BASE_DIR,'logs/django.log'),
#             'formatter':'prod',
#             'when':'D',
#             'interval':1,
#             'backupCount':7,
#         },
#     },
    
#     'formatters':{
#         'prod':{
#             'format':'\t'.join([
#                 '%(asctime)s',
#                 '[%(levelname)s]',
#                 '%(pathname)s(Line:%(lineno)d)',
#                 '%(message)s'
#             ])
#         }
#     }
# }

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
            'level': "INFO",
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

# CORS
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_ENDPOINT'),
    'https://emma.emmapet.net'
]

# ENDPOINT
FRONTEND_ENDPOINT = 'https://emma.emmapet.net/' #os.environ.get('FRONTEND_ENDPOINT')

CSRF_COOKIE_SAMESITE = None
CORS_ALLOW_CREDENTIALS = True

# SSL
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
