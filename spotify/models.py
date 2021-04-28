from django.db import models


class SpotifyToken(models.Model):
    user = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=1000, unique=True)
    token_type = models.CharField(max_length=255, unique=True)
    refresh_token = models.CharField(max_length=1000, unique=True)
    expires_in = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
