from django.urls import path
from .views import AuthURl, spotify_callback, IsAuthenticated, CurrentSong


urlpatterns = [
    path('get-auth-url', AuthURl.as_view()),
    path('redirect', spotify_callback),
    path('authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
]
