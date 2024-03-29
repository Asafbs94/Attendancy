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
import { EventFormComponent } from './components/event-form/event-form.component';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EventRegistartionComponent } from './components/event-registartion/event-registartion.component';
import { MailComponent } from './components/mail/mail.component';
const routes: Routes = [
  { path: 'eventCreation', component: EventFormComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'mail', component: MailComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'location/:id', component: LocationSenderComponent, pathMatch: 'full' },
  { path: 'eventregistartion/:id', component: EventRegistartionComponent, pathMatch: 'full' },
  { path: 'report', component: ReportComponent, pathMatch: 'full' },
  { path: 'attendance', component: AttendanceComponent, pathMatch: 'full' },
  { path: 'setting', component: SettingsComponent, pathMatch: 'full' },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Handling all other routes - '**' means all other urls.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
