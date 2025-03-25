class CourtSerializer:
    def __init__(self, data):
        self.data = data
        self.errors = {}
        self.validated_data = {}

    def is_valid(self):
        required_fields = ["name", "location", "media", "capacity", "operating_hours"]

        for field in required_fields:
            if field not in self.data:
                self.errors[field] = f"{field} is required."

        if "capacity" in self.data and not isinstance(self.data["capacity"], int):
            self.errors["capacity"] = "Capacity must be an integer."

        # Validate operating_hours (must be a dictionary)
        if "operating_hours" in self.data and not isinstance(self.data["operating_hours"], dict):
            self.errors["operating_hours"] = "Operating hours must be a JSON object."

        if self.errors:
            return False  # Data is invalid

        self.validated_data = {
            "name": self.data["name"],
            "location": self.data["location"],
            "media": self.data["media"],
            "capacity": self.data["capacity"],
            "operating_hours": self.data["operating_hours"],
        }
        return True

