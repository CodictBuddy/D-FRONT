import { CardComponent } from './../card/card.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'detail/:id',
    component: CardComponent,
  },
  {
    path: 'chat-list',
    loadChildren: () =>
      import('../../chat-list/chat-list.module').then(
        (m) => m.ChatListPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
