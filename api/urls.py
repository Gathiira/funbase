from django.urls import path
from .views import RoomViewSet, CreateRoomView


urlpatterns = [
    path('room', RoomViewSet.as_view()),
    path('create-room', CreateRoomView.as_view()),
]
