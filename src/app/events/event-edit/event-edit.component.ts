import { calEvent } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIService } from 'src/app/shared/ui.service';
import { EventsService } from '../events.service';
import { first } from 'rxjs/operators';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
})
export class EventEditComponent implements OnInit {
  isAddMode: boolean;
  id: string;
  eventsForm: FormGroup;
  calEvent: calEvent;
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
    console.log(this.isAddMode);

    this.eventsForm = this.fb.group({
      name: [''],
      eventDate: [''],
      hours: [''],
      prize: [''],
      book: [''],
    });

    if (!this.isAddMode) {
      // this.eventsService.fetchEvent(this.id).pipe(
      //   first(),
      // )
      // .subscribe( item => {
      //   this.eventsForm.patchValue(item);
      // });
    }

  }

  onDateChange(event) {
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
    console.log(this.eventsForm.value);
    console.log(this.eventsForm.value['eventDate'].toDate());
    const {name, eventDate} = this.eventsForm.value;
    
    
    const newEvent = {
      name,
      eventDate: eventDate.toDate(),
    }
    console.log('newEvent', newEvent);
    https://www.npmjs.com/package/ngx-material-timepicker
    
    
    
    // this.eventsService.addBenefit(this.eventsForm.value).subscribe( 
    //   () => {
    //     this.router.navigateByUrl('/benefits');
    //   },  error => {
    //     const message = this.uiService.translateFirestoreError(error);
    //     this.uiService.showStdSnackbar(message);
    //   }
    // )
  }

  private updateEvent() {
    // this.eventsService.saveBenefit(this.id, this.eventsForm.value).subscribe( 
    //   () => {
    //     this.router.navigateByUrl('/benefits');
    //   },  error => {
    //     const message = this.uiService.translateFirestoreError(error);
    //     this.uiService.showStdSnackbar(message);
    //   }
    // )
  }

}
