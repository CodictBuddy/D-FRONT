import { Router } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { UtilService } from './../utils/util.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
// ImageUploadPage
export class SignupPage implements OnInit {
  hide: Boolean = false;
  signUpForm: FormGroup = new FormGroup({});
  constructor(
    private signUpBuilder: FormBuilder,
    private util: UtilService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signUpFormBuilder();
  }

  signUpFormBuilder() {
    this.signUpForm = this.signUpBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
    });
  }

  register(valid, value) {
    if (valid) {
      this.auth.register({ ...value, ...this.util.default_language }).subscribe(
        (res) => {
          this.util.setLocalStorage('email', value.email);
          this.util.setLocalStorage('_id', res.user._id);
          this.util.setLocalStorage('type', 'sign_up');
          this.util.setLocalStorage('access_token', res.access_token);
          this.util.routeNavigation('/reset-password');
        },
        (err) => {
          this.util.toast(err.error['message'], 2000);
        }
      );
    }
  }

  toggleView() {
    this.hide = !this.hide;
  }
}
