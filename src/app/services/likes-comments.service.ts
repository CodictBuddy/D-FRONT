import { UtilService } from './../utils/util.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikesCommentsService {
  baseurl = environment.base_url;
  constructor(private http: HttpClient, private util: UtilService) { }

  getLikesList(content_id) {
    return this.http.get<any>(this.baseurl + `/likes/${content_id}`).toPromise()
  }

  createLike(_input) {
    return this.http.post<any>(this.baseurl + `/likes`, _input).toPromise()
  }

  deleteLikes(content_id) {
    return this.http.delete<any>(this.baseurl + `/likes/${content_id}`).toPromise()
  }

  getCommentsList(content_id) {
    return this.http.get<any>(this.baseurl + `/comments/${content_id}`).toPromise()
  }

  createComment(_input) {
    return this.http.post<any>(this.baseurl + `/comments`, _input).toPromise()
  }


  updateComment(_input, comment_id) {
    return this.http.patch<any>(this.baseurl + `/comments/${comment_id}`, _input).toPromise()
  }

  deleteComment(content_id) {
    return this.http.delete<any>(this.baseurl + `/comments/${content_id}`).toPromise()
  }

}
