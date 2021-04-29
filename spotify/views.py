from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from requests import Request, post
from musicplayer.settings import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .utils import execute_api_request, pause_song, play_song, update_or_create_user_token, isAuthenticated

from api.models import Room


class AuthURl(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request("GET", "https://accounts.spotify.com/authorize", params={
            "scope": scopes,
            "response_type": "code",
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
        }).prepare().url

        return Response({"url": url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': "authorization_code",
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_token(
        request.session.session_key,
        access_token,
        refresh_token,
        token_type,
        expires_in
    )

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = isAuthenticated(self.request.session.session_key)

        return Response({"details": is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if not room.exists():
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        room = room.first()
        host = room.host

        endpoint = 'player/currently-playing'

        response = execute_api_request(host, endpoint)

        if "error" in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        is_playing = response.get('is_playing')
        progress = response.get('progress_ms')

        duration = item.get("duration_ms")
        album_cover = item.get('album').get('images')[0].get('url')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get("artists")):
            if i > 0:
                artist_string += ","
            artist_string += artist.get('name')

        remaining_secs = duration - progress

        song = {
            "title": item.get("name"),
            "artist": artist_string,
            "duration": duration,
            "progress": progress,
            "remaining": remaining_secs,
            "image_url": album_cover,
            "is_playing": is_playing,
            "votes": 0,
            "id": song_id
        }

        return Response(song, status=status.HTTP_200_OK)


class PauseSong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if self.request.session.session_key == room.host:
            response = pause_song(room.host)
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code).first()
        if self.request.session.session_key == room.host:
            response = play_song(room.host)
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDED)
