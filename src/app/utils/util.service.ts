import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(public toastController: ToastController,) { }

  async toast(message, duration) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position:"bottom"
    });
    toast.present();
  }
}
