import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { EventsPageRoutingModule } from './events-routing.module';
import { EventsPage } from './events.page';
import { EventEditComponent } from './event-edit/event-edit.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EventsPageRoutingModule
  ],
  declarations: [EventsPage, EventEditComponent]
})
export class EventsPageModule {}
