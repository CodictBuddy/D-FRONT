import { CommentsComponent } from './../comments/comments.component';

import { HeaderComponent } from './../../landing/header/header.component';
import { CardComponent } from '../card/card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SearchComponent } from 'src/app/utils/search/search.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    CardComponent,
    HeaderComponent,
    SearchComponent,
    CommentsComponent,
  ],
})
export class HomePageModule {}
