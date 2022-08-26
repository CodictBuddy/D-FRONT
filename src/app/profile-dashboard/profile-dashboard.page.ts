import { ChatService } from './../services/chat.service';
import { ConnectionService } from './../services/connection.service';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from './../profile-image/media.service';
import { UserService } from './../services/user.service';
import { UtilService } from './../utils/util.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MenuController, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.page.html',
  styleUrls: ['./profile-dashboard.page.scss'],
})
export class ProfileDashboardPage implements OnInit, OnDestroy {

  tab = '';
  user = {};
  userMeta = {};
  userFallbackImage = this.util.fallbackUserImage;
  userImg = {};
  userCoverImg = {};
  imageType = '';
  sender_name = '';
  my_information = {};
  myProfile: boolean;
  connected_user_list=[];
  showOtherDetails : boolean
  user_connection_option= this.util.alert_options.profile_connection_options;

  mediaSubscription: Subscription;
  userSubscription: Subscription;
  constructor(
    private menu: MenuController,
    private actionSheetController: ActionSheetController,
    private util: UtilService,
    private userService: UserService,
    private mediaService: MediaService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private connectionService: ConnectionService,

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
  ngOnDestroy(): void {
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.myProfile = !id;
    this.getUserDetails(id);
    this.getMyDetails();
    this.netConnection();

  }

  async addImage(alreadyImage, addImage) {
    this.imageType = addImage;
    const imageObject = addImage === 'cover' ? this.userCoverImg : this.userImg;

    await this.mediaService.processMedia(alreadyImage, imageObject, addImage);
  }

  getMyDetails() {
    let myInfo = this.userService.getMyDetails();
    myInfo = this.userService.processData(myInfo, this.util.default_language);
    this.my_information = this.userService.profilePatchingObject(myInfo);
    this.sender_name = `${this.my_information['first_name']} ${this.my_information['last_name']}`;
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
    if(this.tab==='2'){
    this.netConnection()
    }
    }

  close() {
    // this.menu.enable(false, 'first');
    // this.menu.close('first')
  }
  openMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  async presentActionSheet(user_id,connection_type,ind) {
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
  async netConnection() {
    const currentView = 2;
    const d = await this.connectionService.getConnectionList(
      currentView,
      'Connect',
      'Accept'
    );
    console.log(d);
    // for(const userData of d.connections) {
    //   const user = this.userService.getFullyProcessedUserData(
    //     userData.connected_user
    //   );
    //   userData.connected_user = user;
    //   console.log(user);
    //   }

    d.connections.forEach(element => {
      element.connected_user= this.userService.getFullyProcessedUserData(element.connected_user)
      console.log(element.connected_user);   
    });
    this.connected_user_list=d.connections
    console.log('new',d);
    console.log(this.connected_user_list);
  }
 
  goToUserProfile(user_id) {
    this.util.routeNavigation(`dashboard/${user_id}`);
  }

  hideConnection(data){
    console.log('Output action',data);
  
  if(data.connection_status===this.util.connection_btns[6] && data.type===this.util.connection_btns[0]){
    console.log('hello');
    
    this.showOtherDetails=true;
  }
  else if(data.connected_status!==this.util.connection_btns[6] && data.type===this.util.connection_btns[0]){
    console.log('Hello2');
    
    this.showOtherDetails=false;
  }
  }
  


  logoutUser() {
    localStorage.clear();
    this.util.routeNavigation('/login');
  }


  async removeConnection(user_id, connection_type) {
    await this.connectionService.removeConnection(
      user_id,
      connection_type
    );
  }
  async ActionSheet(user_id, connection_type,i) {
    console.log("user",user_id)
    const b = [
      {
        ...this.user_connection_option[2],
        data: { user_id,connection_type },
      },
    ];
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {
      await this.removeConnection(
        user_id,
        connection_type
      ).then(() => {
        this.connected_user_list = this.util.arrayItemRemover(
          i,
          this.connected_user_list
        );
      });
    }
  }
}

