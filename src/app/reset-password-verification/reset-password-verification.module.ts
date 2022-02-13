import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordVerificationPageRoutingModule } from './reset-password-verification-routing.module';

import { ResetPasswordVerificationPage } from './reset-password-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ResetPasswordVerificationPageRoutingModule,
  ],
  declarations: [ResetPasswordVerificationPage],
})
export class ResetPasswordVerificationPageModule {}
