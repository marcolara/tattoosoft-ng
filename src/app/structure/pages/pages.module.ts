import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { PagesLockscreen } from './lockscreen.page';
import { PagesLogin } from './login.page';
import { PagesPage404 } from './page-404.page';
import { PagesPage500 } from './page-500.page';
import { PagesRegister } from './register.page';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: 'lockscreen', component: PagesLockscreen },
  { path: 'login', component: PagesLogin },
  { path: '404', component: PagesPage404 },
  { path: '500', component: PagesPage500 },
  { path: 'register', component: PagesRegister }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  declarations: [
    PagesLockscreen,
    PagesLogin,
    PagesPage404,
    PagesPage500,
    PagesRegister
  ]
})
export class PagesModule { }
