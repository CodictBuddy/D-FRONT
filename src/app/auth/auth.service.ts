import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl = environment.base_url;
  constructor(private http: HttpClient) { }

  login(_input) {
    return this.http.post<any>(this.baseurl + `/auth/login`, _input);
  }
}
