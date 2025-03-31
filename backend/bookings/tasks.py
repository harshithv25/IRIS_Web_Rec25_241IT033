from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from bson import ObjectId

@shared_task
def send_reminder_email(booking_id):
    from .models import Booking  # inside function to avoid circular import
    from users.models import User
    
    booking = Booking.get_one("_id", ObjectId(booking_id))
    if not booking:
        return
    
    user_email = User.get_one("_id", booking["user_id"])["email"]
    subject = "Booking Reminder"
    message = f"Hello {booking['user_id']},\n\nYour booking for {booking['name']} is in 30 minutes. Please be on time!"
    from_email = settings.EMAIL_HOST_USER

    send_mail(subject, message, from_email, [user_email])
    
@shared_task
def send_reminder_email(booking_id):
    from .models import Booking  # inside function to avoid circular import
    from users.models import User
    
    booking = Booking.get_one("_id", ObjectId(booking_id))
    if not booking:
        return
    
    user_email = User.get_one("_id", booking["user_id"])["email"]
    subject = "Booking Reminder"
    message = f"Hello {booking['user_id']},\n\nYour booking for {booking['name']} is in 30 minutes. Please be on time!"
    from_email = settings.EMAIL_HOST_USER

    send_mail(subject, message, from_email, [user_email])
