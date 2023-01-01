import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActionSheetController } from '@ionic/angular';

import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  base_url = environment.base_url;
  imageData = new BehaviorSubject<any>({});
  constructor(
    private http: HttpClient,
    private util: UtilService,
    private auth: AuthService,
    public actionSheetController: ActionSheetController
  ) {}

  uploadFile(_input, type) {
    return this.http.post(this.base_url + `/utils/file/${type}`, _input);
  }

  removeFile(_input) {
    return this.http.delete(this.base_url + `/utils/file`, { body: _input });
  }

  async processMedia(alreadyExisting, mediaData, media_type) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Select from gallery',
          icon: 'image-outline',
          handler: async () => {
            this.browseMobileAppFiles(
              'library',
              mediaData,
              alreadyExisting,
              media_type
            );
            console.log('Gallery clicked');
          },
        },
        {
          cssClass: 'edit-profile-option',
          text: 'Take a camera',
          icon: 'camera-outline',
          handler: async () => {
            this.browseMobileAppFiles(
              'camera',
              mediaData,
              alreadyExisting,
              media_type
            );
            console.log('Camera clicked');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async browseMobileAppFiles(type, mediaData, alreadyExisting, media_type) {
    try {
      let base64URL = await this.util.imagePicker(type);
      let data = await this.uploadBase64File(base64URL, media_type);
      this.imageData.next(data);
      if (data['url'] && alreadyExisting) {
        await this.removeDp({ public_id: mediaData.public_id });
      }
      this.util.toast('Uploaded successfully', 2000);
    } catch (err) {
      console.log('err is browseMobileAppFiles', err);
      this.util.toast('Something went wrong', 2000);
    }
  }

  async uploadBase64File(base64URL: string, media_type) {
    try {
      let base64ToFile = await this.util.dataURItoBlob(base64URL);
      let form_data = new FormData();
      form_data.append('file', base64ToFile, 'Test.jpeg');
      this.util.toast('Uploading please wait', 2000);
      let data = await this.uploadDP(form_data, media_type);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async uploadDP(input, media_type: string) {
    try {
      let data = await this.uploadFile(input, media_type).toPromise();
      const mediaKey = this.util.mediaKeyAccessor[media_type];
      const mediaObj = {
        [mediaKey]: data?.['_id'],
        ...this.util.default_language,
      };
      await this.auth.updateProfile(mediaObj).toPromise();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async removeDp(input) {
    try {
      await this.removeFile(input).toPromise();
    } catch (err) {
      throw err;
    }
  }
}
