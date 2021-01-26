import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedGuard } from '../shared/shared.guard';
import { SowersPage } from './sowers.page';
import { SowerItemComponent } from './sower-item/sower-item.component';
import { SowerChatComponent } from './sower-chat/sower-chat.component';

const routes: Routes = [
  {
    path: '',
    component: SowersPage,
    canActivate: [SharedGuard]
  },
  {
    path: ':id',
    component: SowerItemComponent,
    canActivate: [SharedGuard]
  },
  {
    path: ':id/chat',
    component: SowerChatComponent,
    canActivate: [SharedGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SowersPageRoutingModule {}
