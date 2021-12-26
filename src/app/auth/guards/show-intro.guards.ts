import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ShowIntroGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let hideIntro = localStorage.getItem("hideIntro");
    if (!hideIntro) {
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}
