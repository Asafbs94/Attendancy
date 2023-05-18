import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPasswordModel } from '../models/reset-password-model.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private baseUrl: string = "/api/User";

  constructor(private http: HttpClient) { }

  sendResetPasswordLink(email: string) {
    return this.http.post(`${this.baseUrl}/send-reset-email/${email}`, {});
  }

  resetPassword(resetPasswordObj: ResetPasswordModel) {
    return this.http.post(`${this.baseUrl}/reset-password`, resetPasswordObj);
  }
}
