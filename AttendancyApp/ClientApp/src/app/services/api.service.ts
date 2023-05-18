import { Injectable } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private baseUrl: string = "https://localhost:44431/api/QrCode";
  private baseUrl: string = "api/QrCode";

  constructor(private http: HttpClient) { }

  getAllAttendted() {
    return this.http.get(this.baseUrl);
  }
}
