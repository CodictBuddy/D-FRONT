import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class IsAuthorizedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}
