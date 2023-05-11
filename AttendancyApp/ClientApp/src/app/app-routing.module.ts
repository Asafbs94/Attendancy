import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LocationSenderComponent } from './components/location-sender/location-sender.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportComponent } from './components/report/report.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: "/login", pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'location', component: LocationSenderComponent, pathMatch: "full" },
  { path: 'report', component: ReportComponent, pathMatch: "full" },
  { path: 'attendance', component: AttendanceComponent, pathMatch: "full" },
  { path: 'setting', component: SettingsComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
