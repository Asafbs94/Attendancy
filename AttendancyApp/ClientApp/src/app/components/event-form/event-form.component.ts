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
  }

   onSubmit() {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      const eventDataJson = JSON.stringify(eventData); // Serialize eventData to JSON
      console.log(eventDataJson);
      let x = this.httpClient.get('Event/getEvent').subscribe();
      console.log(x);
      // Send eventDataJson to the endpoint using HttpClient or your preferred method
      this.httpClient.post('Event/CreateEvent', eventDataJson).subscribe();
    }
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
