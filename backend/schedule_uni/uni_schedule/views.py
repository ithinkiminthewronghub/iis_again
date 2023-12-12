from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import *
from .models import Course, UserProfile, Room, EducationalActivity, ScheduleActivity
from rest_framework_simplejwt.tokens import AccessToken

def get_user_type_by_user_id(user_id):
    try:
        user_profile = UserProfile.objects.get(id=user_id)
        user_type = user_profile.user_type
        return user_type
    except UserProfile.DoesNotExist:
        return None

class UserInfoView(viewsets.ModelViewSet):
    serializer_class = UserInfoSerializer
    
    def get_queryset(self):
        authorization_header = self.request.headers.get('Authorization')
        if authorization_header is None:
            raise ValueError("Authorization header not found.")
        _, token = authorization_header.split()
        decoded_token = AccessToken(token)
        my_user_id = decoded_token['user_id']
        return UserProfile.objects.filter(user_id = my_user_id)
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = UserInfoSerializer(queryset, many=True)
        return Response(serializer.data)

class CourseView(viewsets.ModelViewSet):

    queryset = Course.objects.all()

    def get_serializer_class(self):
        try:
            request = self.request
            authorization_header = request.headers.get('Authorization')
            if authorization_header is None:
                raise ValueError("Authorization header not found.")
            _, token = authorization_header.split()
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
            user_type = get_user_type_by_user_id(user_id)
        except:
            return CourseReadOnlySerializer

        if user_type == 'admin':
            return CourseSerializer
        elif user_type == 'guarantor':
            return CourseGuarantorSerializer
        elif user_type == 'student':
            return CourseStudentSerializer
        else:
            return CourseReadOnlySerializer


class UserProfileViewSet(viewsets.ModelViewSet):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class RoomView(viewsets.ModelViewSet):

    queryset = Room.objects.all()

    def get_serializer_class(self):
        try:
            request = self.request
            authorization_header = request.headers.get('Authorization')
            if authorization_header is None:
                raise ValueError("Authorization header not found.")
            _, token = authorization_header.split()
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
            user_type = get_user_type_by_user_id(user_id)
        except:
            return RoomReadOnlySerializer

        if user_type == 'admin':
            return RoomSerializer
        else:
            return RoomReadOnlySerializer


class EducationalActivityView(viewsets.ModelViewSet):

    queryset = EducationalActivity.objects.all()

    def get_serializer_class(self):
        try:
            request = self.request
            authorization_header = request.headers.get('Authorization')
            if authorization_header is None:
                raise ValueError("Authorization header not found.")
            _, token = authorization_header.split()
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
            user_type = get_user_type_by_user_id(user_id)
        except:
            return EducationalActivityReadOnlySerializer

        if user_type == 'admin' or user_type == 'guarantor':
            return EducationalActivitySerializer
        elif user_type == 'teacher':
            return EducationalActivityTeacherSerializer
        elif user_type == 'student':
            return EducationalActivityStudentSerializer
        else:
            return EducationalActivityReadOnlySerializer


class ScheduleActivityView(viewsets.ModelViewSet):

    queryset = ScheduleActivity.objects.all()

    def get_serializer_class(self):
        try:
            request = self.request
            authorization_header = request.headers.get('Authorization')
            if authorization_header is None:
                raise ValueError("Authorization header not found.")
            _, token = authorization_header.split()
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
            user_type = get_user_type_by_user_id(user_id)
        except:
            return ScheduleActivityReadOnlySerializer

        if user_type == 'admin' or user_type == 'scheduler':
            return ScheduleActivitySerializer
        else:
            return ScheduleActivityReadOnlySerializer