import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FeedComponent } from './components/feed/feed.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ExploreComponent } from './components/explore/explore.component';

export const routes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'messages', component: MessagesComponent }
];
