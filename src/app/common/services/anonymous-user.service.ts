import {AppSettings} from '../../app.settings';
import {AbstractService} from './abstact-service';
import {Injectable, Output, EventEmitter} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Http} from '@angular/http';

@Injectable()
export class AnonymousUserService extends AbstractService {

  constructor(private http: Http) {
    super();
  }

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

  public validateField(field: string, form: string, value: string): Promise<any> {
    const url = AppSettings.API_ENDPOINTS.validate;
    return this.http
      .post(this.interpolateUrl(url, {formId: form, fieldId: field}), {value: value}, AppSettings.REQUEST.json_options)
      .toPromise()
      .then(res => {
        return Promise.resolve(res);
      })
      .catch((res: Response) => {
        return Promise.reject(res);
      });
  }
}
