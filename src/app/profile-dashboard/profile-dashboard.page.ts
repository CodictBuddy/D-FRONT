import { ActivatedRoute } from '@angular/router';
import { MediaService } from './../profile-image/media.service';
import { UserService } from './../services/user.service';
import { UtilService } from './../utils/util.service';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MenuController, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.page.html',
  styleUrls: ['./profile-dashboard.page.scss'],
})
export class ProfileDashboardPage implements OnInit, OnDestroy {
  tab = '1';
  user = {};
  userMeta = {};
  userFallbackImage = this.util.fallbackUserImage;
  userImg = {};
  userCoverImg = {};
  imageType = '';
  myProfile: boolean;

  mediaSubscription: Subscription;
  userSubscription: Subscription;
  constructor(
    private menu: MenuController,
    private actionSheetController: ActionSheetController,
    private util: UtilService,
    private userService: UserService,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {
    this.mediaSubscription = this.mediaService.imageData.subscribe((r) => {
      if (this.imageType === 'cover') {
        this.userCoverImg = r;
      } else if (this.imageType === 'profile') {
        this.userImg = r;
      }
    });

    this.userSubscription = this.userService.userData.subscribe((r) => {
      if (this.myProfile) {
        this.getUserDetails(null);
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.myProfile = !id;
    this.getUserDetails(id);
  }

  async addImage(alreadyImage, addImage) {
    this.imageType = addImage;
    const imageObject = addImage === 'cover' ? this.userCoverImg : this.userImg;

    await this.mediaService.processMedia(alreadyImage, imageObject, addImage);
  }

  async getUserDetails(uid) {
    const userId = uid ? uid : this.userService.getMyDetails()?._id;
    const uData = await this.userService.getUserProfile(userId);
    if (!uid) {

      this.userMeta = uData?.userMeta;
    }
    this.user = this.userService.processData(
      uData.user,
      this.util.default_language
    );

    this.userImg = this.user?.['user_profile_image'];
    this.userCoverImg = this.user?.['user_background_image'];
  }

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

  logoutUser() {
    localStorage.clear();
    this.util.routeNavigation('/login');
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
