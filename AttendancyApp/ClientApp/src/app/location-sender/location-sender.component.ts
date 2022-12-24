import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-location-sender',
  templateUrl: './location-sender.component.html'
})
export class LocationSenderComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Get the current location
      navigator.geolocation.getCurrentPosition((position) => {
      var lat:number = position.coords.latitude;
      const lng:number = position.coords.longitude;
      console.log(lat)
      console.log(lng)
      // Make an HTTP request to the server with the current location
      this.http.post('qrcode', { lat, lng }).subscribe();
      // this.http.get('qrcode').subscribe((response) => {
      //   const jsonData = response;
      //   console.log(jsonData);
      // });
    });
  }

}
