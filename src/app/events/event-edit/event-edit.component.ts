import { CalEvent } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIService } from 'src/app/shared/ui.service';
import { EventsService } from '../events.service';
import { first } from 'rxjs/operators';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import { Timestamp } from '@google-cloud/firestore';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit {
  isAddMode: boolean;
  id: string;
  eventsForm: FormGroup;
  calEvent: CalEvent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventsService: EventsService,
    private uiService: UIService,

  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    
    this.isAddMode = !this.id;

    this.eventsForm = this.fb.group({
      name: [''],
      eventDate: [''],
      hours: [''],
      prize: [''],
      book: [false],
    });

    if (!this.isAddMode) {
      this.eventsService.fetchEvent(this.id).pipe(
        first(),
      )
      .subscribe( item => {
        this.eventsForm.patchValue(item);
      });
    }

  }

  onDateChange(event) {
    // console.log('onDataChange', event);
    
    // var convertDate = new Date(event.target.value).toISOString().substring(0, 10);
    // this.eventsForm.get('date').setValue(convertDate, {
    //   onlyself: true
    // })
  }

  
  onSubmit() {
    if (!this.eventsForm.valid) {
      return;
    }
    if (this.isAddMode) {
      this.addEvent();
    } else {
      this.updateEvent();
    }
  }
  
  onCancel() {
    this.router.navigateByUrl('/events');
  }

  private addEvent() {
    const {name, eventDate, hours, prize, book} = this.eventsForm.value;
    
    const newEvent: CalEvent = {
      name,
      eventDate: eventDate.toDate(),
      hours,
      prize,
      book
    }

    // Time Picker
    // https://www.npmjs.com/package/ngx-material-timepicker
    
    this.eventsService.addEvent(newEvent)
    .subscribe( 
      () => {
        this.router.navigateByUrl('/events');
      },  error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      }
    )

  }

  private updateEvent() {
    const {name, eventDate, hours, prize, book} = this.eventsForm.value;
    
    const newEvent: CalEvent = {
      name,
      eventDate: eventDate.toDate(),
      hours,
      prize,
      book
    }

    this.eventsService.saveEvent(this.id, newEvent).subscribe( 
      () => {
        this.router.navigateByUrl('/events');
      },  error => {
        const message = this.uiService.translateFirestoreError(error);
        this.uiService.showStdSnackbar(message);
      }
    )
  }

}
