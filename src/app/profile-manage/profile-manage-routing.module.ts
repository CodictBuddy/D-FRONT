import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileManagePage } from './profile-manage.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileManagePageRoutingModule {}
