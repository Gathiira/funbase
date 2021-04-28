from musicplayer.settings import CLIENT_ID, CLIENT_SECRET
from django.utils import timezone
from datetime import timedelta

from requests import post
from .models import SpotifyToken


def get_user_token(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens.first()
    return None


def update_or_create_user_token(session_id, access_token, refresh_token, token_type, expires_in):
    tokens = get_user_token(session_id)

    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if bool(tokens):
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'token_type', 'expires_in'])
    else:
        token_obj = {
            "user": session_id,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": token_type,
            "expires_in": expires_in,
        }
        tokens = SpotifyToken.objects.create(**token_obj)
    return tokens


def isAuthenticated(session_id):
    tokens = get_user_token(session_id)

    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True

    return False


def refresh_spotify_token(session_id):
    tokens = get_user_token(session_id)\

    refresh_token = tokens.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_token(
        session_id, access_token, refresh_token, token_type, expires_in)
