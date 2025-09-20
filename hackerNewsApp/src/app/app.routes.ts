import { NewsDashBoardComponent } from './dashboard/components/news-dashboard/news-dashboard.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/components/news-dashboard/news-dashboard.component')
      .then(m => m.NewsDashBoardComponent)
  }
];
