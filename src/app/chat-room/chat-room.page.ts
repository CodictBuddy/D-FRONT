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
  textMessageString = '';
  roomId;
  messagesList = [];
  userFallbackImage = this.util.fallbackUserImage;
  myInfo = {};
  updateMessageInfo = {};
  constructor(
    private actionSheetController: ActionSheetController,
    private util: UtilService,
    private userService: UserService,
    private chatService: ChatService,
    private _socket: Socket
  ) {
    this.chatRoomSubscription = this.util.chatRoomDetailLive.subscribe((r) => {
      this.roomId = r._id;
      this.getMyDetails(r.members);
    });

    this._socket.on('add-message', (res) => {
      console.log(
        'i need to call notification service now add message socket',
        res
      );
      res.senderUser = this.userService.getFullyProcessedUserData(
        res.sender_id
      );
      this.messagesList.push(res);
    });

    this._socket.on('updateMessage', (res) => {
      if (res && this.myInfo['_id'] !== this.messagesList[res.position].senderUser._id) {
        this.messagesList[res.position].content = res.updated_mesasge?.content;
        this.messagesList[res.position].is_edited = res.updated_mesasge?.is_edited;
        this.messagesList[res.position].updated_at = res.updated_mesasge?.updated_at;

      }
    })
  }

  ngOnInit() {
    this.getMessageList(this.roomId);

    this.myInfo = this.userService.getFullyProcessedUserData(
      this.userService.getMyDetails()
    );
  }
  ngOnDestroy(): void {
    this.chatRoomSubscription.unsubscribe();
  }

  getMyDetails(data) {
    this.memberInfo = this.userService.getFullyProcessedUserData(data);
  }

  async triggerMessage(text, roomId) {
    if (!text || !roomId) return;
    if (this.updateMessageInfo?.['isEditClicked']) {
      this.modifyMessage({
        ...this.updateMessageInfo,
        content: this.textMessageString,
        roomId,
      });
      return;
    }
    const fv = {
      room_id: roomId,
      user_id: this.memberInfo?.['_id'],
      message_type: 'conversation',
      content: text,
    };

    const res = await this.chatService.sendChatMessage(fv);
    if (res) this.textMessageString = '';
    res.senderUser = this.userService.getFullyProcessedUserData(res.sender_id);
    this.messagesList.push(res);
    console.log('what is text m getting here', text, res);
  }

  async modifyMessage(data) {
    const fv = {
      room_id: data.roomId,
      message_id: data.messageId,
      content: data.content,
      position: data.position,
      created_at: data.createdAt,
    };
    console.log('final fv formed here for update', fv);
    const resData = await this.chatService.updateChatMessage(fv);

    if (resData) {
      this.textMessageString = '';
      this.messagesList[fv.position].content = resData.updatedData?.content;
      this.messagesList[fv.position].is_edited = resData.updatedData?.is_edited;
      this.messagesList[fv.position].updated_at = resData.updatedData?.updated_at;
      console.log('what is updated data here', resData, this.messagesList[data.position]);
      this.updateMessageInfo = {}
    }
  }

  async getMessageList(room_id) {
    const messageRes = await this.chatService.getMessagesList({ room_id });
    this.messagesList = messageRes?.['messages'];
    this.messagesList.forEach((el) => {
      el.senderUser = this.userService.getFullyProcessedUserData(el.sender_id);
    });
  }

  async openActionSheet(i) {
    console.log(
      'message info here---',
      this.messagesList[i],
      this.memberInfo?.['_id'],
      this.myInfo
    );
    console.log(
      'date compare--',
      new Date().toISOString(),
      this.messagesList[i].created_at,
      this.util.compareDateIso(
        new Date().toISOString(),
        this.messagesList[i].created_at
      )
    );
    let hideOptions = [];
    const isToday = this.util.compareDateIso(
      new Date().toISOString(),
      this.messagesList[i].created_at
    );
    if (this.myInfo['_id'] == this.messagesList[i].senderUser._id && isToday) {
      hideOptions = [];
    } else {
      hideOptions = [
        this.util.alert_options.chat_options[1].text,
        this.util.alert_options.chat_options[2].text,
      ];
    }

    const b = this.util.modifyActionSheetOptions(
      hideOptions,
      this.util.alert_options.chat_options
    );
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {
      if (this.util.alert_options.chat_options[1].text) {
        this.textMessageString = this.messagesList[i].content;
        this.updateMessageInfo = {
          isEditClicked: true,
          position: i,
          messageId: this.messagesList[i]._id,
          content: this.textMessageString,
          createdAt: this.messagesList[i].created_at,
        };
      }
      console.log('data here after button click--->', data);
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
