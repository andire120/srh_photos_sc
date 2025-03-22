"""
URL configuration for photo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib.staticfiles.views import serve
from django.contrib import admin
from django.http import FileResponse
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static

def serve_manifest(request):
    # React 빌드 폴더 내 manifest.json 위치 지정
    file_path = os.path.join(settings.BASE_DIR, 'frontend/build/manifest.json')
    return FileResponse(open(file_path, 'rb'), content_type='application/json')

def serve_logo(request):
    # 로고 파일 위치 지정
    file_path = os.path.join(settings.BASE_DIR, 'frontend/build/spamlogo.png')
    return FileResponse(open(file_path, 'rb'), content_type='image/png')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('catalog.urls')),  # API 경로

    # 다른 모든 경로는 React 앱으로 라우팅
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^(?P<path>manifest\.json|favicon\.ico|logo192\.png|logo512\.png|robots\.txt|spamlogo\.ico)$',
            TemplateView.as_view(template_name='index.html')),
    
    path('manifest.json', 
        TemplateView.as_view(
            template_name='manifest.json', 
            content_type='application/json'
        )),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
    path('manifest.json', serve_manifest),
    path('spamlogo.png', serve_logo),
    path('spamlogo2.png', serve_logo),

]

# 개발 환경에서 미디어 파일 서빙 설정
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()