from django.urls import path
from .views import RoomViewSet, CreateRoomView, RoomDetailsView


urlpatterns = [
    path('room', RoomViewSet.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', RoomDetailsView.as_view()),
]
