# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from consumers import consumers  # 소비자(consumer)를 임포트해야 합니다.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'photo.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/some_path/", consumers.MyConsumer.as_asgi()),  # WebSocket 경로와 소비자 연결
        ])
    ),
})
