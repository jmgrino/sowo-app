import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SowersPageRoutingModule } from './sowers-routing.module';
import { ShowdownModule } from 'ngx-showdown';

import { SowersPage } from './sowers.page';
import { SowerItemComponent } from './sower-item/sower-item.component';
import { SowerDialogComponent } from './sower-dialog/sower-dialog.component';


@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SowersPageRoutingModule,
    ShowdownModule,
  ],
  declarations: [SowersPage, SowerItemComponent, SowerDialogComponent]
})
export class SowersPageModule {}
