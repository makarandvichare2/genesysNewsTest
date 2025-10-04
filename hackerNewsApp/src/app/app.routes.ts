import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'download', loadComponent: () => import('./web-worker-feature/components/download-csv/download-csv.component')
      .then(m => m.DownloadCsvComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/components/news-dashboard/news-dashboard.component')
      .then(m => m.NewsDashBoardComponent)
  }
];
