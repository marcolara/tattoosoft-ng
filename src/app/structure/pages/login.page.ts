import {HTTPStatusCodes} from '../../common/misc/http-status-codes';
import {Identity} from '../../common/oauth/identity';
import {LoginCredentials} from '../../common/oauth/login-credentials';
import {PrincipalService} from '../../common/oauth/principal.service';
import {AnonymousUserService} from '../../common/services/anonymous-user.service';
import {Component, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
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
  loginErrors: number;
  resetPwErrorCode: number;
  resetPwErrorMsg: string;
  @ViewChild('closeModal') closeModal: ElementRef;
  pswResetSubmitPending: boolean = false;
  loginSubmitPending: boolean = false;

  constructor(private _principal: PrincipalService, private router: Router, private anonyous: AnonymousUserService) {
    this.model = new LoginCredentials('', '', 'password', 'fooClientIdPassword');
  }

  ngOnInit() {
    this.clearErrors();
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
    this.loginSubmitPending = true;
    this._principal.obtainAccessToken(this.model).then((identity: Identity) => {
      this.router.navigateByUrl(this._principal.redirectUrl ? this._principal.redirectUrl : '/');
      this.loginSubmitPending = false;
    }).catch((res: Response) => {
      this.loginErrors = res.status;
      this.loginSubmitPending = false;
    });
  }

  forgotPassword(event: any) {
    event.preventDefault();
    this.clearErrors();
    this.pswResetSubmitPending = true;
    this.anonyous.resetPassword(this.model.username).then((res: Response) => {
      this.closeModal.nativeElement.click();
      $.notify({
        title: '<h5>Temporary password sent</h5>',
        message: 'We have sent you a temporary password for you to access your account.'
      }, {
          type: 'success'
        });
      this.pswResetSubmitPending = false;
    }).catch((res: Response) => {
      this.resetPwErrorCode = res.status;
      if (res.status === HTTPStatusCodes.BAD_REQUEST) {
        let body = res.json();
        this.resetPwErrorMsg = res.json()['errorMap']['emailAddress'];
      }
      this.pswResetSubmitPending = false;
    });
  }

  private clearErrors(): void {
    this.loginErrors = null;
    this.resetPwErrorCode = null;
    this.resetPwErrorMsg = null;
    this.pswResetSubmitPending = false;
    this.loginSubmitPending = false;
  }
}

