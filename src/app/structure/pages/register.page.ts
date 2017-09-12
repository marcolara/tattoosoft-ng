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

  constructor(private anonyous: AnonymousUserService, fb: FormBuilder, translate: TranslateService) {
    super(translate);
    this.regForm = fb.group({
      emailAddress: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(254),
        Validators.minLength(6),
        Validators.email
      ]),
        Validators.composeAsync([this.validateField])],
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
    return null;
  }
}

interface ValidationResult {
  [key: string]: boolean;
}
