import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SowersPage } from './sowers.page';
import { SowerItemComponent } from './sower-item/sower-item.component';
import { SowerGuard } from './sower.guard';

const routes: Routes = [
  {
    path: '',
    component: SowersPage,
    canActivate: [SowerGuard]
  },
  {
    path: ':id',
    component: SowerItemComponent,
    canActivate: [SowerGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SowersPageRoutingModule {}
