import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UtilService } from '../utils/util.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  hide: boolean = false;
  _id = this.util.retrieveLocalStorage('_id');
  npForm: FormGroup;

  constructor(
    public platform: Platform,
    private npBuilder: FormBuilder,
    private util: UtilService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.newPasswordBuilder();
  }

  newPasswordBuilder() {
    this.npForm = this.npBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        reTypePassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value ===
      frm.controls['reTypePassword'].value
      ? null
      : { mismatch: true };
  }

  setNp(valid, value) {
    if (valid) {
      this.auth
        .setNewPassword({ _id: this._id, password: value.password })
        .subscribe(
          (res) => {
            this.util.toast('Password Reset Successfully', 2000);
            this.util.routeNavigation('/login');
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
