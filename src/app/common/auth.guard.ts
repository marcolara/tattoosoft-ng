import {Identity} from './oauth/identity';
import {PrincipalService} from './oauth/principal.service';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private _principal: PrincipalService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    this._principal.redirectUrl = state.url;
    this._principal.identity().then((identity: Identity) => {
      if (route.data && route.data.roles && !this._principal.isInAnyRole(route.data.roles)) {
        if (!this._principal.isAuthenticated) {
          this.router.navigate(['/accessdenied']); // user is signed in but not authorized for desired state
        } else {
          this.router.navigate(['/login']);
        }
      }
    }).catch((identity: Identity) => {
      this.router.navigate(['/login']);
    });
    return true;
  }
}
