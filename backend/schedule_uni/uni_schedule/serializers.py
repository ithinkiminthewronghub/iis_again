from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Course, UserProfile, EducationalActivity, Room, ScheduleActivity


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ('id', 'name', 'annotation', 'number_of_credits', 'year_of_study', 'guarantor', 'teachers', 'students')

class CourseGuarantorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('id', 'guarantor')


class CourseStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('id', 'name', 'annotation', 'number_of_credits', 'year_of_study', 'guarantor', 'teachers')


class CourseReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('id', 'name', 'annotation', 'number_of_credits', 'year_of_study', 'guarantor', 'teachers', 'students')

###################################################################

class UserInfoSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserProfile
        fields = ('user_id', 'username', 'first_name', 'last_name', 'user_type', 'year_of_study')
        read_only_fields = ('user_id', 'username', 'first_name', 'last_name', 'user_type', 'year_of_study')

class UserProfileSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user_type', 'year_of_study', 'first_name', 'last_name', 'username', 'password')


    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = User.objects.create(username=username)
        user.set_password(password)
        user.save()

        profile = UserProfile.objects.create(user=user, **validated_data)

        return profile

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['username'] = instance.user.username
        return data

    def update(self, instance, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)

        instance.user.username = username or instance.user.username
        if password:
            instance.user.set_password(password)
        instance.user.save()

        instance.user_type = validated_data.get('user_type', instance.user_type)
        instance.year_of_study = validated_data.get('year_of_study', instance.year_of_study)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        return instance

    def delete(self, instance):
        instance.user.delete()
        instance.delete()

###################################################################

class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = ('id', 'room_number', 'capacity')

class RoomReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ('id', 'room_number', 'capacity')

###################################################################

class EducationalActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = EducationalActivity
        fields = ('subject', 'activity_type', 'duration', 'repetition', 'optional_requirements',
                  'teachers', 'students')


"""class EducationalActivityGuarantorSerializer(serializers.ModelSerializer):

    class Meta:
        model = EducationalActivity
        fields = '__all__'
        read_only_fields = ('subject', 'id')"""

class EducationalActivityTeacherSerializer(serializers.ModelSerializer):

    class Meta:
        model = EducationalActivity
        fields = '__all__'
        read_only_fields = ('id', 'subject', 'activity_type', 'duration', 'repetition', 'teachers', 'students')

class EducationalActivityStudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = EducationalActivity
        fields = '__all__'
        read_only_fields = ('id', 'subject', 'activity_type', 'duration', 'repetition', 'teachers', 'optional_requirements')

class EducationalActivityReadOnlySerializer(serializers.ModelSerializer):

    class Meta:
        model = EducationalActivity
        fields = '__all__'
        read_only_fields = ('id', 'subject', 'activity_type', 'duration', 'repetition', 'teachers', 'optional_requirements', 'students')

###################################################################

class ScheduleActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = ScheduleActivity
        fields = ('id', 'day_of_week', 'room', 'start_time', 'educational_activity')

"""class ScheduleActivitySchedulerSerializer(serializers.ModelSerializer):

    class Meta:
        model = ScheduleActivity
        fields = '__all__'
        read_only_fields = ('id', 'educational_activity')"""

class ScheduleActivityReadOnlySerializer(serializers.ModelSerializer):

    class Meta:
        model = ScheduleActivity
        fields = '__all__'
        read_only_fields = ('id', 'day_of_week', 'room', 'start_time', 'educational_activity')