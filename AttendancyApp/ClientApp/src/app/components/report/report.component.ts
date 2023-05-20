import { Component, OnInit, ViewChild } from '@angular/core';
import { SignalrService } from '../../signalr.service';
import { ChartComponent } from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { SendEmailService } from 'src/app/services/send-email.service';
import { SendEmailModel } from 'src/app/models/send-email-model.model';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  events: any[] = [];
  chartOptions: Partial<ChartOptions> | any;
  selectedDate = "";
  participants: any[] = [];
  userName = "";
  showmsg = false;

  sendEmailObj = new SendEmailModel();

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private auth: AuthService,
    private emailService: SendEmailService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.chartOptions = {
      series: [0, 0], // Initial counts for Arrived and Absent
      chart: {
        type: "donut"
      },
      labels: ["Arrived", "Absent"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnInit() {
    this.userStore.getUserNameFromStore().subscribe(val => {
      let userNameFromToken = this.auth.getUserNameFromToken();
      this.userName = val || userNameFromToken;
    });
    this.getEvents();
  }

  getEvents() {
    this.http.get<Event[]>('/Event/' + this.userName.toString()).subscribe(
      response => {
        this.events = response;
      },
      error => {
        console.error(error);
      }
    );
  }
  async getParticipants() {
    const selectedEventGuid = this.events.find(x => x.eventName === this.selectedDate)?.guid;
    if (!selectedEventGuid) return;

    try {
      const response = await this.http.get<any[]>('/Event/GetParticipants/' + selectedEventGuid).toPromise();
      if (response) {
        console.log(response);

        const arrivedCount = response.filter(participant => participant.isArrived).length;
        const absentCount = response.filter(participant => !participant.isArrived).length;

        this.chartOptions.series = [arrivedCount, absentCount];
        this.chartOptions.labels = ["Arrived", "Absent"];

        this.participants = response;
      }
    } catch (error) {
      console.error(error);
    }
  }
  notifyAbsent() {
    this.showmsg = true;
    console.log("Notify Absent button clicked");
    // Add your logic to send notifications or handle absent participants
  }
  sengAbsentMsg() {

    this.sendEmailObj.to = this.participants
      .filter(p => p.isArrived == false)
      .map(p => p.email.toString())
      .join(',').toString();
    this.sendEmailObj.subject = 'AttendancyApp mail: Absent event!';
    this.sendEmailObj.content = 'You have been absent from ' + this.selectedDate.toString() + " event!";

    this.emailService.sendAbsentEmail(this.sendEmailObj)
      .subscribe({
        next: (res) => {
          this.toast.info({
            detail: "INFO",
            summary: "Email/s sent.",
            duration: 3000
          });
        },
        error: (err) => {
          this.toast.error({
            detail: "ERROR",
            summary: err.error.message,
            duration: 5000
          });
        }
      });

    this.router.navigate(['dashboard']);
  }


}
