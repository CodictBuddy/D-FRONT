import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { UtilService } from '../utils/util.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  
  constructor(
    public actionSheetController: ActionSheetController,
    private speechRecognition: SpeechRecognition,
    public alertController: AlertController,
    private post:PostService,
    private postFormBuilder: FormBuilder,
    private userService: UserService,
    private util: UtilService
  ) {}
  text = '';
  title = '';
  userFallbackImage = this.util.fallbackUserImage;
  my_information = {};
  myProfile: boolean;
  isTitle: Boolean = false;
  toggleMike: Boolean = false;
  connectionsOnly: Boolean = false;
  anyone: Boolean = true;
  postForm: FormGroup = new FormGroup({})
  ngOnInit() {
    this.handlePost()
    this.getMyDetails()
    // Check feature available
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) =>
        console.log('functionality available', available)
      );

    // Start the recognition process
    // this.speechRecognition.startListening(options)
    //   .subscribe(
    //     (matches: string[]) => console.log(matches),
    //     (onerror) => console.log('error:', onerror)
    //   )

    // Stop the recognition process (iOS only)
    // this.speechRecognition.stopListening()

    // Get the list of supported languages
    this.speechRecognition.getSupportedLanguages().then(
      (languages: string[]) => console.log('languages available', languages),
      (error) => console.log(error)
    );

    // Check permission
    this.speechRecognition
      .hasPermission()
      .then((hasPermission: boolean) =>
        console.log('check for permission', hasPermission)
      );

    // Request permissions
    this.speechRecognition.requestPermission().then(
      () => console.log('Granted'),
      () => console.log('Denied')
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Who can view your talk?',
      cssClass: '',
      buttons: [
        {
          text: 'Anyone',
          // role: 'destructive',
          icon: 'earth',
          // id: 'delete-button',
          // data: {
          //   type: 'delete'
          // },
          handler: () => {
            this.connectionsOnly = false;
            this.anyone = true;
            console.log('Delete clicked');
          },
        },
        {
          text: 'Connections only',
          icon: 'people',
          // data: 10,
          handler: () => {
            this.connectionsOnly = true;
            this.anyone = false;
            console.log('Share clicked');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Let me know what you wanna add first?',
      // message: msg,
      buttons: [
        {
          text: 'Heading',
          cssClass:'{color:green}',
          // role: 'destructive',
          // icon: 'earth',
          id: 'heading-button',
          // data: {
          //   type: 'delete'
          // },
          handler: () => {
            this.isTitle = true;
            this.startListening();
            console.log('heading clicked');
          },
        },
        {
          text: 'Content',
          // role: 'destructive',
          // icon: 'earth',
          // id: 'delete-button',
          // data: {
          //   type: 'delete'
          // },
          handler: () => {
            this.isTitle = false;
            this.startListening();
            console.log('content clicked');
          },
        },
      ],
    });
    alert.present();
  }

  startListening() {
    this.toggleMike = true;
    if (this.isTitle) {
      console.log('title called ', this.isTitle);
    } else {
      console.log('text called ', this.isTitle);
    }

    this.speechRecognition.startListening().subscribe(
      (r) => {
        if (this.isTitle && r.length > 0) {
          this.title += r[0];
        } else if (!this.isTitle && r.length > 0) {
          this.text += r[0];
        }
        console.log('r actual data coming here', r);

        this.stopListening();
      },
      (err) => {
        console.log('error while speaking', err);
      }
    );
  }

  stopListening() {
    this.toggleMike = false;
    this.speechRecognition.stopListening();
  }

  handlePost(){
    this.postForm=this.postFormBuilder.group({
      'title': new FormControl(null,Validators.required),
      'content': new FormControl(null,Validators.required)
    })
    console.log(this.postForm);
  }
  
  getMyDetails() {
    let myInfo = this.userService.getMyDetails();
    console.log("Before",myInfo);
    this.my_information = this.userService.getFullyProcessedUserData(myInfo);
    console.log("After",myInfo);
    console.log(this.my_information);
    
  }
  
}
