import {HTTPStatusCodes} from '../../common/misc/http-status-codes';
import {Identity} from '../../common/oauth/identity';
import {LoginCredentials} from '../../common/oauth/login-credentials';
import {PrincipalService} from '../../common/oauth/principal.service';
import {AnonymousUserService} from '../../common/services/anonymous-user.service';
import {FormError} from '../../form-errors/form-error';
import {Component, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';

declare var $: any;
declare var jQuery: any;
declare var Ladda: any;

@Component({
  selector: 'cat-page',
  templateUrl: './login.html'
})

export class PagesLogin implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loginButton: any;
  resetPwsButton: any;
  model: LoginCredentials;
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(private _principal: PrincipalService, private router: Router, private anonyous: AnonymousUserService, fb: FormBuilder) {
    this.model = new LoginCredentials('', '', 'password', 'fooClientIdPassword');
    this.loginForm = fb.group({
      username: ['', Validators.compose([Validators.required, Validators.maxLength(254), Validators.minLength(6), Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(7)])]
    });
    this.forgotPasswordForm = fb.group({
      username: ['', Validators.compose([Validators.required, Validators.maxLength(254), Validators.minLength(6), Validators.email])]
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
      this._principal.obtainAccessToken(this.model).then((identity: Identity) => {
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
    this.resetPwsButton.start();
    this.anonyous.resetPassword(this.model.username).then((res: Response) => {
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
      if (res.status === HTTPStatusCodes.BAD_REQUEST) {
        let body = res.json();
      }
    });
  }

  formErrors(form: FormGroup): FormError[] {
    if (form.errors) {
      return this.getErrors(form);
    }
  }

  fieldErrors(name: string, form: FormGroup): FormError[] {
    let control = this.findFieldControl(name, form);
    if (control && (control.touched) && control.errors) {
      return this.getErrors(control);
    } else {
      return undefined;
    }
  }

  resetFieldErrors(name: string, form: FormGroup): void {
    form.get(name).setErrors(null);
  }

  protected handleSubmitSuccess() {
    //
  }

  protected handleSubmitError(error: Response, form: FormGroup) {
    switch (error.status) {
      default:
        let err = {};
        err[error.status] = true;
        form.setErrors(err);
    }
  }

  protected getErrors(control: AbstractControl): FormError[] {
    return Object.keys(control.errors)
      .filter((error) => control.errors[error])
      .map((error) => {
        let params = control.errors[error];
        return {
          error: error,
          params: params === true || params == {} ? null : params
        };
      });
  }

  protected findFieldControl(field: string, form: FormGroup): AbstractControl {
    let control: AbstractControl;
    if (field === 'base') {
      control = form;
    } else if (form.contains(field)) {
      control = form.get(field);
    } else if (field.match(/_id$/) && form.contains(field.substring(0, field.length - 3))) {
      control = form.get(field.substring(0, field.length - 3));
    } else if (field.indexOf('.') > 0) {
      let group = form;
      field.split('.').forEach((f) => {
        if (group.contains(f)) {
          control = group.get(f);
          if (control instanceof FormGroup) group = control;
        } else {
          control = group;
        }
      })
    } else {
      // Field is not defined in form but there is a validation error for it, set it globally
      control = form;
    }
    return control;
  }

  private fetchFieldErrors(data: any, field: string): any {
    const errors = {};
    data[field].forEach((e) => {
      let name: string = e.error;
      delete e.error;
      errors[name] = e;
    });
    return errors;
  }
}

