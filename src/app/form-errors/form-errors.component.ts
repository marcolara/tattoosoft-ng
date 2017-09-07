import { FormError } from './form-error';
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-form-errors',
  template: `
  <div *ngFor="let e of errors" class="notification is-danger">
    {{'errors.messages.' + e.error}}
  </div>
  `
})
export class FormErrorsComponent implements OnInit {

  @Input() errors: FormError[];

  constructor() {}

  ngOnInit() {
  }

}
