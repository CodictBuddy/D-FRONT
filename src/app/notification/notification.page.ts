import { UtilService } from './../utils/util.service';
import { NotificationService } from './../services/notification.service';
import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notification_list = [];
  notificationCount = 0;
  notification_alert_list = [];
  skip = 0;
<<<<<<< HEAD
  limit = 50;
=======
  limit = 5;
>>>>>>> bb88670204c20415f90044e4a8236bc838357f5a
  userFallbackImage = this.util.fallbackUserImage;

  constructor(
    private _socket: Socket,
    private notificationService: NotificationService,
    private util: UtilService
  ) {
    this._socket.on('new-notification', () => {
      this.fetchNotifications();
    });
  }

  ngOnInit() {
    this.notification_alert_list = this.util.alert_options.notification_options;
    this.fetchNotifications();
  }
  fetchNotifications() {
    this.notificationService
      .getAllNotifications({ skip: this.skip, limit: this.limit })
      .then((res) => {
        this.notification_list = res?.notifications;
<<<<<<< HEAD
        console.log('notilist = ', this.notification_list);
        
=======
>>>>>>> bb88670204c20415f90044e4a8236bc838357f5a
      });

    this.notificationService.getUnreadNotifications().then((res) => {
      this.notificationCount = res?.count;
    });
  }

  async markRead(notification) {
<<<<<<< HEAD
    if(!notification.isRead){
      notification.isRead = true;
    }
=======
    notification.isRead = true;
>>>>>>> bb88670204c20415f90044e4a8236bc838357f5a
    const payload = {
      isRead: true,
      notification_type: notification.type,
      user_id: notification.user_id,
      notification_id: notification._id,
    };
    const d = await this.notificationService.updateNotificationStatus(payload);
<<<<<<< HEAD
    console.log(d);
    
    if (d) {
      this.notificationCount;
      // console.log('noti objs',notification);
=======
    if (d) {
      this.notificationCount--;
>>>>>>> bb88670204c20415f90044e4a8236bc838357f5a
      if (notification?.navigation_url) {
        this.util.routeNavigation(`${notification.navigation_url}`);
      }
    }
<<<<<<< HEAD
    if(d.isNewNotification && !notification.isRead){
      this.notificationCount--;
    } 
=======
>>>>>>> bb88670204c20415f90044e4a8236bc838357f5a
  }

  async removeNotification(notification_id, notification_type) {
    await this.notificationService.removeNotification(
      notification_id,
      notification_type
    );
  }

  async openActionSheet(notification_id, notification_type, i) {
    const b = [
      {
        ...this.notification_alert_list[0],
        data: { notification_id, notification_type },
      },
    ];

    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {
      await this.removeNotification(
        data.notification_id,
        data.notification_type
      ).then(() => {
        this.notification_list = this.util.arrayItemRemover(
          i,
          this.notification_list
        );
      });
    }
  }
}
