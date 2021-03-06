import {Headers, RequestOptions} from '@angular/http';

export class AppSettings {
  public static USER_ROLES = {
    all: '*',
    admin: 'SUPER_ADMIN',
    practitioner: 'REG_PRACTITIONER',
    owner: 'SHOP_OWNER',
    employee: 'SHOP_EMPLOYEE'
  };

  public static REQUEST = {
    web_host: 'localhost:8084',
    resource_host: 'localhost:8082/tattoosoft-oauth-resource',
    json_options: new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json, text/plain, */*'
      })
    }),
    form_options: new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      })
    })
  };

  public static API_ENDPOINTS = {
    user: '//' + AppSettings.REQUEST.resource_host + '/user',
    account: '//' + AppSettings.REQUEST.resource_host + '/account',
    validate: '//' + AppSettings.REQUEST.resource_host + '/valid/:formId/:fieldId',
    token: '//' + AppSettings.REQUEST.web_host + '/oauth/token'
  };
}
