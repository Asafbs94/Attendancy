import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  students: any[] = [];

  constructor(private signalrService: SignalrService) { }
  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.addStudentReceivedListener();
    this.signalrService.studentReceived.subscribe((student: any) => {
      this.students.push(student);
    });
  }
}
