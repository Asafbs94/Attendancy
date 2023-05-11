import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../../signalr.service';

@Component({
  selector: 'app-location-sender',
  templateUrl: './location-sender.component.html'
})
export class LocationSenderComponent implements OnInit {

  constructor(private http: HttpClient, public signalrService: SignalrService) {
    this.signalrService.startConnection();
  }

  ngOnInit(): void {
    // Get the current location
    navigator.geolocation.getCurrentPosition((position) => {
      var lat: number = position.coords.latitude;
      const lng: number = position.coords.longitude;
      const StudentID: string = "312391774";
      console.log(lat)
      console.log(lng)
      // Make an HTTP request to the server with the current location
      this.http.post('qrcode', { StudentID, lat, lng }).subscribe();
      // this.http.get('qrcode').subscribe((response) => {
      //   const jsonData = response;
      //   console.log(jsonData);
      // });
    });
  }

}
