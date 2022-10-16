import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseurl = environment.base_url;
  constructor(private http:HttpClient, private util: UtilService) { }

  createPost(_input){
    return this.http.post<any>(this.baseurl+ `/post`,_input).toPromise()
  }
}
