import { ChatService } from './../services/chat.service';
import { UserService } from './../services/user.service';
import { Subscription } from 'rxjs';
import { UtilService } from './../utils/util.service';
import { ConnectionService } from './../services/connection.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss'],
})
export class InvitationsComponent implements OnInit, OnDestroy {
  @Input('reusable') reusable: Boolean = false;
  tab = 2;
  connection_btns = this.util.connection_btns;
  userFallbackImage = '';
  sender_name = '';

  alertOutputSubs: Subscription;
  recieved_network_list = [];
  sent_network_list = [];
  constructor(
    private connectionService: ConnectionService,
    private chatService: ChatService,
    private userService: UserService,
    private util: UtilService
  ) {
    this.userFallbackImage = this.util.fallbackUserImage;
    this.alertOutputSubs = this.util.actionSheetOutput.subscribe((r) => {
      if (this.connection_btns[2].includes(r.button)) {
        this.removeConnection(
          r.information._id,
          this.connection_btns[0],
          r.information.position,
          r.information.array,
          r.information.arrayType
        );
      }
    });
  }

  async ngOnInit() {
    this.recieved_network_list = await this.fetchInvitations();
    this.getMyDetails();
  }

  getMyDetails() {
    let myInfo = this.userService.getMyDetails();
    myInfo = this.userService.processData(myInfo, this.util.default_language);
    myInfo = this.userService.profilePatchingObject(myInfo);
    this.sender_name = `${myInfo.first_name} ${myInfo.last_name}`;
    console.log('my information here', myInfo);
  }
  async segmentChanged(event) {
    this.tab = event.target.value;
    if (this.tab == 2) {
      this.recieved_network_list = await this.fetchInvitations();
    } else if (this.tab == 1) {
      this.sent_network_list = await this.fetchInvitations();
    }
  }

  async fetchInvitations() {
    const processList = [];
    const currentView = this.tab - 1;
    const d = await this.connectionService.getConnectionList(
      currentView,
      'Connect',
      'Pending'
    );

    for (const userData of d.connections) {
      const user = this.userService.processData(
        currentView ? userData.user_id : userData.target_user_id,
        this.util.default_language
      );
      userData.user = user;
      processList.push(userData);
    }
    return processList;
  }
  showRemoveConnectionPopup(user_id, position, array, arrayType) {
    this.util.showAlert({
      ...this.util.alert_constants.withdraw_invitation,
      information: { _id: user_id, position, array, arrayType },
    });
  }

  goToProfile(user_id) {
    this.util.routeNavigation(`dashboard/${user_id}`);
  }

  async removeConnection(user_id, connection_type, position, array, arrayType) {
    await this.connectionService.removeConnection(user_id, connection_type);
    if (arrayType == 'Sent') {
      this.sent_network_list = this.util.arrayItemRemover(position, array);
    } else if ((arrayType = 'Recieved')) {
      this.recieved_network_list = this.util.arrayItemRemover(position, array);
    }
  }

  async modifyConnection(connectionObject, position, array) {
    if (!connectionObject) return;

    const payload = {
      connection_status: this.connection_btns[6],
      connection_type: this.connection_btns[0],
      conn_id: connectionObject._id,
      user_id: connectionObject.user_id,
      message:
        this.util.notification_template_constants.connection_req_accepted,
      invitation_title: this.sender_name,
    };
    const updatedD = await this.connectionService.modifyConnection(payload);
    if (updatedD) {
      this.recieved_network_list = this.util.arrayItemRemover(position, array);
      await this.chatService.createChatRoom({ user_id: payload.user_id });
    }
  }

  ngOnDestroy() {
    this.alertOutputSubs.unsubscribe();
  }
}
