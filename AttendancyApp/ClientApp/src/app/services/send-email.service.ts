import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendEmailModel } from '../models/send-email-model.model';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  private baseUrl: string = "/api/User";

  constructor(private http: HttpClient) { }

  // sendEmail(sendEmailObj: SendEmailModel) {
  //   return this.http.post(`${this.baseUrl}/send-email`, sendEmailObj);
  // }

  sendInvitationEmail(sendEmailObj: SendEmailModel) {
    return this.http.post(`${this.baseUrl}/send-email/invitation`, sendEmailObj);
  }

  sendAbsentEmail(sendEmailObj: SendEmailModel) {
    return this.http.post(`${this.baseUrl}/send-email/absent`, sendEmailObj);
  }
}
