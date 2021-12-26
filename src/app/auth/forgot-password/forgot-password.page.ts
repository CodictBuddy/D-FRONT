import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { UtilService } from "src/app/service/util.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  forgotForm: FormGroup;
  resetForm: FormGroup;
  resetcode: boolean = false;
  user_detail: any;

  constructor(
    private forgotBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private util: UtilService
  ) {}

  ngOnInit() {
    this.forgotForm = this.forgotBuilder.group({
      user_email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ],
      ],
    });

    this.resetForm = this.forgotBuilder.group({
      resetCode: ["", [Validators.required]],
    });
  }

  forgotAccess(valid, value) {
    if (valid) {
      this.user_detail = value.user_email;

      console.log("user creds here in forgot pass", value);
      this.auth.forgot(value).subscribe(
        (res) => {
          this.resetcode = true;
          console.log("login response", res);
          this.util.toast(res.message, 2000);
        },
        (err) => {
          this.util.toast(err.error["message"], 2000);
        }
      );
    }
  }

  resetAccess(valid, value) {
    console.log("validation tracker", valid, value);
    if (valid) {
      value["user_detail"] = this.user_detail;

      this.auth.reset(value).subscribe(
        (res) => {
          console.log("res tracker here", this.user_detail);
          console.log("login response", res);
          this.util.toast(res.message, 2000);
          this.router.navigate(["/new-password", this.user_detail]);
        },
        (err) => {
          this.util.toast(err.error["message"], 2000);
        }
      );
    }
  }
}
