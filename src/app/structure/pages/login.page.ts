import { HTTPStatusCodes } from '../../common/misc/http-status-codes';
import {Identity} from '../../common/oauth/identity';
import {LoginCredentials} from '../../common/oauth/login-credentials';
import {PrincipalService} from '../../common/oauth/principal.service';
import {Component, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';
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
  loginErrors: number[] = [];
  resetPwErrors: number[] = [];
  closeModal: ElementRef;

  constructor(private _principal: PrincipalService, private router: Router) {
    this.model = new LoginCredentials('', '', 'password', 'fooClientIdPassword');
    this.loginErrors = [];
//    this._principal.errorHandled$.subscribe((code: HTTPStatusCodes) => {
//      this.loginErrors.push(code.toString());
//    });
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
    }).catch((res: Response) => {
      this.loginErrors.push(res.status);
    });
  }

  forgotPassword(event: any) {
    event.preventDefault();
    this.clearErrors();
    this._principal.resetPassword().then((res: Response) => {
       this.closeModal.nativeElement.click();
    }).catch((res: Response) => {
      this.resetPwErrors.push(res.status);
    });
  }

  private clearErrors(): void {
    this.loginErrors = [];
    this.resetPwErrors = [];
  }
}

