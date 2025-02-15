"""
Django settings for fantasy_football_project project.

Generated by 'django-admin startproject' using Django 5.0.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import django_heroku
import os
import dj_database_url
import mimetypes
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
load_dotenv()

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
TANK_API_KEY = os.environ.get("TANK_API_KEY")
TANK_API_ENDPOINT = "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com"

DEBUG = False

# AWS access keys
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")

# Cognito vars
AWS_COGNITO_REGION = os.environ.get("AWS_COGNITO_REGION")
AWS_COGNITO_USER_POOL_ID = os.environ.get("AWS_COGNITO_USER_POOL_ID")
AWS_COGNITO_CLIENT_ID = os.environ.get("AWS_COGNITO_CLIENT_ID")
AWS_COGNITO_CLIENT_SECRET = os.environ.get("AWS_COGNITO_CLIENT_SECRET")


ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'computedfields',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'fantasy_football_app',
    'django_extensions',
    "whitenoise.runserver_nostatic",
    'django.contrib.staticfiles',
    'widget_tweaks',
    'waffle',
    'corsheaders',
    'rest_framework',
    'bootstrap5',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'fantasy_football_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build'), BASE_DIR / 'fantasy_football_app' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fantasy_football_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

IS_HEROKU_APP = "DYNO" in os.environ and not "CI" in os.environ

LOGIN_URL = '/login/'

if IS_HEROKU_APP:
    # In production on Heroku the database configuration is derived from the `DATABASE_URL`
    # environment variable by the dj-database-url package. `DATABASE_URL` will be set
    # automatically by Heroku when a database addon is attached to your Heroku app. See:
    # https://devcenter.heroku.com/articles/provisioning-heroku-postgres
    # https://github.com/jazzband/dj-database-url
    DATABASES = {
        "default": dj_database_url.config(),
    }
    DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql_psycopg2'
    CORS_ALLOWED_ORIGINS = [
        'https://fantasy-challenge-2024-59233a8817fc.herokuapp.com',
        'http://playoff-showdown.com',
        'https://playoff-showdown.com',
    ]
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'
else:
    # When running locally in development or in CI, a sqlite database file will be used instead
    # to simplify initial setup. Longer term it's recommended to use Postgres locally too.
    DEBUG = True
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'fantasy_challenge_db',
            'USER': 'postgres',
            'PASSWORD': 'pass',
            'HOST': 'localhost',
            'PORT': '5432'
        }
    }
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",

        "http://localhost:3000",
        "http://127.0.0.1:3000",

        'https://fantasy-challenge-2024-59233a8817fc.herokuapp.com',
        'http://playoff-showdown.com',
        'https://playoff-showdown.com',
    ]
    
    # ---------------------------------------------
    # ---- Auth -----
    # - CORS + CSRF + Cookies settings
    # TODO: this works in local dev right now
    # TODO: need to nail down how itll work in Prod
    # ---------------------------------------------
    CORS_ORIGIN_ALLOW_ALL  = True 
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True  # Allow cookies to be sent with requests

    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",

        "http://localhost:3000",
        "http://127.0.0.1:3000",

        'https://fantasy-challenge-2024-59233a8817fc.herokuapp.com',
        'http://playoff-showdown.com',
        'https://playoff-showdown.com',
    ]

    CSRF_COOKIE_SAMESITE    = None 
    SESSION_COOKIE_SAMESITE = None
    CSRF_COOKIE_HTTPONLY    = False  # False since we will grab it via universal-cookies
    SESSION_COOKIE_HTTPONLY = False
    SESSION_COOKIE_SECURE   = False
    SESSION_COOKIE_SAMESITE = None

    COOKIE_SECURE           = False # True in production, False in development (not DEBUG ? )
    CSRF_COOKIE_SECURE      = False 

    # # TODO: PROD ONLY
    # CSRF_COOKIE_SECURE = True
    # SESSION_COOKIE_SECURE = True
    # ---------------------------------------------

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'fantasy_football_app.backends.CaseInsensitiveModelBackend'
    ]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build/static'), 
    os.path.join(BASE_DIR, 'fantasy_football_app/static'), 
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
django_heroku.settings(locals())

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'fantasy_football_cache',
    }
}
DATABASES['default']['CONN_MAX_AGE'] = 0

COMPUTEDFIELDS_ADMIN = True
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
