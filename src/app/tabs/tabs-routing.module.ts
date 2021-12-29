import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home/home.module').then((m) => m.HomePageModule),
      },

      {
        path: 'notification',
        loadChildren: () =>
          import('../notification/notification.module').then(
            (m) => m.NotificationPageModule
          ),
      },
      {
        path: 'network',
        loadChildren: () =>
          import('../network/network.module').then((m) => m.NetworkPageModule),
      },
      // {
      //   path: 'post',
      //   loadChildren: () =>
      //     import('../post/post.module').then((m) => m.PostPageModule),
      // },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
