import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseurl = environment.base_url;

  constructor(private http: HttpClient, private socket: Socket) {
    // this.socket.on('new-notification', () => {
    //   console.log('i need to call notification service now');
    //   this.getUnreadNotifications().then((res) => {
    //     console.log('result for unread notifications here', res);
    //   });
    // });
  }

  getAllNotifications(queryObject) {
    return this.http
      .get<any>(
        this.baseurl +
          `/notification?skip=${queryObject.skip}&limit=${queryObject.limit}`
      )
      .toPromise();
  }

  getUnreadNotifications() {
    return this.http
<<<<<<< HEAD
      .get<any>(this.baseurl +  `/notification/unread`)
=======
      .get<any>(this.baseurl + `/notification/unread`)
>>>>>>> bb88670204c20415f90044e4a8236bc838357f5a
      .toPromise();
  }

  updateNotificationStatus(_input) {
    return this.http
      .patch<any>(this.baseurl + `/notification`, _input)
      .toPromise();
  }

  removeNotification(id, type) {
    return this.http
      .delete<any>(this.baseurl + `/notification/${type}/${id}`)
      .toPromise();
  }
}
