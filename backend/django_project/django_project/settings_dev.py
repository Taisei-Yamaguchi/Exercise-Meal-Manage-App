from .settings_common import *

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
        'dairy': {
            'handlers':['console'],
            'level':'DEBUG',
        },
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

EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend'

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CSRF_COOKIE_SAMESITE = None
CORS_ALLOW_CREDENTIALS = True
