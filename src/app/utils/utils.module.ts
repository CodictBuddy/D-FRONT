import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { IonicModule } from '@ionic/angular';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { TruncatePipe } from '../truncate.pipe';
import { DateAgoPipe } from '../date-pipe.pipe';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [UserCardComponent, ActionButtonsComponent, TruncatePipe, DateAgoPipe],
  exports: [UserCardComponent, ActionButtonsComponent, TruncatePipe, DateAgoPipe],
})
export class UtilsModule { }
