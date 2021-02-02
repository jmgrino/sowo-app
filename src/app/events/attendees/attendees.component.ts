import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking, CalEvent } from './../event.model';
import { EventsService } from '../events.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss'],
})
export class AttendeesComponent implements OnInit {
  id: string;
  calEvent: CalEvent;
  attendees: Booking[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private uiService: UIService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.eventsService.fetchEvent(this.id)
    .subscribe( calEvent => {
      this.calEvent = calEvent;
      this.eventsService.fetchEventAttendees(this.id)
      .subscribe( res => {
        this.attendees = res;
      });
    });
  }

}
