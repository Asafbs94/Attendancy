import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public hubConnection: signalR.HubConnection;
  studentReceived = new Subject<any>();

  constructor(private toastr: ToastrService) {
    this.startConnection();
    this.hubConnection.on("NotifyArrival",(StudentID)=>{
      this.NotiftyArrival(StudentID)
    })

  }

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7267/toastr",{
        skipNegotiation:true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  NotiftyArrival(StudentID: string){
      this.toastr.success(StudentID + " Has Arrived!", 'New Student');
      }

      addStudentReceivedListener(): void {
        this.hubConnection.on('studentReceived', (student: any) => {
          this.studentReceived.next(student);
        });
      }

}
