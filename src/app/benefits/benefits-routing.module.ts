import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';
import { BenefitsPage } from './benefits.page';
import { BenefitEditComponent } from './benefit-edit/benefit-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BenefitsPage,
    canActivate: [SharedGuard]
  },
  {
    path: 'add',
    component: BenefitEditComponent,
    canActivate: [SharedGuard]
  },
  {
    path: 'edit/:id',
    component: BenefitEditComponent,
    canActivate: [SharedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenefitsPageRoutingModule {}
