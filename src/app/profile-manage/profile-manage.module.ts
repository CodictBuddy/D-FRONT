import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileManagePageRoutingModule } from './profile-manage-routing.module';

import { ProfileManagePage } from './profile-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProfileManagePageRoutingModule,
  ],
  declarations: [ProfileManagePage],
})
export class ProfileManagePageModule {}
