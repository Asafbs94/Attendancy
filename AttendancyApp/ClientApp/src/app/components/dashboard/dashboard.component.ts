import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';
import { style } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public userFullName: string = "";
  public userEmail: string = "";
  public userName: string = "";

  qrCodeData: string = '';
  selectedDate: string = '';
  events: any[] = [];

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStoreService,
    private auth: AuthService) {
  }

  ngOnInit() {
    this.getEvents();
    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        let fullNameFromToken = this.auth.getFullNameFromToken(); // When refresing the page the observable will be empty so it will take the name from the token.
        this.userFullName = val || fullNameFromToken;
      });
    this.userStore.getEmailFromStore()
      .subscribe(val => {
        let emailFromToken = this.auth.getEmailFromToken(); // When refresing the page the observable will be empty so it will take the name from the token.
        this.userEmail = val || emailFromToken;
      });
    this.userStore.getUserNameFromStore()
      .subscribe(val => {
        let userNameFromToken = this.auth.getUserNameFromToken(); // When refresing the page the observable will be empty so it will take the name from the token.
        this.userName = val || userNameFromToken;
      });
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
