import os
from django.http import FileResponse
from django.urls import path, include, re_path
from . import views
from rest_framework.routers import DefaultRouter
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'photos', views.PhotoViewSet)

def serve_manifest(request):
    file_path = os.path.join(settings.BASE_DIR, '/front/public/manifest.json')
    return FileResponse(open(file_path, 'rb'), content_type='application/json')

def serve_logo(request, filename=None):
    if filename is None:
        if 'spamlogo.png' in request.path:
            filename = 'spamlogo.png'
        elif 'spamlogo2.png' in request.path:
            filename = 'spamlogo2.png'
        else:
            from django.http import Http404
            raise Http404("No filename specified")
    
    import os
    import logging
    logger = logging.getLogger(__name__)
    
    cwd = os.getcwd()
    logger.error(f"Current working directory: {cwd}")
    
    try:
        files = os.listdir(cwd)
        logger.error(f"Files in current directory: {files}")
    except Exception as e:
        logger.error(f"Error listing files: {e}")
    
    possible_paths = [
        '/front/public/' + filename,
        '/app/front/public/' + filename,
        os.path.join(cwd, 'front', 'public', filename),
        os.path.join(cwd, '..', 'front', 'public', filename),
        os.path.join(cwd, '..', '..', 'front', 'public', filename),
    ]
    
    logger.error(f"Trying paths: {possible_paths}")
    
    for path in possible_paths:
        if os.path.exists(path):
            logger.error(f"Found file at: {path}")
            return FileResponse(open(path, 'rb'))
        else:
            logger.error(f"File not found at: {path}")
    
    from django.http import Http404
    raise Http404(f"Image file {filename} not found. Tried multiple locations.")

urlpatterns = [
    # API 엔드포인트 (하나의 명확한 경로로 통합)
    path('api/', include(router.urls)),  # 이것이 /api/photos/ 엔드포인트를 생성합니다
    path('api/upload/', views.upload_photo, name='upload_photo'),
    path('api/date/', views.get_current_date, name='get_current_date'),
    path('api/current-date/', views.get_current_date, name='current_date'),
    path('api/some-endpoint/', views.some_endpoint, name='some_endpoint'),

    # 정적 파일 경로
    path('manifest.json', serve_manifest),
    path('spamlogo.png', serve_logo, {'filename': 'spamlogo.png'}),
    path('spamlogo2.png', serve_logo, {'filename': 'spamlogo2.png'}),
    
    # 기본 뷰 경로
    path('', views.photo_list, name='photo_list'),
    path('photo/<uuid:pk>/', views.photo_detail, name='photo_detail'),
    path('photo/<int:pk>/', views.photo_detail, name='photo_detail'),
    path('photo/create/', views.photo_create, name='photo_create'),
    
    # catch-all 패턴은 가장 마지막에 정의
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# 정적 파일 설정
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()
