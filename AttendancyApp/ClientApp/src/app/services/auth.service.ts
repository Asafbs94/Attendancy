import { Injectable } from '@angular/core';
// import { HttpClient } from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl: string = "https://localhost:44431/api/User";
  private baseUrl: string = "/api/User";

  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodeToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj)
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, loginObj)
  }

  signOut() {
    localStorage.removeItem('token'); // to remove the token from the local storage.
    localStorage.clear(); // clear the local storage - its takes couple of seconds until the browser update.
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // the !! means that if there is token string it will return true otherwise false. 
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken() {
    if (this.userPayload) {
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }

  getEmailFromToken() {
    if (this.userPayload) {
      return this.userPayload.email;
    }
  }

  getUserNameFromToken() {
    if (this.userPayload) {
      return this.userPayload.given_name;
    }
  }
}
