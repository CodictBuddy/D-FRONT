import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileManagePageRoutingModule } from './profile-manage-routing.module';

import { ProfileManagePage } from './profile-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileManagePageRoutingModule
  ],
  declarations: [ProfileManagePage]
})
export class ProfileManagePageModule {}
