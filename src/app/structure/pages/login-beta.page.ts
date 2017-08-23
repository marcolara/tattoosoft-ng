import { Identity } from '../../common/oauth/identity';
import {LoginCredentials} from '../../common/oauth/login-credentials';
import {PrincipalService} from '../../common/oauth/principal.service';
import {Component, OnInit} from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './login-beta.html'
})

export class PagesLoginBeta implements OnInit {
  model = new LoginCredentials('','');
  
  constructor(private _principal: PrincipalService) {

  }

  ngOnInit() {

    $(function() {

      // Form Validation
      $('#form-validation').validate({
        submit: {
          settings: {
            inputContainer: '.form-group',
            errorListClass: 'form-control-error',
            errorClass: 'has-danger'
          }
        }
      });

      // Show/Hide Password
      $('.password').password({
        eyeClass: '',
        eyeOpenClass: 'icmn-eye',
        eyeCloseClass: 'icmn-eye-blocked'
      });

      // Switch to fullscreen
      $('.switch-to-fullscreen').on('click', function() {
        $('.cat__pages__login').toggleClass('cat__pages__login--fullscreen');
      })

      // Change BG
      $('.random-bg-image').on('click', function() {
        var min = 1, max = 5,
          next = Math.floor($('.random-bg-image').data('img')) + 1,
          final = next > max ? min : next;

        $('.random-bg-image').data('img', final);
        $('.cat__pages__login').data('img', final).css('backgroundImage', 'url(assets/modules/pages/common/img/login/' + final + '.jpg)');
      })

    });

  }
  login(event: any, username: string, password: string) {
    event.preventDefault();
    this._principal.obtainAccessToken(new LoginCredentials(username, password)).then((identity: Identity) => {
      console.log(identity);
    }).catch((error) => {
      console.log(error);
    });
  }
  
  get diagnostic() { return JSON.stringify(this.model); }
}

