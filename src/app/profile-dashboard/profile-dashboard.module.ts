import { UtilsModule } from './../utils/utils.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDashboardPageRoutingModule } from './profile-dashboard-routing.module';

import { ProfileDashboardPage } from './profile-dashboard.page';
import { CapitalizePipePipe } from '../capitalize-pipe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDashboardPageRoutingModule,
    UtilsModule,
  ],
  declarations: [ProfileDashboardPage,CapitalizePipePipe],
})
export class ProfileDashboardPageModule {}
