import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseurl = environment.base_url;

  constructor(private http: HttpClient, private util: UtilService) { }

  generateChatRoom(_input) {
    return this.http
      .post<any>(this.baseurl + `/chat/create-room`, _input)
      .toPromise();
  }

  getRoomData(_input) {
    return this.http
      .post<any>(this.baseurl + `/chat/get-room-detail`, _input)
      .toPromise();
  }

  getRoomList(skip, limit) {
    return this.http
      .get<any>(
        this.baseurl + `/chat/get-my-rooms-list?skip=${skip}&limit=${limit}`
      )
      .toPromise();
  }

  async createChatRoom(body) {
    const fv = {
      members: [body.user_id],
    };
    const data = await this.generateChatRoom(fv);
    console.log('data here for room creation', data);
  }

  sendChatMessage(_input) {
    return this.http
      .post<any>(this.baseurl + `/chat/new-message`, _input)
      .toPromise();
  }

  updateChatMessage(_input) {
    return this.http
      .post<any>(this.baseurl + `/chat/update-message`, _input)
      .toPromise();
  }

  removeChatMessage(_input) {
    return this.http
      .post<any>(this.baseurl + `/chat/delete-message`, _input)
      .toPromise();
  }

  getMessagesList(_input) {
    return this.http
      .post<any>(
        this.baseurl + `/chat/get-message-list`, _input
      )
      .toPromise();
  }

}
