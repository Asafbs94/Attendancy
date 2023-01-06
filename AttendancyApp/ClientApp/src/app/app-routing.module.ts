import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LocationSenderComponent } from './location-sender/location-sender.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { SettingsComponent } from './settings/settings.component';
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'location', component: LocationSenderComponent ,pathMatch:"full"},
  { path: 'report', component: ReportComponent ,pathMatch:"full"},
  { path: 'attendance', component: AttendanceComponent ,pathMatch:"full"},
  { path: 'setting', component: SettingsComponent ,pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
