import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingsPageRoutingModule } from './meetings-routing.module';

import { MeetingsPage } from './meetings.page';

@NgModule({
  imports: [
    // CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    MeetingsPageRoutingModule
  ],
  declarations: [MeetingsPage]
})
export class MeetingsPageModule {}
