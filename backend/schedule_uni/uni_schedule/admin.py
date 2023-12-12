from django.contrib import admin
from .models import Course, UserProfile, Room, EducationalActivity, ScheduleActivity


class EducationalActivityInline(admin.TabularInline):
    model = EducationalActivity.teachers.through
    extra = 1


class StudentInline(admin.TabularInline):
    model = Course.students.through
    extra = 1


class TeacherInline(admin.TabularInline):
    model = Course.teachers.through
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    inlines = [StudentInline, TeacherInline]

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'first_name', 'last_name')


@admin.register(EducationalActivity)
class EducationalActivityAdmin(admin.ModelAdmin):
    inlines = [EducationalActivityInline]
    filter_horizontal = ('teachers', 'students')


@admin.register(ScheduleActivity)
class ScheduleActivityAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'room', 'start_time', 'educational_activity')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'capacity')
