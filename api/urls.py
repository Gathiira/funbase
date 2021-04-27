from django.urls import path
from .views import (
    RoomViewSet,
    CreateRoomView,
    RoomDetailsView,
    JoinRoomView,
    UserInRoomView,
    LeaveRoomView,
    UpdateRoomView
)


urlpatterns = [
    path('room', RoomViewSet.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', RoomDetailsView.as_view()),
    path('join-room', JoinRoomView.as_view()),
    path('user-in-room', UserInRoomView.as_view()),
    path('leave-room', LeaveRoomView.as_view()),
    path('update-room', UpdateRoomView.as_view()),
]
