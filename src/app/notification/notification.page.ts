import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  constructor(private actionSheetController: ActionSheetController) {}

  ngOnInit() {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Who can view your talk?',
      cssClass: '',
      buttons: [
        {
          text: 'Delete this notification',
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
