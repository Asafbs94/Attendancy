import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {



  to: string = '';
  messageBody: string = '';
  isEmailInvalid: boolean = false;
  constructor(private route:ActivatedRoute,private http:HttpClient){}

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

    // Send the DTO to the endpoint
    // You can use Angular's HttpClient to make an HTTP POST request to your endpoint
    // For example: this.http.post('your-endpoint-url', dto).subscribe(() => {});
  }
}
