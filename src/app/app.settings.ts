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
    host: 'localhost:8084',
    json_options: new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'q=0.8;application/json;q=0.9'
      })
    }),
    form_options: new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      })
    })
  };

  public static API_ENDPOINTS = {
    identity: '//' + AppSettings.REQUEST.host + '/tattoosoft-oauth-resource/user/extra',
    token: '//' + AppSettings.REQUEST.host + '/oauth/token'
  };
}
