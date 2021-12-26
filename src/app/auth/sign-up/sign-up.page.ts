import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/service/util.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  signupForm: FormGroup;
  constructor(private auth: AuthService, private signupBuilder: FormBuilder, private router: Router, private util: UtilService,private userService: UserService) { }

  ngOnInit() {
    // localStorage.getItem('access_token');
    // localStorage.setItem("access_token", accessToken[1]);
    this.signupForm = this.signupBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      conform_password: ['',[Validators.required, Validators.minLength(6)]],
    });
  }

  signupPassword(valid, value) {
   if(valid){
    if(value.password == value.conform_password){
      this.auth.signupPassword(value).subscribe(res => {
        localStorage.setItem(
          "access_token",
         res.access_token
        );
      console.log('token getting here',localStorage.getItem('access_token'))
        // this.router.navigate(["/info-form"])
        this.userAccessor()
        this.util.toast(res.message, 2000);
      }, (err) => {
        this.util.toast(err.error['message'], 2000);
      })
    }else{
      this.util.toast("Password does not match", 2000);
    }
  
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
