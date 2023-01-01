import { PostService } from './../../services/post.service';
import { SocketService } from './../../services/socket.service';
import { UtilService } from './../../utils/util.service';
// import { Socket } from "ngx-socket-io";
// import { UtilService } from "./../../service/util.service";
// import { LocalNotifications } from "@ionic-native/local-notifications/ngx";

import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  posterObj: any;
  people_list: any;
  invitations_list = [];
  recommendedUser_list = [];
  userPreference = true;
  loader: Boolean = false
  connectionId;
  limit = 5;
  recommendedListLoader: Boolean = false;
  private userDetail;
  id: any;
  talkList: any
  activity_list: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 4];
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 2.3,
  };

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    private util: UtilService,
    public modalController: ModalController,
    private post: PostService
  ) { }

  checkGPSPermission() {
    // if (!localStorage.getItem("name")) {
    //   this.router.navigate(["/current-location"]);
    // }
  }

  async openOverlay() {
    // const modal = await this.modalController.create({
    //   component: OverlayPage,
    //   cssClass: "overlay-dialog",
    // });
    // return await modal.present();
  }

  ngOnInit() {
    this.checkGPSPermission();
    // this.socket.connect();
    if (!localStorage.getItem('overlay')) {
      this.openOverlay();
    }
  }

  ionViewWillEnter() {
    this.limit = 5;
    this.userPreference = true;
    this.getPeople();
    this.getPublicPostDetail();
    this.getRecommendations();
    // this.postCardComponent.reloadData();
    this.userDetail = JSON.parse(localStorage.getItem('user_detail'));
  }

  peopleprofile(user) {
    this.router.navigate(['/profile'], {
      queryParams: {
        otherUserProfile: true,
        userId: user._id,
        connId: this.connectionId,
      },
    });
  }
  public getPeople() {
    // this.service.getPeople().subscribe((response) => {
    //   this.people_list = response;
    // });
  }

  data() { }

  connect(i, targetId) {
    this.recommendedUser_list[i].people_connect = true;

    let fv = {
      type: 'Relationship',
      user_id: this.userDetail._id,
      target_user_id: targetId,
    };

    // this.userService.sendConnectionRequest(fv).subscribe(
    //   (res) => {
    //     this.connectionId = res._id;
    //     this.recommendedUser_list[i].request_sent = true;

    //     this.connectionIdPicker(res._id);
    //   },
    //   (err) => {
    //     return this.utilService.presentToast("Oops!! something went wrong!");
    //   }
    // );
  }

  async showAlertMsg(i) {
    const alert = await this.alertCtrl.create({
      header: 'Alert!!',
      message: 'Do you want to cancel the request??',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          handler: () => {
            this.updateRequestStatus(i);
          },
        },
      ],
    });
    await alert.present();
  }

  connectionIdPicker(id) {
    return (this.connectionId = id);
  }

  updateRequestStatus(i) {
    let fv = {
      id: this.connectionId,
      connection_status: 'Reject',
    };

    // this.userService.updateConnRequestStatus(fv).subscribe(
    //   (res) => {
    //     this.recommendedUser_list[i].people_connect = false;
    //     this.recommendedUser_list[i].request_sent = false;
    //   },
    //   (err) => {
    //     return this.utilService.presentToast("Oops!! something went wrong!");
    //   }
    // );
  }

  doRefresh(event) {
    this.limit = 5;
    this.userPreference = true;
    this.getPeople();

    this.getRecommendations();
    // this.postCardComponent.reloadData();
    this.userDetail = JSON.parse(localStorage.getItem('user_detail'));
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  getRecommendations() {
    this.recommendedListLoader = true;
    // this.userService.getRecommendedUsers({ skip: 0, limit: 10 }).subscribe(
    //   (res) => {
    //     this.recommendedListLoader = false;
    //     this.recommendedUser_list = res;
    //     this.recommendedUser_list.map((el) => {
    //       (el["name"] =
    //         (el.first_name && el.first_name.length > 0) ||
    //         (el.last_name && el.last_name.length > 0)
    //           ? `${el.first_name[0].description}`
    //           : ""),
    //         (el["userImage"] =
    //           el.user_media && el.user_media.length > 0
    //             ? `${el.user_media[0].media_id.media_url}`
    //             : "");

    //       el["people_connect"] = false;
    //       el["request_sent"] = false;
    //     });
    //   },
    //   (err) => {
    //     if (err) {
    //       this.recommendedListLoader = false;
    //       return this.utilService.presentToast("Oops!! something went wrong!");
    //     }
    //   }
    // );

  }

  async getPublicPostDetail(value = {
    "skip": 0,
    "limit": 10
  }) {
    this.loader = true
    this.talkList =
      await this.post.publicAndConnectionPost(value).finally(() => this.loader = false)
  }
}
