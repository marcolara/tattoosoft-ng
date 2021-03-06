import {Injectable, Output, EventEmitter} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AppSettings} from '../../app.settings';
import {GhQueryEncoder} from '../misc/ghqueryencoder';
import {HTTPStatusCodes} from '../misc/http-status-codes';
import {Identity} from './identity';
import {LoginCredentials} from './login-credentials';
import {CookieService} from 'angular2-cookie/core';
import {CookieOptionsArgs} from 'angular2-cookie/services/cookie-options-args.model';

@Injectable()
export class PrincipalService {
  private _identity: Identity;
  private _authenticated: boolean;
  private _grantType: string;
  private _clientId: string;
  public redirectUrl: string;

  @Output() errorHandled$ = new EventEmitter();

  constructor(private http: Http, private _cookieService: CookieService) {
    this._authenticated = false;
  }

  public isIdentityResolved(): boolean {
    return this._identity.hasAuthorities();
  }
  public isAuthenticated(): boolean {
    return this._authenticated;
  }
  public isInRole(role: string): boolean {
    if (!this._authenticated || !this.isIdentityResolved()) {
      return false;
    }
    for (let i = 0; i < this._identity.getAuthorities().length; i++) {
      if (this._identity.getAuthorities()[i]['authority'] === role || role === AppSettings.USER_ROLES.all) {
        return true;
      }
    }
    return false;
  }
  public isInAnyRole(authorities: string[]): boolean {
    if (!this._authenticated || !this._identity.hasAuthorities()) {
      return false;
    }
    for (let i = 0; i < authorities.length; i++) {
      if (this.isInRole(authorities[i])) {
        return true;
      }
    }
    return false;
  }
  public obtainAccessToken(credentials: LoginCredentials): Promise<any> {
    this.clearAccess();
    credentials.grant_type = 'password';
    credentials.client_id = 'fooClientIdPassword';
    let urlSearchParams = new URLSearchParams('', new GhQueryEncoder());
    urlSearchParams.append('username', credentials.emailAddress);
    urlSearchParams.append('password', credentials.password);
    urlSearchParams.append('grant_type', credentials.grant_type);
    urlSearchParams.append('client_id', credentials.client_id);
    let body = urlSearchParams.toString()
    return this.http.post(AppSettings.API_ENDPOINTS.token, body, AppSettings.REQUEST.form_options)
      .toPromise()
      .then((res: Response) => {
        this.extractToken(res);
        return this.identity(false).then((identity: Identity) => {
          if (this.isAuthenticated()) {
            return Promise.resolve(this._identity);
          }
        }).catch((res: Response) => {
          return this.handleError(res);
        });
      })
      .catch(this.handleError.bind(this));
  }
  public identity(force?: boolean): Promise<any> {
    if (force === true) {
      this._identity = null;
    }
    if (this._identity) {
      return Promise.resolve(this._identity);
    }
    AppSettings.REQUEST.json_options.headers.set('Authorization', 'Bearer ' + this._cookieService.get('access_token'));
    return this.http
      .get(AppSettings.API_ENDPOINTS.user + '/extra', AppSettings.REQUEST.json_options)
      .toPromise()
      .then((res: Response) => {
        return Promise.resolve(this.extractIdentity(res));
      })
      .catch((res: Response) => {
        return this.handleError(res);
      });
  }
  public clearAccess() {
    this._authenticated = false;
    this._identity = null;
    this._cookieService.remove('access_token');
    this._cookieService.remove('refreshToken');
  }
  public resetPassword(email: string): Promise<any> {
    AppSettings.REQUEST.json_options.headers.set('Authorization', 'Bearer ' + this._cookieService.get('access_token'));
    return this.http
      .put(AppSettings.API_ENDPOINTS.user + '/password/reset', {emailAddress: email}, AppSettings.REQUEST.json_options)
      .toPromise()
      .then((res: Response) => {
        return Promise.resolve(res);
      })
      .catch((res: Response) => {
        return this.handleError(res);
      });
  }
  private extractToken(res: Response): string {
    let body = res.json();
    let opts: CookieOptionsArgs = {
      expires: new Date(new Date().getTime() + (1000 * body.expires_in))
    };
    this._cookieService.put('access_token', body.access_token, opts);
    return body.access_token || '';
  }
  private extractIdentity(res: Response): Identity {
    let body = res.json();
    this._identity = new Identity(body.dataMap.user, body.dataMap.user.authorities);
    this._authenticated = true;
    return this._identity;
  }
  private handleError(response: Response | any): Promise<any> {
    if (response.status) {
      this.errorHandled$.emit(response.status);
    }
    return Promise.reject(response.message || response);
  }
}

