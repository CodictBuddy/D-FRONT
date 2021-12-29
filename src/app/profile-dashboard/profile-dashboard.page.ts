import { Component, OnInit } from '@angular/core';
import { MenuController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.page.html',
  styleUrls: ['./profile-dashboard.page.scss'],
})
export class ProfileDashboardPage implements OnInit {
  tab = '1';
  constructor(
    private menu: MenuController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {}

  segmentChanged(event) {
    console.log('event here', event.target.value);
    this.tab = event.target.value;
  }

  close() {
    // this.menu.enable(false, 'first');
    // this.menu.close('first')
  }
  openMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Who can view your talk?',
      cssClass: '',
      buttons: [
        {
          text: 'Remove connection',
          icon: 'person-remove',
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
