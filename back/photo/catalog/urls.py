from django.urls import path, include, re_path
from . import views
from rest_framework.routers import DefaultRouter
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'photos', views.PhotoViewSet)

urlpatterns = [
    path('', views.photo_list, name='photo_list'),
    path('photo/<uuid:pk>/', views.photo_detail, name='photo_detail'),
    path('photo/create/', views.photo_create, name='photo_create'),
    
    # REST API 엔드포인트
    path('api/', include(router.urls)),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
    # 다운로드 URL은 router가 자동으로 생성 (/api/photos/{pk}/download/)
    path('api/current-date/', views.get_current_date, name='current_date'),
]