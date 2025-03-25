from pymongo.collection import Collection
import re

class EquipmentSerializer:
    def __init__(self, data):
        self.data = data
        self.errors = {}
        self.validated_data = {}

    def is_valid(self):
        required_fields = ["name", "category", "media", "quantity", "condition"]

        for field in required_fields:
            if field not in self.data:
                self.errors[field] = f"{field} is required."

        # individual fields
        if "name" in self.data and not isinstance(self.data["name"], str):
            self.errors["name"] = "Name must be a string."

        if "category" in self.data and not isinstance(self.data["category"], str):
            self.errors["category"] = "Category must be a string."

        if "media" in self.data and not re.match(r"^(http|https):\/\/", self.data["media"]):
            self.errors["media"] = "Media must be a valid URL."

        if "quantity" in self.data:
            if not isinstance(self.data["quantity"], int) or self.data["quantity"] < 0:
                self.errors["quantity"] = "Quantity must be a positive integer."

        if "condition" in self.data and self.data["condition"] not in ["new", "used", "damaged"]:
            self.errors["condition"] = "Condition must be 'new', 'used', or 'damaged'."

        if self.errors:
            return False  # Data is invalid

        self.validated_data = {
            "name": self.data["name"],
            "category": self.data["category"],
            "media": self.data["media"],
            "quantity": self.data["quantity"],
            "condition": self.data["condition"]
        }
        return True
