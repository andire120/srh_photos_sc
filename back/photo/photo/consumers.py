# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # WebSocket 연결 시 호출되는 메서드
        self.room_name = "some_room"  # 방 이름 등을 설정
        self.room_group_name = f"chat_{self.room_name}"

        # WebSocket 연결을 수락
        await self.accept()

    async def disconnect(self, close_code):
        # WebSocket 연결 해제 시 호출되는 메서드
        pass

    async def receive(self, text_data):
        # WebSocket으로 메시지를 받았을 때 호출되는 메서드
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # WebSocket으로 메시지를 보냄
        await self.send(text_data=json.dumps({
            "message": message
        }))
