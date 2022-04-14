import { UtilService } from './../utils/util.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-manage',
  templateUrl: './profile-manage.page.html',
  styleUrls: ['./profile-manage.page.scss'],
})
export class ProfileManagePage implements OnInit {
  updateProfileForm: FormGroup = new FormGroup({});
  user = {};
  constructor(
    private userService: UserService,
    private util: UtilService,
    private updateProfileBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const userData = this.userService.getMyDetails();
    this.user = this.userService.processData(
      userData,
      this.util.default_language
    );
    this.updateProfileFormBuilder();
    this.user = this.userService.profilePatchingObject(this.user);
    this.updateProfileForm.patchValue(this.user);
  }

  updateProfileFormBuilder() {
    this.updateProfileForm = this.updateProfileBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      user_headline: ['', [Validators.required]],
      user_about: ['', [Validators.required]],
    });
  }

  async updateProfile(data, valid) {
    if (valid) {
      const updatedData = await this.userService.updateUserProfile({
        ...data,
        ...this.util.default_language,
      });
      if (updatedData) {
        this.userService.userData.next({});
        this.util.routeNavigation('/dashboard');
      }
    }
  }
}
