from datetime import datetime
from bson import ObjectId

class BookingSerializer:
    def __init__(self, data):
        self.data = data
        self.errors = {}
        self.validated_data = {}

    def is_valid(self):
        required_fields = ["user_id", "bookable_id", "bookable_type", "start_time", "end_time"]
        
        for field in required_fields:
            if field not in self.data:
                self.errors[field] = f"{field} is required."

        if "bookable_type" in self.data and self.data["bookable_type"] not in ["Equipment", "Court"]:
            self.errors["bookable_type"] = "Invalid bookable type."

        for field in ["start_time", "end_time"]:
            if field in self.data:
                try:
                    datetime.strptime(self.data[field], "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    self.errors[field] = f"{field} must be in 'YYYY-MM-DD HH:MM:SS' format."

        if self.errors:
            return False  # Data is invalid

        self.validated_data = {
            "user_id": ObjectId(self.data["user_id"]),
            "bookable_id": self.data["bookable_id"],
            "bookable_type": self.data["bookable_type"],
            "start_time": datetime.strptime(self.data["start_time"], "%Y-%m-%d %H:%M:%S"),
            "end_time": datetime.strptime(self.data["end_time"], "%Y-%m-%d %H:%M:%S"),
            "valid": self.data.get("valid"),
            "cancel_status": self.data.get("cancel_status"),
            "reason": self.data.get("reason"),
            "expired": self.data.get("expired", False),
        }
        return True