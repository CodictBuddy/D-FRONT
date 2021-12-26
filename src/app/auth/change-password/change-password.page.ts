import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changepasswordForm: FormGroup;
  constructor(
    private changeBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
  ) {}

  ngOnInit() {
    this.changepasswordForm = this.changeBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      // password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      // new_password: ['', Validators.required],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      // confirm_password: ['', Validators.required],
    });
  }

  changepasswordAccess(valid, value) {
    if (valid) {
      if(value.new_password == value.confirm_password ){
        this.auth.changepassword(value).subscribe(
          (res) => {
            console.log('login response', res);
            localStorage.setItem('accessToken', res.access_token);
            this.util.toast('Password has changed successfully', 2000);
            this.router.navigate(['/']);
          },
          (err) => {
            this.util.toast(err.error['message'], 2000);
          }
        );
      }else{
        this.util.toast('Password does not match', 2000);
      }
      
    }
  }
}
