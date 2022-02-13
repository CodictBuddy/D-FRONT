import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../utils/util.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit {
  completeProfileForm: FormGroup;
  constructor(
    private completeProfileBuilder: FormBuilder,
    private util: UtilService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.completeProfileFormBuilder();
  }

  completeProfileFormBuilder() {
    this.completeProfileForm = this.completeProfileBuilder.group({
      user_gender: ['Male', [Validators.required]],
      user_about: ['', [Validators.required]],
      user_headline: ['', [Validators.required]],
      user_dob: [''],
    });
  }

  completeProfile(valid, value) {
    if (valid) {
      this.auth
        .updateProfile({ ...value, ...this.util.default_language })
        .subscribe(
          (res) => {
            this.util.setLocalStorage('user_data',res.user)
            this.util.setLocalStorage('access_token',res.access_token)
            this.router.navigateByUrl('/profile-image');
          },
          (err) => {
            console.log('complete profile Error', err);

            this.util.toast(err.error['message'], 2000);
          }
        );
    }
  }
}
