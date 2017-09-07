import {HTTPStatusCodes} from '../common/misc/http-status-codes';
import {FormError} from './form-error';
import {AbstractControl, FormGroup} from '@angular/forms';
import {TranslateService} from 'ng2-translate';

export abstract class AbstractFormComponent {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  public formErrors(form: FormGroup): FormError[] {
    if (form.errors) {
      return this.getErrors(form);
    }
  }

  public fieldErrors(name: string, form: FormGroup): FormError[] {
    let control = this.findFieldControl(name, form);
    if (control && (control.touched) && control.errors) {
      return this.getErrors(control);
    } else {
      return undefined;
    }
  }

  public resetFieldErrors(name: string, form: FormGroup): void {
    form.get(name).setErrors(null);
  }

  public clearForm(form: FormGroup) {
    form.setErrors(null);
    form.reset();
  }

  protected handleSubmitError(error: Response, form: FormGroup) {
    let body = error.json();
    const fields = Object.keys(body['errorMap'] || {});
    fields.forEach((field) => {
      const control = this.findFieldControl(field, form);
      const errors = this.fetchFieldErrors(body['errorMap'], field);
      control.setErrors(errors);
    });
    if (fields.length <= 0 && error.status) {
      switch (error.status) {
        case HTTPStatusCodes.BAD_REQUEST:
          if (body['error']) {
            let err = {};
            err[body['error']] = true;
            form.setErrors(err);
            break;
          }
        default:
          let err = {};
          err[error.status] = true;
          form.setErrors(err);
      }
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
      errors[e] = true;
    });
    return errors;
  }
}
