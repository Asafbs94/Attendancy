
from locust import HttpUser, task, between, events
import json

class EventUser(HttpUser):
    wait_time = between(1, 5)  # Random wait time between requests
    success_requests = []
    failed_requests = []

    @task
    def get_event(self):
        response = self.client.get("/event/username")  # Replace with your endpoint
        self.process_response(response)

    @task
    def create_event(self):
        event_data = {
            "EventName": "Test Event",
            "EventDate": "2023-05-18",
            "EventTime": "10:00",
            "EventDescription": "Test event description",
            "EventLocation": "Yuval, Israel"
        }
        response = self.client.post("/event", json=event_data)  # Replace with your endpoint
        self.process_response(response)

    # Define more tasks for other endpoints like update and delete

    def process_response(self, response):
        if response.ok:
            self.success_requests.append({
                "url": response.request.url,
                "status_code": response.status_code
            })
        else:
            self.failed_requests.append({
                "url": response.request.url,
                "status_code": response.status_code
            })

@events.quitting.add_listener
def write_report(environment, **kwargs):
    report = {
        "success_requests": EventUser.success_requests,
        "failed_requests": EventUser.failed_requests
    }
    with open("load_test_report.json", "w") as file:
        json.dump(report, file, indent=4)

# Running Instructions:
# 1. Install locust by running: pip install locust
# 2. Run the load test by executing the following command:
#    locust -f load_test.py --host=http://localhost:5000  # Replace with your API host
