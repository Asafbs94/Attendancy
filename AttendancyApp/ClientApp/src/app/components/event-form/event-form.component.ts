import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  eventForm: FormGroup;
  @ViewChild('eventLocation') locationInput: ElementRef;
  private baseUrl: string = "https://localhost:44431/Event";
  userName = ""
  suggestions: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private httpClient: HttpClient,
    private userStore: UserStoreService,
    private auth : AuthService,
    private router: Router,
    private toast : NgToastService

  ) {
    this.eventForm = this.formBuilder.group({
      EventName: ['', Validators.required],
      EventDate: ['', Validators.required],
      EventTime: ['', Validators.required],
      EventDescription: ['', Validators.required],
      EventLocation: ['', Validators.required],
    });

    // Convert time input to string format
    this.eventForm.get('EventTime')?.valueChanges.subscribe(value => {
      if (value instanceof Date) {
        const timeString = value.toTimeString().split(' ')[0];
        this.eventForm.get('EventTime')?.setValue(timeString);
      }
    });
  }

  async onSubmit() {
    var EventDto = this.eventForm.value;
    this.userStore.getUserNameFromStore()
    .subscribe(val => {
      let userNameFromToken = this.auth.getUserNameFromToken(); // When refresing the page the observable will be empty so it will take the name from the token.
      this.userName = val || userNameFromToken;
    });
    EventDto = { ...this.eventForm.value, Creator: this.userName };
    console.log(EventDto);
    this.httpClient.post<any>(`${this.baseUrl}`, EventDto).subscribe(
      (response) => {
        // Request was successful
        // alert('the Event was created successfuly!');
        this.toast.success({ detail: "SUCCESS", summary: "The event was created successfuly!", duration: 2000 });
        this.router.navigate(['dashboard']);
      },
      (error) => {
        // Handle any errors that occurred during the request
        console.error('An error occurred:', error);
      }
    );
  }


  onLocationInput() {
    const locationInput = document.getElementById('eventLocation') as HTMLInputElement;
    const location = locationInput.value;
    if (location) {
      this.httpClient.get<string[]>('/geocode', { params: { location: location } }).subscribe(
        (data: string[]) => {
          if (data && data.length > 0) {
            this.suggestions = data;
          } else {
            this.suggestions = [];
          }
        },
        (error: any) => {
          console.error('An error occurred while fetching geocode data:', error);
        }
      );
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.eventForm.patchValue({
      EventLocation: suggestion
    });
    this.suggestions = [];
  }
}
