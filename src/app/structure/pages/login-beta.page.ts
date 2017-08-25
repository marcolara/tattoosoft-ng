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
  templateUrl: './login-beta.html'
})

export class PagesLoginBeta implements OnInit {
  model: LoginCredentials;
  globalErrors: string[];

  constructor(private _principal: PrincipalService, private router: Router) {
    this.model = new LoginCredentials('', '', 'password', 'fooClientIdPassword');
    this.globalErrors = [];
    this._principal.errorHandled$.subscribe(value => {
      console.log('subscribe' + value);
      this.globalErrors.push('error connection.')
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
      this.router.navigateByUrl('/');
    }).catch((response: Response) => {
      
    });
  }
  clearErrors(): void {
    this.globalErrors = [];
  }
}

