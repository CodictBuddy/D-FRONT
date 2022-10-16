import { AuthService } from '../auth/auth.service';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../utils/util.service';

@Component({
  selector: 'app-reset-password-verification',
  templateUrl: './reset-password-verification.page.html',
  styleUrls: ['./reset-password-verification.page.scss'],
})
export class ResetPasswordVerificationPage implements OnInit {
  email = this.util.retrieveLocalStorage('email');
  _id = this.util.retrieveLocalStorage('_id');
  constructor(
    private auth: AuthService,
    private util: UtilService,
    private codeFormBuilder: FormBuilder
  ) {}
  codeForm: FormGroup = new FormGroup({});
  ngOnInit() {
    this.email = this.util.partialHideEmail(this.email);
    this.verifyMailFormBuilder();
  }

  verifyMailFormBuilder() {
    this.codeForm = this.codeFormBuilder.group({
      code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
    
  }

  resendCode() {
    this.auth.resendCode({ _id: this._id }).subscribe(
      (res) => {
        this.util.toast(res.status, 2000);
      },
      (err) => {
        console.log('code send Error', err);

        this.util.toast(err.error['message'], 2000);
      }
    );
  }

  verifyMail(valid, value) {
    if (valid) {
      this.auth
        .emailVarification({ code: +value.code, _id: this._id })
        .subscribe(
          (res) => {
            if (res.status === 'verified') {
            }
            const type = this.util.retrieveLocalStorage('type');
            if (type === 'sign_up') {
              this.util.routeNavigation('/complete-profile');
            } else {
              this.util.routeNavigation('/new-password');
            }
          },
          (err) => {
            console.log('Registration Error', err);

            this.util.toast(err.error['message'], 2000);
          }
        );
    }
  }
}
