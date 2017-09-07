import {FieldErrorsComponent} from '../../form-errors/field-errors.component';
import {FormErrorsComponent} from '../../form-errors/form-errors.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {PagesLockscreen} from './lockscreen.page';
import {PagesLogin} from './login.page';
import {PagesPage404} from './page-404.page';
import {PagesPage500} from './page-500.page';
import {PagesRegister} from './register.page';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

export const routes: Routes = [
  {path: 'lockscreen', component: PagesLockscreen},
  {path: 'login', component: PagesLogin},
  {path: '404', component: PagesPage404},
  {path: '500', component: PagesPage500},
  {path: 'register', component: PagesRegister}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],
  declarations: [
    PagesLockscreen,
    PagesLogin,
    PagesPage404,
    PagesPage500,
    PagesRegister,
    FormErrorsComponent,
    FieldErrorsComponent
  ]
})
export class PagesModule {}
