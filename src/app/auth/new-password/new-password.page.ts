import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  selector: "app-new-password",
  templateUrl: "./new-password.page.html",
  styleUrls: ["./new-password.page.scss"],
})
export class NewPasswordPage implements OnInit {
  email_id: any;
  newpasswordForm: FormGroup;
  constructor(
    private newBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private util: UtilService
  ) {}

  ngOnInit() {
    this.email_id = this.route.snapshot.params["email_id"];
    this.newpasswordForm = this.newBuilder.group({
      user_email: [this.email_id],
      new_password: ["", [Validators.required, Validators.minLength(6)]],
      // new_password: ['', Validators.required],
      confirm_password: ["", [Validators.required, Validators.minLength(6)]],
      // confirm_password: ['', Validators.required],
    });
  }

  newpasswordAccess(valid, value) {
    if (valid) {
      this.auth.newpassword(value).subscribe(
        (res) => {
          console.log("login response", res);
          this.util.toast(res.message, 2000);
          this.router.navigate(["/login-email"]);
        },
        (err) => {
          this.util.toast(err.error["message"], 2000);
        }
      );
    }
  }
}
