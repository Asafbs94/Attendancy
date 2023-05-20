import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection: signalR.HubConnection;
  studentReceived = new Subject<any>();

  constructor(private toast: NgToastService) {
    this.startConnection();
    this.hubConnection.on("studentReceived",(StudentID)=>{
      this.NotiftyArrival(StudentID)
    })

  }

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5016/toastr",{
        skipNegotiation:true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  NotiftyArrival(StudentID: any){
    //this.toast.success({ detail: "SUCCESS", summary:StudentID.name+   ' Has arrived', duration: 2000 });
  }

      addStudentReceivedListener(): void {
        this.hubConnection.on('studentReceived', (student: any) => {
          this.studentReceived.next(student);
        });
      }

}
