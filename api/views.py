from api.models import Room
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer


class RoomViewSet(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset.first()
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                room_payload = {
                    "guest_can_pause": guest_can_pause,
                    "votes_to_skip": votes_to_skip,
                    "host": host
                }
                room = Room(**room_payload)
                room.save()

            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)


class RoomDetailsView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        if code != None:
            queryset = Room.objects.filter(code=code)
            if len(queryset) > 0:
                room = queryset.first()
                data = RoomSerializer(room).data
                data['is_host'] = self.request.session.session_key == room.host

                return Response(data, status=status.HTTP_200_OK)

            return Response({
                "details": "room not found"
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "details": "invalid code"
        }, status=status.HTTP_400_BAD_REQUEST)
