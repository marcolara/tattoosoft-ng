import {AppSettings} from '../../app.settings';
import {Injectable, Output, EventEmitter} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Http } from '@angular/http';

@Injectable()
export class AnonymousUserService {

  constructor(private http: Http) {}

  public resetPassword(email: string): Promise<any> {
    AppSettings.REQUEST.json_options.headers.delete('Authorization');
    return this.http
      .put(AppSettings.API_ENDPOINTS.account, {emailAddress: email}, AppSettings.REQUEST.json_options)
      .toPromise()
      .then(res => {
        return Promise.resolve(res);
      })
      .catch((res: Response) => {
        return Promise.reject(res);
      });
  }

  public validateField(field: string, form: string): Promise<any> {
    
  }
}
