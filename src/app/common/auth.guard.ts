import {PrincipalService} from './oauth/principal.service';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private _principal: PrincipalService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this._principal.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/pages/login-beta']);
    return false;
  }

}
