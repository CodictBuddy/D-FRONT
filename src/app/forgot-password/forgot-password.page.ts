import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UtilService } from '../utils/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  emailForm: FormGroup;
  constructor(
    private auth: AuthService,
    private util: UtilService,
    private router: Router,
    private emailFormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.forgotPassForm();
  }

  forgotPassForm() {
    this.emailForm = this.emailFormBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
    });
  }

  forgotPassword(valid, value) {
    if (valid) {
      this.auth.forgotPassword(value).subscribe(
        (res) => {
          localStorage.setItem('email', value.email);
          localStorage.setItem('_id', res._id);
          localStorage.setItem('type', 'forgot_password');
          this.router.navigateByUrl('/reset-password');
        },
        (err) => {
          console.log('forgot password  Error', err);

          this.util.toast(err.error['message'], 2000);
        }
      );
    }
  }
}
