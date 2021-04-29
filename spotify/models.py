from api.models import Room
from django.db import models


class SpotifyToken(models.Model):
    user = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=1000, unique=True)
    token_type = models.CharField(max_length=255, unique=True)
    refresh_token = models.CharField(max_length=1000, unique=True)
    expires_in = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


class Votes(models.Model):
    user = models.CharField(max_length=255, unique=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    song_id = models.CharField(max_length=255)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
