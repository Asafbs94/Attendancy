import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-event-registartion',
  templateUrl: './event-registartion.component.html',
  styleUrls: ['./event-registartion.component.css']
})
export class EventRegistartionComponent{
  participant: { email: string, participantId: string } = { email: '', participantId: '' };
  eventGuid: string = "";

  constructor(private route: ActivatedRoute, private http: HttpClient,private router:Router,    private toast: NgToastService
    ) {
    this.eventGuid = this.route.snapshot.paramMap.get('id') || "";
  }

  submitForm() {
    const dto: any = {
      participant: {
        id: 0,
        email: this.participant.email,
        participantId: Number(this.participant.participantId)
      },
      eventGuid: this.eventGuid
    };

    // Send the DTO to the server
    this.http.post('/Event/AddParticipant', dto)
      .subscribe(
        response => {
          this.toast.success({ detail: "SUCCESS", summary: "You have been added to the event", duration: 3000 });
          // Route to 'dashboard' on success
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Sign up failed!', error);
          // Display an alert on error
          this.toast.error({ detail: "ERROR", summary: "Error signing into the event", duration: 3000 });
        }
      );
  }
}
