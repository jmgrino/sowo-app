import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BenefitEditComponent } from './benefit-edit/benefit-edit.component';
import { BenefitGuard } from './benefit.guard';

import { BenefitsPage } from './benefits.page';

const routes: Routes = [
  {
    path: '',
    component: BenefitsPage,
    canActivate: [BenefitGuard]
  },
  {
    path: 'add',
    component: BenefitEditComponent,
    canActivate: [BenefitGuard]
  },
  {
    path: 'edit/:id',
    component: BenefitEditComponent,
    canActivate: [BenefitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenefitsPageRoutingModule {}
