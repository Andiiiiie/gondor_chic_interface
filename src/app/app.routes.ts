import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomePageConnectedComponent } from './pages/home-page-connected/home-page-connected.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home-connected' , component: HomePageConnectedComponent}
];
