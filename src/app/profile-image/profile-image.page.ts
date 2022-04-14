import { MediaService } from './media.service';
import { UtilService } from '../utils/util.service';
import { ActionSheetController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.page.html',
  styleUrls: ['./profile-image.page.scss'],
})
export class ProfileImagePage implements OnInit, OnDestroy {
  userImg = {};
  mediaSubscription: Subscription;
  userData = JSON.parse(this.util.retrieveLocalStorage('user_data'));

  constructor(
    public actionSheetController: ActionSheetController,
    private util: UtilService,
    private mediaService: MediaService
  ) {
    this.mediaSubscription = this.mediaService.imageData.subscribe((r) => {
      this.userImg = r;
    });
  }

  ngOnInit() {
    this.processInformation();
  }

  processInformation() {
    this.userData = this.util.processData(this.userData);
  }

  async addImage(alreadyImage, addImage) {
    await this.mediaService.processMedia(alreadyImage, this.userImg, addImage);
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
  }
}
