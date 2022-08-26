import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  baseurl = environment.base_url;

  constructor(private http: HttpClient, private util: UtilService) {}

  getConnections(type) {
    return this.http.get<any>(this.baseurl + `/connection`).toPromise();
  }

  createConnection(_input) {
    return this.http
      .post<any>(this.baseurl + `/connection`, _input)
      .toPromise();
  }

  modifyConnection( _input) {
    return this.http
      .patch<any>(this.baseurl + `/connection`, _input)
      .toPromise();
  }

  removeConnection(user_id, connection_type) {
    return this.http
      .delete<any>(this.baseurl + `/connection/${user_id}/${connection_type}`)
      .toPromise();
  }


  getConnectionList(view_type, connection_type, connection_status) {
    return this.http
      .get<any>(
        this.baseurl +
          `/connection/${view_type}/${connection_type}/${connection_status}`
      )
      .toPromise();
  }

  getConnectionDetail(_input) {
    return this.http
      .post<any>(this.baseurl + `/connection/detail`, _input)
      .toPromise();
  }
}
