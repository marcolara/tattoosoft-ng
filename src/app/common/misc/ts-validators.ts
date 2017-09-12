import {AnonymousUserService} from '../services/anonymous-user.service';
import {AbstractControl, ValidatorFn} from '@angular/forms';

export class TSValidators {
  static strongRegex: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
  static mediumRegex: RegExp = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

  static strongPassword: any = function(control: AbstractControl) {
    if (!TSValidators.strongRegex.test(control.value)) {
      return {
        'strong-password': true
      };
    }
    return null;
  };

  static mediumPassword: any = function(control: AbstractControl) {
    if (!TSValidators.mediumRegex.test(control.value)) {
      return {
        'medium-password': true
      };
    }
    return null;
  };
}
