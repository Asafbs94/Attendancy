import { Injectable } from '@angular/core';
// import { HttpClient } from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "https://localhost:44431/api/User"
  constructor(private http: HttpClient, private router: Router) { }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj)
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, loginObj)
  }

  signOut() {
    localStorage.clear(); // clear the local storage to remove the token - its takes couple of seconds until the browser update.
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
}
