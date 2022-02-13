import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
  constructor(
    public toastController: ToastController,
    private router: Router
  ) {}
  public default_language = { lng: 'en' };
  async toast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
    });
    toast.present();
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
}
