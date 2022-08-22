import { ChatService } from './../../services/chat.service';
import { ConnectionService } from './../../services/connection.service';
import { UtilService } from '../util.service';
import { Component, Input, OnInit, Type } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {
  constructor(
    private util: UtilService,
    private connectionService: ConnectionService,
    private chatService: ChatService
  ) {}
  @Input('user_id') user_id;
  @Input('sender_name') sender_name;
  @Input('sender_info') sender_info;

  showBtns = false;
  multipleButtons = true;
  connectionStatusObject = {};
  btn1 = '';
  btn2 = '';
  utilButtons = this.util.connection_btns;
  customizedActionButtonSheet = [];
  changeBtnView = false;
  chatRoomInfo = {};
  hideIcon=false;

  ngOnInit() {
    this.checkConnection();
    console.log(this.sender_info);
    
  }

  async checkConnection() {
    this.connectionStatusObject = await this.connectionDetails(
      this.user_id,
      this.utilButtons[0]
    );
    console.log(this.connectionStatusObject);
    

    await this.setButtonLabels(this.connectionStatusObject);
  }

  async setButtonLabels(connectionStatusObject) {
    if (!connectionStatusObject) {
      this.btn1 = this.utilButtons[3];
      this.btn2 = this.utilButtons[4];
      this.showBtns = !connectionStatusObject;
      this.multipleButtons = !connectionStatusObject;
      this.changeBtnView= !this.btn1 

      this.customizedActionButtonSheet = this.util.modifyActionSheetOptions([
        'Remove',
        'Unfollow',
      ]);
    } else {
      if(connectionStatusObject.connection_status === this.utilButtons[6]&&
        connectionStatusObject.target_user_id === this.sender_info['_id'] ){
         this.btn1= this.utilButtons[4];
         this.multipleButtons = !this.btn1
         this.showBtns = !!this.btn1;
         if (this.btn1 === this.utilButtons[4]) {
          this.customizedActionButtonSheet = this.util.modifyActionSheetOptions(
            ['Message', 'Follow', 'Connect']
          );

          this.chatRoomInfo = await this.chatService.getRoomData({
            user_id: this.user_id,
          });
        }
      }
      else if(connectionStatusObject.connection_status === this.utilButtons[1]){
          this.btn1 = this.utilButtons[6];
          this.btn2 = this.utilButtons[8];
          this.showBtns = !!this.btn1;
          this.multipleButtons = !!this.btn2;
          this.hideIcon=!!this.btn2;
      }
      if (
        connectionStatusObject.type === this.utilButtons[0] &&
        connectionStatusObject.target_user_id === this.user_id 
      ) {
        this.btn1 =
          connectionStatusObject.connection_status === this.utilButtons[1]
            ? this.utilButtons[1]
            : this.utilButtons[4];
        this.multipleButtons = !this.btn1;
        this.showBtns = !!this.btn1;
        this.changeBtnView = this.btn1 === this.utilButtons[4];

        if (this.btn1 === this.utilButtons[1]) {
          this.customizedActionButtonSheet = this.util.modifyActionSheetOptions(
            ['Remove', 'Unfollow', 'Connect']
          );
        } else if (this.btn1 === this.utilButtons[4]) {
          this.customizedActionButtonSheet = this.util.modifyActionSheetOptions(
            ['Message', 'Follow', 'Connect']
          );

          this.chatRoomInfo = await this.chatService.getRoomData({
            user_id: this.user_id,
          });
        }
      } else if (
        connectionStatusObject.type === this.utilButtons[5] &&
        connectionStatusObject.target_user_id === this.user_id
      ) {
        this.btn1 = this.utilButtons[5];
        this.btn2 = this.utilButtons[4];
        this.multipleButtons = !!this.btn1;
        this.showBtns = !!this.btn1;

        this.customizedActionButtonSheet = this.util.modifyActionSheetOptions([
          'Remove',
          'Unfollow',
          'Follow',
          'Message',
        ]);
      }
    }
  }

  async openActionSheet() {
    const b = this.customizedActionButtonSheet;
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {
      this.handleConnection(data, this.user_id);
    }
  }

  async connectionDetails(user_id, connection_type) {
    console.log('entered here', user_id);
    let connectionResponse = {};
    connectionResponse = await this.connectionService.getConnectionDetail({
      user_id,
      connection_type,
    });

    if (!connectionResponse && connection_type === this.utilButtons[5]) {
      return null;
    }

    if (!connectionResponse && connection_type === this.utilButtons[0]) {
      connectionResponse = await this.connectionDetails(
        user_id,
        this.utilButtons[5]
      );
    }
    return connectionResponse;
  }

  handleConnection(type, user_id) {
    if (type === this.util.connection_btns[0]) {
      this.createConnection(
        user_id,
        type,
        `${this.sender_name} ${this.util.notification_template_constants.connection_req_sent}`,
        this.sender_name,
        `/dashboard/${this.sender_info['_id']}`
      );
    } else if (type === this.util.connection_btns[4]) {
      this.util.chatRoomDetailLive.next(this.chatRoomInfo);  
      this.util.routeNavigation('/chat-room', this.chatRoomInfo?.['_id']);
    } else if (type === this.util.connection_btns[7]) {
      console.log(type);
      this.removeConnection(user_id, this.util.connection_btns[0]);
    } else if(type === this.util.connection_btns[8]){
      this.removeConnection(user_id, this.util.connection_btns[0]);
    } 
    else if(type === this.util.connection_btns[6]){
      this.modifyConnection({_id:this.connectionStatusObject?.['_id'],user_id:this.connectionStatusObject?.['user_id']}
      )
    }
  }

  /**
   * handling connection api calls
   *
   */
  async createConnection(
    user_id,
    type,
    message,
    invitation_title,
    navigation_url
  ) {
    const res = await this.connectionService.createConnection({
      user_id,
      type,
      message,
      invitation_title,
      navigation_url,
    });
    this.checkConnection();
    return res;
  }

  removeConnection(user_id, connection_type) {
    this.connectionService
      .removeConnection(user_id, connection_type)
      .then(() => {
        this.hideIcon=false;
        this.checkConnection();
      });
  }
  
  async modifyConnection(connectionObject) {
    console.log(connectionObject);
    
    if (!connectionObject) return;

    const payload = {
      connection_status: this.util.connection_btns[6],
      connection_type: this.util.connection_btns[0],
      conn_id: connectionObject._id,
      user_id: connectionObject.user_id,
      message:
        this.util.notification_template_constants.connection_req_accepted,
      invitation_title: this.sender_info,
    };
    const updatedD = await this.connectionService.modifyConnection(payload);
    if (updatedD) {
      await this.chatService.createChatRoom({ user_id: payload.user_id });
         this.btn1= this.utilButtons[4];
         this.multipleButtons = !this.btn1
         this.showBtns = !!this.btn1;
         if (this.btn1 === this.utilButtons[4]) {
          this.customizedActionButtonSheet = this.util.modifyActionSheetOptions(
            ['Message', 'Follow', 'Connect']);
    }
  }
}
}
