import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { IonicModule } from '@ionic/angular';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [UserCardComponent, ActionButtonsComponent],
  exports: [UserCardComponent, ActionButtonsComponent],
})
export class UtilsModule {}
