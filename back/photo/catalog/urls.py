from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'photos', views.PhotoViewSet)

urlpatterns = [
    path('', views.photo_list, name='photo_list'),
    path('photo/<uuid:pk>/', views.photo_detail, name='photo_detail'),
    path('photo/create/', views.photo_create, name='photo_create'),
    
    # REST API 엔드포인트
    path('api/', include(router.urls)),
    # 다운로드 URL은 router가 자동으로 생성 (/api/photos/{pk}/download/)
]