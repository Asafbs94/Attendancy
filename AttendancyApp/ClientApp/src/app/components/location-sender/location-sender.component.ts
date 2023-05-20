import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../../signalr.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-location-sender',
  templateUrl: './location-sender.component.html'
})
export class LocationSenderComponent implements OnInit {
  id: Number;
  email: string = "";
  isSent: boolean = false;

  constructor(private http: HttpClient, public signalrService: SignalrService, private toast: NgToastService) {
    this.signalrService.startConnection();
  }

  ngOnInit(): void {
  }

  sendInformation(): void {
    // Check if email is provided
    const isEmailProvided: boolean = !!this.email;

    if (!this.isSent && isEmailProvided) {
      // Get the current location
      navigator.geolocation.getCurrentPosition((position) => {
        const lat: number = position.coords.latitude;
        const lng: number = position.coords.longitude;

        // Get the URL path
        const urlPath: string = window.location.pathname;

        // Extract the part of the URL path after "/location/"
        const guid: string = urlPath.split('/location/')[1];

        // Prepare the data object for the HTTP request
        const data: any = {
          lat,
          lng,
          guid,
          id: 0, // Set ID to 0
          email: this.email // Use the provided email
        };

        console.log(data);

        // Make an HTTP request to the server with the current location and user data
        this.http.post('QrCode', data).subscribe(
          (response) => {
            console.log('Response:', response);
            this.isSent = true; // Set isSent flag to true
          },
          (error) => {
            this.toast.error({ detail: "ERROR", summary: error.error, duration: 5000 });
            // Handle the error case if needed
          }
        );
      });
    }
  }
}
