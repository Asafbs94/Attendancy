import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  eventForm: FormGroup;
  @ViewChild('eventLocation') locationInput: ElementRef;
  private baseUrl: string = "https://localhost:44431/Event";

  suggestions: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private httpClient: HttpClient
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
    const EventDto = this.eventForm.value;
    console.log(EventDto);
    this.httpClient.post<any>(`${this.baseUrl}`, EventDto).subscribe(
      (response) => {
        // Request was successful
        alert('the Event was created successfuly!');
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
