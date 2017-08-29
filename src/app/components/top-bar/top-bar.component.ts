import { Identity } from '../../common/oauth/identity';
import { PrincipalService } from '../../common/oauth/principal.service';
import {Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cat-top-bar',
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  identity: Identity;
  constructor(private _principal: PrincipalService, private router: Router) {
    _principal.identity().then(_identity => {
      this.identity = _identity;
    }).catch(data => {});
  }

  logout(event: any) {
    event.preventDefault();
    this._principal.clearAccess();
    this.router.navigate(['/login']);
  }
}
