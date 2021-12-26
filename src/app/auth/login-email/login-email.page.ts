import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { UtilService } from 'src/app/service/util.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.page.html',
  styleUrls: ['./login-email.page.scss'],
})
export class LoginEmailPage implements OnInit {
  hide = true;
  loginForm: FormGroup;
  constructor(
    private loginBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
    private userService: UserService
  ) { }

  ngOnInit() {
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
          localStorage.setItem(
            "access_token",
           res.access_token
          );
          this.userAccessor()
        },
        (err) => {
          console.log('Login Error',err);
          
          this.util.toast(err.error['message'], 2000);
        }
      );
    }
  }

  userAccessor() {
    this.userService.getProfileDetail().subscribe((res) => {
      localStorage.setItem("user_detail", JSON.stringify(res.user));
      // localStorage.setItem("user_token_expires_in", res.token_expires_in);
   
      localStorage.setItem("preferenceUpdated", res.preferenceUpdated);
      localStorage.setItem("profileCompleted", res.profileCompleted);
      this.userService.updateUserDetail();
      if (res.profileCompleted === true && res.preferenceUpdated === false) {
        return this.router.navigate(["/select-sports"]);
      }
      if (res.profileCompleted === true && res.preferenceUpdated === true) {
        return this.router.navigate(["/current-location"]);
      }
      this.router.navigate(["/info-form"]);
    });
  }


}
