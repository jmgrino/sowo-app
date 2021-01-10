import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SowersPage } from './sowers.page';
import { SowerItemComponent } from './sower-item/sower-item.component';
import { SowerGuard } from './sower.guard';
import { SowerChatComponent } from './sower-chat/sower-chat.component';

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
  {
    path: ':id/chat',
    component: SowerChatComponent,
    canActivate: [SowerGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SowersPageRoutingModule {}
