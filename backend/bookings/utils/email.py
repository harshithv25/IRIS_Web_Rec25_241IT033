from django.core.mail import send_mail
from django.conf import settings

def notify_admin(admin_email, booking):
    """Notify the admin when a user creates a booking."""
    subject = "New Booking Alert"
    message = f"New booking made by {booking['user_id']} for {booking['name']}. Please log in to validate the booking."
    send_mail(subject, message, settings.EMAIL_HOST_USER, [admin_email])

def send_booking_confirmation(user_email, booking):
    """Notify the user when an admin validates their booking."""
    subject = "Booking Confirmed"
    message = f"Hello {booking['user_id']},\n\nYour booking for {booking['name']} has been validated by the admin.\n\nThank you!"
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user_email])

def notify_waitlist_promotion(user_email, booking):
    """Notify the next-in-line user when they get promoted from the waitlist."""
    subject = "Booking Available!"
    message = f"Hello,\n\nA slot has opened up for {booking['name']}. Your booking is now confirmed!\n\nThank you!"
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user_email])

def notify_admin_cancellation(admin_email, booking):
    """Notify the admin when a user cancels their booking."""
    subject = "Booking Cancelled"
    message = f"The user {booking['user_id']} has cancelled their booking for {booking['name']}."
    send_mail(subject, message, settings.EMAIL_HOST_USER, [admin_email])
