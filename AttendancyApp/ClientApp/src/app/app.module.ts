import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LocationSenderComponent } from './components/location-sender/location-sender.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignalrService } from './signalr.service';
import { ReportComponent } from './components/report/report.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './interseptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LocationSenderComponent,
    DashboardComponent,
    ReportComponent,
    NavbarComponent,
    AttendanceComponent,
    SettingsComponent,
    LoginComponent,
    SignupComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgToastModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    SignalrService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
