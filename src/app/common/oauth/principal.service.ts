import {Injectable} from '@angular/core';

@Injectable()
export class PrincipalService {
  _identity: undefined;
  _authenticated: false;
  _grantType: undefined;
  _clientId: undefined;
  service: {
    host: "localhost:8084",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    refreshData: {
      grant_type: "refresh_token"
    }
  };
  constructor() {

  }

}
