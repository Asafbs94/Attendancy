import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SendEmailService } from 'src/app/services/send-email.service';
import { SendEmailModel } from 'src/app/models/send-email-model.model';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

  to: string = '';
  messageBody: string = '';
  isEmailInvalid: boolean = false;

  sendEmailObj = new SendEmailModel();

  constructor(private route: ActivatedRoute, private http: HttpClient, private emailService: SendEmailService, private toast: NgToastService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.messageBody = params.get('message') || '';
    });
  }
  validateToField() {
    this.isEmailInvalid = !this.isEmail(this.to);
  }

  isEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  sendMail() {
    // Construct your data transfer object (DTO) here
    const dto = {
      to: this.to,
      messageBody: this.messageBody
    };

    this.sendEmailObj.to = this.to;
    this.sendEmailObj.subject = 'AttendancyApp mail: Invitation to event!';
    this.sendEmailObj.content = this.messageBody;
    this.emailService.sendInvitationEmail(this.sendEmailObj)
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

    // Send the DTO to the endpoint
    // You can use Angular's HttpClient to make an HTTP POST request to your endpoint
    // For example: this.http.post('your-endpoint-url', dto).subscribe(() => {});
  }
}
