import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRegistartionComponent } from './event-registartion.component';

describe('EventRegistartionComponent', () => {
  let component: EventRegistartionComponent;
  let fixture: ComponentFixture<EventRegistartionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRegistartionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRegistartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
