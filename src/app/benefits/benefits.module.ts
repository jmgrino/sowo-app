import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenefitsPageRoutingModule } from './benefits-routing.module';

import { BenefitsPage } from './benefits.page';
import { BenefitEditComponent } from './benefit-edit/benefit-edit.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BenefitsPageRoutingModule
  ],
  declarations: [BenefitsPage, BenefitEditComponent]
})
export class BenefitsPageModule {}
