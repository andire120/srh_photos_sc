web: cd back/photo && python manage.py runserver 127.0.0.1:$PORT
web: gunicorn --chdir back/photo photo.wsgi