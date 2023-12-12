from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Course(models.Model):

    name = models.CharField(max_length=255, unique=True)
    annotation = models.TextField()
    number_of_credits = models.IntegerField()
    year_of_study = models.IntegerField()
    guarantor = models.ForeignKey(User, related_name='guaranteed_courses', on_delete=models.CASCADE)
    teachers = models.ManyToManyField(User, related_name='courses_as_teacher')
    students = models.ManyToManyField(User, related_name='courses_as_student')


class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=50)
    year_of_study = models.IntegerField(blank=True, null=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)


class Room(models.Model):

    room_number = models.CharField(max_length=100, unique=True)
    capacity = models.IntegerField()


class EducationalActivity(models.Model):

    subject = models.ForeignKey(Course, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()
    repetition_choices = [
        ('Every Week', 'Every Week'),
        ('Even Week', 'Even Week'),
        ('Odd Week', 'Odd Week'),
        ('One-Time Activity', 'One-Time Activity')
    ]
    repetition = models.CharField(max_length=20, choices=repetition_choices)
    optional_requirements = models.TextField(blank=True)
    teachers = models.ManyToManyField(User, related_name='educational_activities_as_teacher')
    students = models.ManyToManyField(User, related_name='educational_activities_as_student')


class ScheduleActivity(models.Model):

    day_choices=[
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
    ]
    day_of_week = models.CharField(max_length=20, choices=day_choices)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    start_time = models.TimeField()
    educational_activity = models.ForeignKey(EducationalActivity, on_delete=models.CASCADE)