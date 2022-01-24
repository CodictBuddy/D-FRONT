import { InvitationsComponent } from './../invitations/invitations.component';
import { RecommendationComponent } from './../recommendation/recommendation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NetworkPageRoutingModule } from './network-routing.module';

import { NetworkPage } from './network.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NetworkPageRoutingModule],
  declarations: [NetworkPage, RecommendationComponent, InvitationsComponent],
})
export class NetworkPageModule {}
