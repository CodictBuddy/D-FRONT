import { UtilService } from './../utils/util.service';
import { SocketService } from './../services/socket.service';
import { Socket } from 'ngx-socket-io';
import { NotificationService } from './../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  notificationCount = 0;

  constructor(
    private notificationService: NotificationService,
    private _socket: Socket,
    private auth: AuthService,
    private chatService: ChatService,
    private socket: SocketService,
    private util: UtilService,
    public plt: Platform
  ) {
    const user = this.util.retrieveLocalStorage('user_data');
    this.socket.loginUserSocket(JSON.parse(user)['_id']);

    this.plt.ready().then(() => { });

    this._socket.on('new-notification', () => {
      console.log('i need to call notification service now');
      this.getUnreadNotificationCount();
    });
  }

  async getRoomsList() {
    const chatRooms = await this.chatService.getRoomList(0, 1000);
    chatRooms.map(el => {
      if (el) {
        this.socket.loginUserSocket(el._id);
      }
    })
  }

  ngOnInit() {
    this.getUnreadNotificationCount();
    this.getRoomsList()
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.auth
        .updateProfile({ user_notification_token: token.value })
        .toPromise()
        .then((res) => {
          // alert(`${res} token stored successfully in db`);
        });
      console.log('Push registration success, token: ' + token.value);
      // alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
      // alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        // alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  getUnreadNotificationCount() {
    this.notificationService.getUnreadNotifications().then((res) => {
      this.notificationCount = res?.count;
    });
  }
}
