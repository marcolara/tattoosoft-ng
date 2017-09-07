import {FormError} from './form-error';
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-field-errors',
  template: `
  <li *ngFor="let e of errors" class="help is-danger">
    {{'errors.messages.' + e.error}}
  </li>
  `
})
export class FieldErrorsComponent implements OnInit {

  @Input() errors: FormError[];

  constructor() {}

  ngOnInit() {
  }

}
