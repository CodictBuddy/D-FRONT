import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDashboardPageRoutingModule } from './profile-dashboard-routing.module';

import { ProfileDashboardPage } from './profile-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDashboardPageRoutingModule
  ],
  declarations: [ProfileDashboardPage]
})
export class ProfileDashboardPageModule {}
