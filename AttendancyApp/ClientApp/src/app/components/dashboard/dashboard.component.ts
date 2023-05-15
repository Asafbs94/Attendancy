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
  qrCodeData: string;
  uniqueCode: string;
  title: string;
  gpsLocation: any;
  employees = [];
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStoreService,
    private auth: AuthService) {
    this.uniqueCode = this.generateUniqueCode();
  }

  ngOnInit() {
    this.title = "Computer science 101"
    this.generateQRCode(this.uniqueCode);
    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        let fullNameFromToken = this.auth.getFullNameFromToken(); // When refresing the page the observable will be empty so it will take the name from the token.
        this.userFullName = val || fullNameFromToken;
      });
  }

  generateUniqueCode(): string {
    // Here should be an endpoint with Student ID
    let baseUrl = new URL(window.location.href);
    let endpoint = `${baseUrl.origin}/location`;
    console.log(endpoint);
    return endpoint;
  }

  generateQRCode(data: string) {
    QRCode.toDataURL(data, (err, url) => {
      this.qrCodeData = url;
    });

  }
}
