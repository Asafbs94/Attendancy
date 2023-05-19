import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  eventForm: FormGroup;
  @ViewChild('eventLocation') locationInput: ElementRef;
  // private baseUrl: string = "https://localhost:44431/Event";
  private baseUrl: string = "/Event";
  public userName: string = "";
  suggestions: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private httpClient: HttpClient,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private auth: AuthService) {
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
    const location = this.locationInput.nativeElement.value;
    if (location) {
      const apiKey = 'c04d7635234a4af1a4436cfa63ee1e80'; // Replace with your actual OpenCage Geocoder API key
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&limit=5`;

      this.httpClient.get(apiUrl).subscribe((response: any) => {
        if (response.results && response.results.length > 0) {
          this.suggestions = response.results.map((result: any) => result.formatted);
        } else {
          this.suggestions = [];
        }
      });
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.eventForm.patchValue({
      eventLocation: suggestion
    });
    this.suggestions = [];
  }
}
