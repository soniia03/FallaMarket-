import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TrajeListComponent } from './components/traje-list/traje-list.component';
import { TrajeDetailComponent } from './components/traje-detail/traje-detail.component';
import { TrajeFormComponent } from './components/traje-form/traje-form.component';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trajes', component: TrajeListComponent },
  { path: 'trajes/add', component: TrajeFormComponent },
  { path: 'trajes/edit/:id', component: TrajeFormComponent },
  { path: 'trajes/:id', component: TrajeDetailComponent },
  { path: 'users', component: UserListComponent },
  // Redirecciones para mantener compatibilidad
  { path: 'products', redirectTo: 'trajes' },
  { path: 'products/add', redirectTo: 'trajes/add' },
  { path: 'products/edit/:id', redirectTo: 'trajes/edit/:id' },
  { path: 'products/:id', redirectTo: 'trajes/:id' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];