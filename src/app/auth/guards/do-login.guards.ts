import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class DoLoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let accessToken = localStorage.getItem("access_token");
    let profileCompleted = JSON.parse(localStorage.getItem("profileCompleted"));
    let preferenceUpdated = JSON.parse(
      localStorage.getItem("preferenceUpdated")
    );
    if (!accessToken) return true;
    if (!profileCompleted) {
      this.router.navigate(["/info-form"]);
      return false;
    }
    if (!preferenceUpdated) {
      this.router.navigate(["/select-sports"]);
      return false;
    }
    this.router.navigate(["/tabs/home"]);
    return false;
  }
}
