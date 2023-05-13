import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  qrCodeData: string = '';
  selectedDate: string = '';
  events: any[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getEvents();
  }

  generateUniqueCode(): string {
    const selectedEvent = this.events.find(e => e.eventName === this.selectedDate);
    if (selectedEvent) {
      const guid = selectedEvent.guid;
      return `${window.location.origin}/location/${guid}`;
    }
    return '';
  }

  generateQRCode() {
    const uniqueCode = this.generateUniqueCode();
    if (uniqueCode) {
      QRCode.toDataURL(uniqueCode, (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        this.qrCodeData = url;
      });
    } else {
      this.qrCodeData = '';
    }
  }

  getEvents() {
    // TODO : make it predicate for current user
    //var username = authservice.getUsername
    this.http.get<Event[]>('/Event').subscribe(
      response => {
        this.events = response;
      },
      error => {
        console.error(error);
      }
    );
  }
}
