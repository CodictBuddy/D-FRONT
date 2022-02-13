import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseurl = environment.base_url;
  constructor(private http: HttpClient) {}

  login(_input) {
    return this.http.post<any>(this.baseurl + `/auth/login`, _input);
  }

  register(_input) {
    return this.http.post<any>(this.baseurl + `/user/signup`, _input);
  }

  updateProfile(_input) {
    return this.http.patch<any>(this.baseurl + `/user`, _input);
  }

  emailVarification(_input) {
    return this.http.post<any>(this.baseurl + `/user/verify/email`, _input);
  }

  forgotPassword(_input) {
    return this.http.post<any>(this.baseurl + `/user/forgotPassword`, _input);
  }

  resendCode(_input) {
    return this.http.post<any>(this.baseurl + `/user/resend/code`, _input);
  }

  setNewPassword(_input) {
    return this.http.post<any>(this.baseurl + `/user/resetPassword`, _input);
  }
}
