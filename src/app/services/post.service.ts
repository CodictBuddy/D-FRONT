import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseurl = environment.base_url;
  constructor(private http: HttpClient, private util: UtilService) { }

  createPost(_input) {
    return this.http.post<any>(this.baseurl + `/post`, _input).toPromise()
  }
  updatePost(_input) {
    return this.http.patch<any>(this.baseurl + `/post`, _input).toPromise()
  }
  getPostDetail(_id) {
    return this.http.get<any>(this.baseurl + `/post/${_id}`).toPromise()
  }
  myCreatedPostList(_input) {
    return this.http.post<any>(this.baseurl + `/post/my_posts`, _input).toPromise()
  }
  publicAndConnectionPost(_input) {
    return this.http.post<any>(this.baseurl + `/post/all_posts`, _input).toPromise()
  }
  // deletePost(_input) {
  //   return this.http.delete<any>(this.baseurl + `/post`, _input).toPromise()
  // }
}
