import { Component, OnInit } from '@angular/core';
import { SignalrService } from 'src/app/signalr.service';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  participants: any[] = [];
  selectedDate = "";
  events: any[] = [];
  userName = [];

  constructor(
    private signalrService: SignalrService,
    private http: HttpClient,
    public userStore: UserStoreService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.userStore.getUserNameFromStore().subscribe(val => {
      let userNameFromToken = this.auth.getUserNameFromToken();
      this.userName = val || userNameFromToken;
    });
    this.getEvents();
    this.signalrService.startConnection();
    this.signalrService.addStudentReceivedListener();
    this.signalrService.studentReceived.subscribe((p: any) => {
      if( p.profilePictureUrl.toLowerCase() === this.selectedDate.toLowerCase())
      p.fadedIn = true;
      this.participants.push(p);
    });

  }

  async getParticipants() {
    var selectedEventGuid = this.events.filter(x => x.eventName == this.selectedDate)[0].guid;
    console.log(selectedEventGuid);
    this.http.get<Event[]>('/Event/GetParticipants/' + selectedEventGuid).subscribe(
      response => {
        console.log(response)
        //this.participants = response;
      },
      error => {
        console.error(error);
      }
    );
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
}
