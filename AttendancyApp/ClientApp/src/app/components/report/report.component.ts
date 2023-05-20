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
  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private auth: AuthService
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
  sengAbsentMsg(){

  }


}
