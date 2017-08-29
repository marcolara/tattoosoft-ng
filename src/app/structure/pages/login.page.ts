import {Identity} from '../../common/oauth/identity';
import {LoginCredentials} from '../../common/oauth/login-credentials';
import {PrincipalService} from '../../common/oauth/principal.service';
import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './login.html'
})

export class PagesLogin implements OnInit {
  model: LoginCredentials;
  globalErrors: string[];

  constructor(private _principal: PrincipalService, private router: Router) {
    this.model = new LoginCredentials('', '', 'password', 'fooClientIdPassword');
    this.globalErrors = [];
    this._principal.errorHandled$.subscribe(value => {
      this.globalErrors.push('error connection.');
    });
  }

  ngOnInit() {
    $(function() {
      // Show/Hide Password
      $('.password').password({
        eyeClass: '',
        eyeOpenClass: 'icmn-eye',
        eyeCloseClass: 'icmn-eye-blocked'
      });
    });
  }
  login(event: any) {
    event.preventDefault();
    this.clearErrors();
    this._principal.obtainAccessToken(this.model).then((identity: Identity) => {
      this.router.navigateByUrl(this._principal.redirectUrl ? this._principal.redirectUrl : '/');
    }).catch((response: Response) => {
    });
  }
  forgotPassword(event: any) {
    event.preventDefault();
    
  }
  private clearErrors(): void {
    this.globalErrors = [];
  }
}

