import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AppSettings} from '../../app.settings';
import {Identity} from './identity';
import {Credentials} from './credentials';
import {CookieService} from 'angular2-cookie/core';
import {CookieOptionsArgs} from 'angular2-cookie/services/cookie-options-args.model';


@Injectable()
export class PrincipalService {
  _identity: Identity;
  _authenticated: boolean;
  _grantType: string;
  _clientId: string;
  headers: Headers;
  options: RequestOptions;
  service: {
    host: 'localhost:8084',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    refreshData: {
      grant_type: 'refresh_token'
    }
  };

  constructor(private http: Http, private _cookieService: CookieService) {

  }

  isIdentityResolved(): boolean {
    return this._identity.hasAuthorities();
  }
  isAuthenticated(): boolean {
    return this._authenticated;
  }
  isInRole(role: string): boolean {
    if (!this._authenticated || this._identity.hasAuthorities()) {
      return false;
    }
    for (let i = 0; i < (!this._identity ? this._identity.getAuthorities().length : 0); i++) {
      if (this._identity.getAuthorities()[i] === role || role === AppSettings.USER_ROLES.all) {
        return true;
      }
    }
    return false;
  }
  isInAnyRole(authorities: string[]): boolean {
    if (!this._authenticated || this._identity.hasAuthorities()) {
      return false;
    }
    for (let i = 0; i < authorities.length; i++) {
      if (this.isInRole(authorities[i])) {
        return true;
      }
    }
    return false;
  }
  authenticate(credentials: any): Promise<any> {
    this.clearAccessCookie();
    return this.obtainAccessToken(credentials)
      .then((res: Response) => {
        this.identity(false).then(() => {
          if (this.isAuthenticated()) {
            return Promise.resolve(this._identity);
          } else {
            return Promise.reject(res);
          }
        })
      })
      .catch(this.handleError);
  }
  obtainAccessToken(credentials: any): Promise<any> {
    return this.http.post(AppSettings.API_ENDPOINTS.token, new Credentials(credentials.username, credentials.password), this.options)
      .toPromise()
      .then(this.extractToken)
      .catch(this.handleError);
  }
  private identity(force: boolean): Promise<any> {
    if (force === true) {
      this._identity = null;
    }
    if (this._identity) {
      return Promise.resolve(this._identity);
    }
    this.options.headers.append('Authorization', 'Bearer ' + this._cookieService.get("access_token"));
    this.http
      .get(AppSettings.API_ENDPOINTS.identity, this.options)
      .toPromise()
      .then(this.extractIdentity)
      .catch(this.handleError);
  }
  private clearAccessCookie() {
    this._cookieService.remove('access_token');
    this._cookieService.remove('refreshToken');
  }
  private extractToken(res: Response) {
    let body = res.json();
    let opts: CookieOptionsArgs = {
      expires: new Date(new Date().getTime() + (1000 * body.data.expires_in))
    };
    this._cookieService.put('access_token', body.data.access_token, opts);
  }
  private extractIdentity(res: Response): Promise<any> {
    let body = res.json();
    this._identity = new Identity(body.user, body.user.authorities);
    this._authenticated = true;
    return Promise.resolve(this._identity);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    this._authenticated = false;
    this.clearAccessCookie();
    return Promise.reject(error.message || error);
  }
}

