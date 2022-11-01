import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { UtilService } from './../utils/util.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { Socket } from 'ngx-socket-io';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit, OnDestroy {
  @ViewChild('content') private content: any;
  chatRoomSubscription: Subscription;
  memberInfo = {};
  textMessageString = '';
  roomId;
  messagesList = [];
  userFallbackImage = this.util.fallbackUserImage;
  myInfo = {};
  updateMessageInfo = {};
  constructor(
    private util: UtilService,
    private userService: UserService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private _socket: Socket,
    private socketService: SocketService
  ) {
    this.chatRoomSubscription = this.util.chatRoomDetailLive.subscribe((r) => {
      if (!r._id) {
        this.fetchRoom()
      } else {
        this.roomId = r._id;
        this.getMyDetails(r.members);
      }

    });


    this._socket.on('add-message', (res) => {
      res.senderUser = this.userService.getFullyProcessedUserData(
        res.sender_id
      );
      if (this.myInfo['_id'] !== res.sender_id._id) {
        this.messagesList.push(res);
      }
    });

    this._socket.on('updateMessage', (res) => {
      // if (res && this.myInfo['_id'] !== this.messagesList[res.position].senderUser._id) {
        this.messagesList[res.position].content = res.updated_mesasge?.content;
        this.messagesList[res.position].is_edited = res.updated_mesasge?.is_edited;
        this.messagesList[res.position].updated_at = res.updated_mesasge?.updated_at;

      // }
    })

    this._socket.on('deleteMessage', (res) => {
      if (res && this.roomId == res.room_id) {
        this.messagesList = this.util.arrayItemRemover(res.position, this.messagesList)
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

  async fetchRoom() {
    this.roomId = this.route.snapshot.params['id']
    const r = await this.chatService.getRoomData({ room_id: this.roomId })
    if (r) {
      this.getMyDetails(r.members);
      this.socketService.loginUserSocket(r._id);
    }
  }

  bottomScroller(time: number) {
    this.content.scrollToBottom(time);
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
    this.bottomScroller(500)
  }

  async modifyMessage(data) {
    const fv = {
      room_id: data.roomId,
      message_id: data.messageId,
      content: data.content,
      position: data.position,
      created_at: data.createdAt,
    };
    const resData = await this.chatService.updateChatMessage(fv);

    if (resData) {
      this.textMessageString = '';
      // this.messagesList[fv.position].content = resData.updatedData?.content;
      // this.messagesList[fv.position].is_edited = resData.updatedData?.is_edited;
      // this.messagesList[fv.position].updated_at = resData.updatedData?.updated_at;
      this.updateMessageInfo = {}
    }
  }

  async removeMessage(data) {
    const fv = {
      room_id: data.roomId,
      message_id: data.messageId,
      position: data.position,
      created_at: data.createdAt,
    };

    const resData = await this.chatService.removeChatMessage(fv);
    if (resData) {
      // this.messagesList = this.util.arrayItemRemover(data.position, this.messagesList)
    }
  }

  async getMessageList(room_id) {
    const messageRes = await this.chatService.getMessagesList({ room_id });
    this.messagesList = messageRes?.['messages'];
    this.messagesList.forEach((el) => {
      el.senderUser = this.userService.getFullyProcessedUserData(el.sender_id);
    });
    this.bottomScroller(300)
  }

  async openActionSheet(i) {
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
      if (this.util.alert_options.chat_options[1].text == data) {
        this.textMessageString = this.messagesList[i].content;
        this.updateMessageInfo = {
          isEditClicked: true,
          position: i,
          messageId: this.messagesList[i]._id,
          content: this.textMessageString,
          createdAt: this.messagesList[i].created_at,
        };
      } else if (this.util.alert_options.chat_options[2].text == data) {
        this.removeMessage({
          roomId: this.roomId, position: i,
          messageId: this.messagesList[i]._id,
          createdAt: this.messagesList[i].created_at,
        })

      }
    }
  }

  async presentActionSheet() {
    const b = this.util.modifyActionSheetOptions(
      [],
      [this.util.alert_options.chat_global_options[0]]
    );
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();

    if (data) {
      // call delete all messages 
      console.log('onDidDismiss resolved with role and data', data);
    }

  }
}
