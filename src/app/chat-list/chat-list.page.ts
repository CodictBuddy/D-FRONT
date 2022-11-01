import { UserService } from './../services/user.service';
import { ChatService } from './../services/chat.service';
import { UtilService } from './../utils/util.service';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {
  room_list = [];
  userFallbackImage = this.util.fallbackUserImage;
  skip = 0;
  limit = 10;
  constructor(
    private util: UtilService,
    private userService: UserService,
    private chatService: ChatService,
    private _socket: Socket,
  ) {
    this._socket.on('add-message', (res) => {
      console.log('what res m getting here', res)
      this.getRoomsList();
    })
  }

  ngOnInit() {
    this.getRoomsList();
  }

  async getRoomsList() {
    this.room_list = await this.chatService.getRoomList(this.skip, this.limit);
    this.processRawList(this.room_list);
  }

  processRawList(array) {
    array.forEach((el) => {
      let _memberInfo = this.userService.processData(
        el.members,
        this.util.default_language
      );
      el.members = this.userService.profilePatchingObject(_memberInfo);
    });
  }

  goToChatRoom(data) {
    this.util.chatRoomDetailLive.next(data)
    this.util.routeNavigation('/chat-room', data._id)
  }
}
