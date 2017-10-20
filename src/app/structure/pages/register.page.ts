import {TSValidators} from '../../common/misc/ts-validators';
import {AnonymousUserService} from '../../common/services/anonymous-user.service';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {AbstractFormComponent} from '../../form-errors/abstract-form-component';
import {TranslateService} from 'ng2-translate';

declare var Ladda: any;

@Component({
  selector: 'cat-page',
  templateUrl: './register.html'
})

export class PagesRegister extends AbstractFormComponent implements OnInit {
  regForm: FormGroup;
  regButton: any;
  regFormName: string = 'AccountForm';

  constructor(private anonymous: AnonymousUserService, private fb: FormBuilder, private translate: TranslateService) {
    super(translate);
    this.regForm = fb.group({
      emailAddress: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(254),
        Validators.minLength(6),
        Validators.email
      ]),
        Validators.composeAsync([this.validateField.bind(this)])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(8),
        TSValidators.strongPassword
      ])]
    });
  }

  ngOnInit() {
    this.regButton = Ladda.create(document.querySelector('#reg-button'));
  }

  validateField(control: AbstractControl): Promise<ValidationResult> {
    // Avoids initial check against an empty string
    if (!control.value.length) {
      Promise.resolve(null);
    }
    return this.anonymous.validateField(this.getControlName(control), this.regFormName, control.value)
      .then().catch((res: Response) => {
        this.regButton.stop();
        return this.handleSubmitError(res, this.regForm);
    });
  }
}

interface ValidationResult {
  [key: string]: boolean;
}
