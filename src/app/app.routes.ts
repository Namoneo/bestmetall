import { Routes } from '@angular/router';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';
import { Produce } from './pages/produce/produce';
import { StaticPage } from './pages/static-page/static-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'produce', component: Produce, data: { id: 'produce' } },
      { path: 'service/:id', component: Produce },
      // Placeholders for other menu items
      { path: 'delivery', component: StaticPage, data: { id: 'delivery' } },
      { path: 'how-to-order', component: StaticPage, data: { id: 'how-to-order' } },
      { path: 'articles', component: StaticPage, data: { id: 'articles' } },
      { path: 'reviews', component: StaticPage, data: { id: 'reviews' } },
      { path: 'contacts', component: Contact },
    ],
  },
  { path: '**', redirectTo: '' },
];
