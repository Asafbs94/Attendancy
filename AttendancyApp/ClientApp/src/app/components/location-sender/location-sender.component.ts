import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../../signalr.service';

@Component({
  selector: 'app-location-sender',
  templateUrl: './location-sender.component.html'
})
export class LocationSenderComponent implements OnInit {
  id: Number = 0;
  email: string = "";
  isSent: boolean = false;

  constructor(private http: HttpClient, public signalrService: SignalrService) {
    this.signalrService.startConnection();
  }

  ngOnInit(): void {
  }

  sendInformation(): void {
    // Check if ID or email is provided
    const isIdProvided: boolean = !!this.id;
    const isEmailProvided: boolean = !!this.email;

    if (!this.isSent && (isIdProvided || isEmailProvided)) {
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
          guid
        };

        if (isIdProvided) {
          data.id = this.id;
        }

        if (isEmailProvided) {
          data.email = this.email;
        }

        console.log(data);

        // Make an HTTP request to the server with the current location and user data
        this.http.post('QrCode', data).subscribe(() => {
          this.isSent = true; // Set isSent flag to true
        });
      });
    }
  }
}
