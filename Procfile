release: python back/photo/manage.py collectstatic --noinput
web: gunicorn --chdir back/photo photo.wsgi