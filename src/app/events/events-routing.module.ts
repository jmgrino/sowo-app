import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from './../shared/shared.guard';
import { EventsPage } from './events.page';
import { EventEditComponent } from './event-edit/event-edit.component';
import { AttendeesComponent } from './attendees/attendees.component';

const routes: Routes = [
  {
    path: '',
    component: EventsPage,
    canActivate: [SharedGuard]
  },
  {
    path: 'add',
    component: EventEditComponent,
    canActivate: [SharedGuard]
  },
  {
    path: 'edit/:id',
    component: EventEditComponent,
    canActivate: [SharedGuard]
  },
  {
    path: 'attendees/:id',
    component: AttendeesComponent,
    canActivate: [SharedGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsPageRoutingModule {}
