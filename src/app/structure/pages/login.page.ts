import {HTTPStatusCodes} from '../../common/misc/http-status-codes';
import {Identity} from '../../common/oauth/identity';
import {LoginCredentials} from '../../common/oauth/login-credentials';
import {PrincipalService} from '../../common/oauth/principal.service';
import {AnonymousUserService} from '../../common/services/anonymous-user.service';
import {AbstractFormComponent} from '../../form-errors/abstract-form-component';
import {Component, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate';

declare var $: any;
declare var jQuery: any;
declare var Ladda: any;

@Component({
  selector: 'cat-page',
  templateUrl: './login.html'
})

export class PagesLogin extends AbstractFormComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loginButton: any;
  resetPwsButton: any;
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(private _principal: PrincipalService, private router: Router, private anonyous: AnonymousUserService, fb: FormBuilder, translate: TranslateService) {
    super(translate);

    this.loginForm = fb.group({
      emailAddress: ['', Validators.compose([Validators.required, Validators.maxLength(254), Validators.minLength(6), Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(7)])]
    });
    this.forgotPasswordForm = fb.group({
      emailAddress: ['', Validators.compose([Validators.required, Validators.maxLength(254), Validators.minLength(6), Validators.email])]
    });
  }

  ngOnInit() {
    this.loginButton = Ladda.create(document.querySelector('#login-button'));
    this.resetPwsButton = Ladda.create(document.querySelector('#reset-button'));
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
    this.loginForm.setErrors(null);
    if (this.loginForm.valid) {
      this.loginButton.start();
      this._principal.obtainAccessToken(
        new LoginCredentials(this.loginForm.value.emailAddress, this.loginForm.value.password, 'password', 'fooClientIdPassword')
      ).then((identity: Identity) => {
        this.router.navigateByUrl(this._principal.redirectUrl ? this._principal.redirectUrl : '/');
        this.loginButton.stop();
      }).catch((res: Response) => {
        this.loginButton.stop();
        this.handleSubmitError(res, this.loginForm);
      });
    }
  }

  forgotPassword(event: any) {
    event.preventDefault();
    this.forgotPasswordForm.setErrors(null);
    this.resetPwsButton.start();
    this.anonyous.resetPassword(this.forgotPasswordForm.value.emailAddress).then((res: Response) => {
      this.closeModal.nativeElement.click();
      this.resetPwsButton.stop();
      $.notify({
        title: '<h5>Temporary password sent</h5>',
        message: 'We have sent you a temporary password for you to access your account.'
      }, {
          type: 'success'
        });
    }).catch((res: Response) => {
      this.resetPwsButton.stop();
      return this.handleSubmitError(res, this.forgotPasswordForm);
    });
  }
}

