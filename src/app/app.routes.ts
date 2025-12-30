import { Routes } from '@angular/router';
import { MainLayout } from './components/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'produce',
        loadComponent: () => import('./pages/produce/produce').then((m) => m.Produce),
        data: { id: 'produce' },
      },
      {
        path: 'service/:id',
        loadComponent: () => import('./pages/produce/produce').then((m) => m.Produce),
      },
      // Placeholders for other menu items
      {
        path: 'delivery',
        loadComponent: () => import('./pages/static-page/static-page').then((m) => m.StaticPage),
        data: { id: 'delivery' },
      },
      {
        path: 'how-to-order',
        loadComponent: () => import('./pages/static-page/static-page').then((m) => m.StaticPage),
        data: { id: 'how-to-order' },
      },
      {
        path: 'articles',
        loadComponent: () => import('./pages/static-page/static-page').then((m) => m.StaticPage),
        data: { id: 'articles' },
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/static-page/static-page').then((m) => m.StaticPage),
        data: { id: 'reviews' },
      },
      {
        path: 'contacts',
        loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
