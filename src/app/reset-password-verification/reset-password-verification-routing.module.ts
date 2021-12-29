import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordVerificationPage } from './reset-password-verification.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordVerificationPageRoutingModule {}
