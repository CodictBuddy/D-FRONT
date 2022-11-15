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
}
