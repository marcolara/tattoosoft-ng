import {AuthGuard} from './common/auth.guard';
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

export const routes: Routes = [
  {path: '', redirectTo: 'dashboards/alpha', pathMatch: 'full'},
  {path: '**', redirectTo: '404'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
