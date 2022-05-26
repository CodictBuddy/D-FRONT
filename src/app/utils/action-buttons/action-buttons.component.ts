import { ConnectionService } from './../../services/connection.service';
import { UtilService } from '../util.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {
  constructor(
    private util: UtilService,
    private connectionService: ConnectionService
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

  ngOnInit() {
    this.checkConnection();
  }

  async checkConnection() {
    this.connectionStatusObject = await this.connectionDetails(
      this.user_id,
      this.utilButtons[0]
    );

    this.setButtonLabels(this.connectionStatusObject);
  }

  setButtonLabels(connectionStatusObject) {
    if (!connectionStatusObject) {
      this.btn1 = this.utilButtons[3];
      this.btn2 = this.utilButtons[4];
      this.showBtns = !connectionStatusObject;
      this.multipleButtons = !connectionStatusObject;

      this.customizedActionButtonSheet = this.util.modifyActionSheetOptions([
        'Remove',
        'Unfollow',
      ]);
    } else {
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
    } else if (type === 'Remove') {
      this.removeConnection(user_id, this.util.connection_btns[0]);
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
        this.checkConnection();
      });
  }
}
