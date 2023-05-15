import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../../signalr.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  students: any[] = [{ name: "Asaf Ben Shabat", profilePictureUrl: "https://scontent.ftlv1-1.fna.fbcdn.net/v/t39.30808-6/306269878_10227887300630933_2972036365482101027_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=pF96jenYD00AX88CG7s&tn=6nTCq-vOe_Rr6OQ5&_nc_ht=scontent.ftlv1-1.fna&oh=00_AfBxVoqB2KLDw2NDDSOfS-BPp84fAljuNjP8eyPK8pVeYw&oe=63BC9D44", fadedIn: true }];

  constructor(private signalrService: SignalrService) { }
  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.addStudentReceivedListener();
    this.signalrService.studentReceived.subscribe((student: any) => {
      student.fadedIn = true;
      this.students.push(student);
    });
    // this.api.getAllAttendted();
  }
}
