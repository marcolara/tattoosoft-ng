import {Component} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class AppComponent {
  constructor(private _cookieService: CookieService) {}

  getCookie(key: string) {
    return this._cookieService.get(key);
  }
}
