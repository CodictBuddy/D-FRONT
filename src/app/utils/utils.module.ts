import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { IonicModule } from '@ionic/angular';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { TruncatePipe } from '../truncate.pipe';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [UserCardComponent, ActionButtonsComponent,TruncatePipe],
  exports: [UserCardComponent, ActionButtonsComponent,TruncatePipe],
})
export class UtilsModule {}
