import { SocketService } from './../../services/socket.service';
import { AuthService } from '../auth.service';
import { UtilService } from '../../utils/util.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide: Boolean = true;
  loginForm: FormGroup;

  constructor(
    public platform: Platform,
    private loginBuilder: FormBuilder,
    private util: UtilService,
    private auth: AuthService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    this.loginFormBuilder();
  }
  // https://alligator.io/nodejs/express-cookies/  reference for cookies from node js
  loginFormBuilder() {
    this.loginForm = this.loginBuilder.group({
      user_email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loginAccess(valid, value) {
    if (valid) {
      this.auth.login(value).subscribe(
        (res) => {
          console.log('login response', res);
          this.util.toast('Login Successfully', 2000);
          this.util.setLocalStorage('access_token', res.access_token);
          this.util.setLocalStorage('user_data', res.user);
          this.util.routeNavigation('/');
          this.loginFormBuilder();
          this.socket.loginUserSocket(res?.user?._id);
        },
        (err) => {
          console.log('Login Error', err);

          this.util.toast(err.error['message'], 2000);
        }
      );
    }
  }

  toggleView() {
    this.hide = !this.hide;
  }
}
