import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FeedComponent } from './components/feed/feed.component';

export const routes: Routes = [

    { path: '', component: WelcomeComponent },
    { path: 'home',
      component: HomepageComponent,
      children: [
        { path: 'feed', loadComponent: () => import('./components/feed/feed.component').then(m => m.FeedComponent) },
        { path: 'explore', loadComponent: () => import('./components/explore/explore.component').then(m => m.ExploreComponent) },
        { path: 'messages', loadComponent: () => import('./components/messages/messages.component').then(m => m.MessagesComponent) },
        { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
        { path: '', redirectTo: 'feed', pathMatch: 'full' }
    ]  
    }
];
