import { RecommendationComponent } from './recommendation/recommendation.component';
import { DoLoginGuard } from './auth/guards/do-login.guards';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InvitationsComponent } from './invitations/invitations.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
    // canActivate: [DoLoginGuard],
  },
  {
    path: 'post',
    loadChildren: () =>
      import('./post/post.module').then((m) => m.PostPageModule),
  },
  { path: 'recommendations', component: RecommendationComponent },
  { path: 'invitations', component: InvitationsComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./profile-dashboard/profile-dashboard.module').then(
        (m) => m.ProfileDashboardPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile-manage/profile-manage.module').then(
        (m) => m.ProfileManagePageModule
      ),
  },

  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },

  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },

  {
    path: 'chat-room',
    loadChildren: () =>
      import('./chat-room/chat-room.module').then((m) => m.ChatRoomPageModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import(
        './reset-password-verification/reset-password-verification.module'
      ).then((m) => m.ResetPasswordVerificationPageModule),
  },
  {
    path: 'new-password',
    loadChildren: () =>
      import('./new-password/new-password.module').then(
        (m) => m.NewPasswordPageModule
      ),
  },
  {
    path: 'profile-image',
    loadChildren: () => import('./profile-image/profile-image.module').then( m => m.ProfileImagePageModule)
  },
  {
    path: 'complete-profile',
    loadChildren: () => import('./complete-profile/complete-profile.module').then( m => m.CompleteProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
