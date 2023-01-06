import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LocationSenderComponent } from './location-sender/location-sender.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignalrService } from './signalr.service';
import { ReportComponent } from './report/report.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationSenderComponent,
    DashboardComponent,
    ReportComponent,
    NavbarComponent,
    AttendanceComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

  ],
  providers: [SignalrService],
  bootstrap: [AppComponent]
})
export class AppModule { }
