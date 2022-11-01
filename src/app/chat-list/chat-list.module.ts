import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatListPageRoutingModule } from './chat-list-routing.module';

import { ChatListPage } from './chat-list.page';
import { UtilsModule } from '../utils/utils.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatListPageRoutingModule, UtilsModule],
  declarations: [ChatListPage],
})
export class ChatListPageModule {}
