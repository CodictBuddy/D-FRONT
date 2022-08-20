import { UserService } from './../services/user.service';
import { UtilService } from './../utils/util.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit, OnDestroy {
  chatRoomSubscription: Subscription;
  memberInfo = {};
  textMessageString = ''
  roomId
  messagesList = []
  userFallbackImage = this.util.fallbackUserImage;
  constructor(
    private actionSheetController: ActionSheetController,
    private util: UtilService,
    private userService: UserService,
    private chatService: ChatService,
    private _socket: Socket
  ) {
    this.chatRoomSubscription = this.util.chatRoomDetailLive.subscribe((r) => {
      this.roomId = r._id
      this.getMyDetails(r.members);
    });

    this._socket.on('add-message', (res) => {
      res.senderUser = this.userService.getFullyProcessedUserData(res.sender_id)
      this.messagesList.push(res)
      console.log('i need to call notification service now', res);
    });
  }

  ngOnInit() {
    this.getMessageList(this.roomId)
  }
  ngOnDestroy(): void {
    this.chatRoomSubscription.unsubscribe();
  }

  getMyDetails(data) {
 this.memberInfo = this.userService.getFullyProcessedUserData(data)
  }

  async triggerMessage(text, roomId) {
    if (!text || !roomId) return;
    const fv = {
      room_id: roomId, user_id: this.memberInfo?.['_id'],
      message_type: "conversation",
      content: text
    }
    const res = await this.chatService.sendChatMessage(fv)
    if (res) this.textMessageString = ""
    res.senderUser = this.userService.getFullyProcessedUserData(res.sender_id)
    this.messagesList.push(res)
    console.log('what is text m getting here', text, res)
  }


  async getMessageList(room_id) {

    const messageRes = await this.chatService.getMessagesList({ room_id })
    this.messagesList = messageRes?.['messages']
    this.messagesList.forEach(el => {
      el.senderUser = this.userService.getFullyProcessedUserData(el.sender_id)
    })

  }


  async openActionSheet(i) {
    const b = this.util.modifyActionSheetOptions([

    ], this.util.alert_options.chat_options);
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {

    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Who can view your talk?',
      cssClass: '',
      buttons: [
        {
          text: 'Delete this conversation?',
          icon: 'trash',
          // data: 10,
          handler: () => {
            console.log('Share clicked');
          },
        },
        // {
        //   text: 'Cancel',
        //   icon: 'close',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   },
        // },
      ],
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
}
