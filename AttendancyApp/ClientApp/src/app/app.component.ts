import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as QRCode from 'qrcode';
import { style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  qrCodeData: string;
  uniqueCode: string;
  title:string;
  employees = [];
  endpoint:string = "https://www.linkedin.com/in/asaf-yosef-ben-shabat/"
  constructor(private http: HttpClient) {
    this.uniqueCode = this.generateUniqueCode();
  }

  ngOnInit() {
    this.title = "Computer science 101"
    this.generateQRCode(this.uniqueCode);
  }

  generateUniqueCode(): string {
    // Here should be an endpoint with Student ID
    return "https://www.linkedin.com/in/asaf-yosef-ben-shabat/";
  }

  generateQRCode(data: string) {
    QRCode.toDataURL(data, (err, url) => {
      this.qrCodeData = url;
    });

  }
}
