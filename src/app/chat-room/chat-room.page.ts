import { UserService } from './../services/user.service';
import { UtilService } from './../utils/util.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit, OnDestroy {
  chatRoomSubscription: Subscription;
  memberInfo = {};
  userFallbackImage = this.util.fallbackUserImage;
  constructor(
    private actionSheetController: ActionSheetController,
    private util: UtilService,
    private userService: UserService
  ) {
    this.chatRoomSubscription = this.util.chatRoomDetailLive.subscribe((r) => {
      this.getMyDetails(r.members);
    });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.chatRoomSubscription.unsubscribe();
  }

  getMyDetails(data) {
    let _memberInfo = this.userService.processData(
      data,
      this.util.default_language
    );
    this.memberInfo = this.userService.profilePatchingObject(_memberInfo);
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
