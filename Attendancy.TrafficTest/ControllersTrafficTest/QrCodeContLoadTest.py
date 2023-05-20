
from locust import HttpUser, task, between

class QrCodeUser(HttpUser):
    wait_time = between(1, 5)  # Random wait time between requests

    @task
    def post_qrcode(self):
        headers = {'Content-Type': 'application/json'}
        data ={
                "lat": 33.24570382392669,
                "lng": 35.59545349034977,
                 "id": 0,
                 "email": "string",
                "guid": "C21C7DDA-00C8-4C5A-A980-6398A33C2165"
}

        self.client.post("/qrCode", json=data, headers=headers)

# Running Instructions:
# 1. Install locust by running: pip install locust
# 2. Save this script to a file, e.g., qr_code_load_test.py
# 3. Open a command prompt and navigate to the directory where the file is located
# 4. Start the Locust load test by running the following command:
#    locust -f qr_code_load_test.py --host=http://localhost:5000  # Replace with your API host
# 5. Open a web browser and visit http://localhost:8089 to access the Locust web interface
# 6. Enter the number of total users, the spawn rate, and click the "Start swarming" button to start the load test
