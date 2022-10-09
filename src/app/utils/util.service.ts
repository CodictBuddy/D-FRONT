import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  ToastController,
  AlertController,
  ActionSheetController,
} from '@ionic/angular';
// import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
} from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public actionSheetOutput = new BehaviorSubject<any>({});
  public chatRoomDetailLive = new BehaviorSubject<any>({});

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private router: Router
  ) { }
  public default_language = { lng: 'en' };
  public mediaKeyAccessor = {
    profile: 'user_profile_image',
    cover: 'user_background_image',
  };

  public connection_btns = {
    0: 'Connect',
    1: 'Pending',
    2: 'Withdrawn',
    3: 'Follow',
    4: 'Message',
    5: 'Followed',
    6: 'Accept',
    7: 'Remove',
  };

  public notification_template_constants = {
    connection_req_sent: 'have sent you a connection request.',
    connection_req_accepted: "Hi!, I'm adding you in my  connections.",
  };

  public alert_options = {
    notification_options: [
      {
        text: 'Delete this notification',
        icon: 'trash',
      },
    ],
    profile_connection_options: [
      {
        text: 'Share Profile',
        data: 'Share Profile',
        icon: 'share-social-outline',
      },
      {
        text: 'Connect',
        data: 'Connect',
        icon: 'person-add',
      },
      {
        text: 'Remove',
        data: 'Remove',
        icon: 'person-remove',
      },
      {
        text: 'Follow',
        data: 'Follow',
        icon: 'add-outline',
      },
      {
        text: 'Unfollow',
        data: 'Unfollow',
        icon: 'person-remove-outline',
      },
      {
        text: 'Message',
        data: 'Message',
        icon: 'lock-closed',
      },
      {
        text: 'Report or block',
        data: 'Report or block',
        icon: 'flag',
      },
      {
        text: 'Share profile via message',
        data: 'Share profile via message',
        icon: 'send',
      },
    ],
    chat_options: [
      {
        text: 'Copy Message',
        data: 'Copy Message',
        icon: 'copy-outline',
      },
      {
        text: 'Edit Message',
        data: 'Edit Message',
        icon: 'create-outline',
      },
      {
        text: 'Remove Message',
        data: 'Remove Message',
        icon: 'trash-outline',
      },

    ],
    chat_global_options: [
      {
        text: 'Delete this conversation?',
        data: 'Delete this conversation?',
        icon: 'trash-outline',
      },
    ]
  };

  public alert_constants = {
    withdraw_invitation: {
      heading: 'Withdraw invitation',
      subHeading: `If you withdraw now, you won't be able to resend to this person for up to a month.`,
      buttons: ['Cancel', 'Withdraw'],
    },
  };

  public fallbackUserImage = 'assets/Image/Empty State Icon/People.svg';
  async toast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
    });
    toast.present();
  }

  async dynamicActionSheet(metaData) {
    if (!metaData?.buttons?.length) return;
    const btnFrame = [];

    for (let i = 0; i < metaData.buttons.length; i++) {
      const keys: any[] = Object.keys(metaData.buttons[i]);
      const btnKeys = {};
      if (keys.length) {
        for (const key of keys) {
          btnKeys[key] = metaData.buttons[i][key];
        }
      }
      btnFrame.push(btnKeys);
    }

    const mainActionSheetObject = {
      buttons: btnFrame,
    };
    if (metaData.heading) {
      mainActionSheetObject['heading'] = metaData.heading;
    }
    const actionSheet = await this.actionSheetController.create(
      mainActionSheetObject
    );

    actionSheet.present();
    return actionSheet;
  }

  modifyActionSheetOptions(optionsToRemove: string[], fromList = this.alert_options.profile_connection_options) {
    const optionsArray = [...fromList];
    for (let i = 0; i < optionsArray.length; i++) {
      for (let j = 0; j < optionsToRemove.length; j++) {
        if (!optionsArray[i]) continue;
        if (optionsArray[i].text === optionsToRemove[j]) {
          optionsArray[i] = null;
        }
      }
    }

    return optionsArray.filter((el) => !!el);
  }

  async showAlert(metaData) {
    if (!metaData?.buttons.length || !metaData.heading) return;
    const btnFrame = [];
    for (let i = 0; i < metaData?.buttons.length; i++) {
      btnFrame.push({
        text: metaData?.buttons[i],
        handler: () => {
          this.actionSheetOutput.next({
            button: metaData?.buttons[i],
            information: metaData.information ?? null,
          });
        },
      });
    }

    const alert: any = await this.alertController.create({
      header: metaData.heading ?? '',
      message: metaData.subHeading ?? '',
      buttons: btnFrame,
    });
    alert.present();
  }

  partialHideEmail(email) {
    return email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2');
  }

  processData(data, lng = this.default_language.lng) {
    const dataMap = {};
    const dataKeys = Object.keys(data);

    for (let i = 0; i < dataKeys.length; i++) {
      if (data[dataKeys[i]] instanceof Array) {
        const record = data[dataKeys[i]].find((el) => el.language === lng);
        if (record) {
          dataMap[dataKeys[i]] = record;
        }
      } else {
        dataMap[dataKeys[i]] = data[dataKeys[i]];
      }
    }
    return dataMap;
  }

  setLocalStorage(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    localStorage.setItem(`${key}`, value);
  }

  arrayItemRemover(i, array) {
    return array.filter((el, _index) => i !== _index);
  }

  retrieveLocalStorage(key) {
    return localStorage.getItem(key);
  }

  async imagePicker(st) {
    const paramsObj: ImageOptions = {
      quality: 90,
      allowEditing: false,
      presentationStyle: 'fullscreen',
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    };
    let image;
    if (st == 'camera') {
      (paramsObj['source'] = CameraSource.Camera),
        (image = await Camera.getPhoto(paramsObj).catch((e) => {
          console.log('error in picking camera img-->', e);
        }));
    } else {
      paramsObj['source'] = CameraSource.Photos;
      image = await Camera.getPhoto(paramsObj).catch((e) => {
        console.log('error in picking gallery img-->', e);
      });
    }

    return image.dataUrl;
  }

  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  routeNavigation(navigateTo, params?, queryObject?) {
    const routeArray = [navigateTo];
    if (params) {
      routeArray.push(params);
    }
    this.router.navigate(routeArray, { queryParams: queryObject });
  }

  compareDateIso(date1: string, date2: string) {
    return this.splitNposition(date1, 'T', 0) === this.splitNposition(date2, 'T', 0)
  }

  splitNposition(data: string, splitValue: string, position: number) {
    return data.split(splitValue)[position]
  }
}
