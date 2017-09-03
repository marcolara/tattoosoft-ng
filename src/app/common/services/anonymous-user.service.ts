import {AppSettings} from '../../app.settings';
import {Injectable, Output, EventEmitter} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class AnonymousUserService {

  constructor(private http: Http) {}

  @Output() errorHandled$ = new EventEmitter();

  public resetPassword(email: string): Promise<any> {
    AppSettings.REQUEST.json_options.headers.delete('Authorization');
    return this.http
      .put(AppSettings.API_ENDPOINTS.account, {emailAddress: email}, AppSettings.REQUEST.json_options)
      .toPromise()
      .then(res => {
        return Promise.resolve(res);
      })
      .catch((res: Response) => {
        return this.handleError(res);
      });
  }

  private handleError(response: Response | any): Promise<any> {
    if (response.status) {
      this.errorHandled$.emit(response.status);
    }
    return Promise.reject(response.message || response);
  }
}
