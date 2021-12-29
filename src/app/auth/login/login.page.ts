// import { UserService } from "./../../service/user.service";
import { environment } from "./../../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
// import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Platform } from "@ionic/angular";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  hide:Boolean = false
  constructor(
    private router: Router,
    public platform: Platform,
    // private iab: InAppBrowser,
    // private userService: UserService
  ) {}

  ngOnInit() {}
  addMessageListener() {
    if (!window["hasListener"]) {
      window.addEventListener("message", (message) => {
        console.log("called msg listener");
        localStorage.setItem(
          "access_token",
          JSON.parse(message.data).user.access_token
        );
        this.userAccessor();
      });
      window["hasListener"] = true;
    }
  }
  doFLogin() {
    // this.addMessageListener();
    // this.openPopUp(environment.base_url + "/auth/facebook");
  }
  openPopUp(openLink: string) {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        // const browser = this.iab.create(openLink, "_blank", {
        //   hideurlbar: "yes",
        //   fullscreen: "yes",
        //   zoom: "no",
        //   location: "no",
        //   hidenavigationbuttons: "yes",
        // });

        // browser.on("loadstop").subscribe((response) => {
        //   if (response.url.includes("loginstatus")) {
        //     let accessToken = response.url.split(/success=/);
        //     localStorage.setItem("access_token", accessToken[1]);
        //     console.log("user access token here", accessToken[1]);
        //     browser.close();
        //     this.userAccessor();
        //   }
        // });
      } else {
        window.open(openLink);
      }
    });
  }

  userAccessor() {
    // this.userService.getProfileDetail().subscribe((res) => {
    //   localStorage.setItem("user_detail", JSON.stringify(res.user));
    //   // localStorage.setItem("user_token_expires_in", res.token_expires_in);
    //   localStorage.setItem("preferenceUpdated", res.preferenceUpdated);
    //   localStorage.setItem("profileCompleted", res.profileCompleted);
    //   this.userService.updateUserDetail();
    //   if (res.profileCompleted === true && res.preferenceUpdated === false) {
    //     return this.router.navigate(["/select-sports"]);
    //   }
    //   if (res.profileCompleted === true && res.preferenceUpdated === true) {
    //     return this.router.navigate(["/current-location"]);
    //   }
    //   this.router.navigate(["/info-form"]);
    // });
  }

  doGLogin() {
    this.addMessageListener();
    // this.openPopUp(environment.base_url + "/auth/google");
  }
  doELogin() {
    this.router.navigate(["/login-email"]);
  }

  toggleView(){
    this.hide =!this.hide
  }
}
