import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PostPage implements OnInit, OnDestroy {

  text = '';
  title = '';
  userFallbackImage = this.util.fallbackUserImage;
  my_information = {};
  myProfile: boolean;
  isTitle: Boolean = false;
  toggleMike: Boolean = false;
  connectionsOnly: Boolean = false;
  anyone: Boolean = true;
  postForm!: FormGroup
  postButton: any = this.util.alert_options.post_options
  postAlertButton: any = this.util.alert_constants.post_creation
  postButtonLabel: any = this.util.post_button
  selectedButtton: any = this.postButtonLabel?.['0']
  alertOutputSubs: Subscription

  constructor(
    public actionSheetController: ActionSheetController,
    private speechRecognition: SpeechRecognition,
    public alertController: AlertController,
    private post: PostService,
    private postFormBuilder: FormBuilder,
    private userService: UserService,
    private util: UtilService
  ) {

    this.alertOutputSubs = this.util.actionSheetOutput.subscribe((r) => {

      if (r && r.button == this.postAlertButton.buttons[0]) {
        this.isTitle = true;
        this.startListening();
      } else if (r && r.button == this.postAlertButton.buttons[1]) {
        this.isTitle = false;
        this.startListening();
      }
    })
  }


  ngOnInit() {
    this.handlePost()
    this.getMyDetails()
    this.setSpeechPermissions()

  }

  onClosePage(){
    this.util.actionSheetOutput.observers.splice(0)
    this.util.actionSheetOutput.next({})
    this.alertOutputSubs.unsubscribe()
    this.util.routeNavigation('/home')
    this.handlePost()
  }

  setSpeechPermissions() {
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) =>
        console.log('functionality available', available)
      );

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


  async showAlert() {
    await this.util.showAlert(this.postAlertButton)
  }

  startListening() {
    this.toggleMike = true;

    this.speechRecognition.startListening().subscribe(
      (r) => {
        if (this.isTitle && r.length > 0) {
          this.title += r[0];
          this.postForm.patchValue({ title: this.title })
        } else if (!this.isTitle && r.length > 0) {
          this.text += r[0];
          this.postForm.patchValue({ content: this.text })
        }
        console.log('r actual data coming here', r);
        this.stopListening()
      },
      (err) => {
        console.log('error while speaking', err);
        this.stopListening()
      }
    );
  }

  stopListening() {
    this.toggleMike = false;
    this.speechRecognition.stopListening();
  }

  handlePost() {
    this.postForm = this.postFormBuilder.group({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    })

    this.title = this.text = ''
  }
  async openActionSheet() {
    const b = this.postButton;
    console.log('b', b);

    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {
      if (data == this.postButtonLabel?.['0']) {
        this.selectedButtton = data
        this.connectionsOnly = false;
        this.anyone = true;
      }
      else if (data == this.postButtonLabel?.['1']) {
        this.selectedButtton = data
        this.connectionsOnly = true;
        this.anyone = false;
      }
      console.log("data", data);

    }
  }
  async createPost(isValid, formData) {
    if (!isValid) return
    const payload = {
      type: this.selectedButtton,
      title: formData.title,
      content: formData.content,
      notification_title: `${this.my_information?.['first_name']} ${this.my_information?.['last_name']} has added a new post`,
      notification_message: this.util.textTrimmer(formData.content),
      navigation_url: "/post/"
    }
    const data = await this.post.createPost(payload).catch(err => this.util.toast('Post Creation Failed.', 3000))
    console.log("Data", data);

    if (data) {
      this.handlePost();
      this.util.toast('Post Created Succesfully', 3000)
    }


    console.log("payload", payload);
  }

  getMyDetails() {
    let myInfo = this.userService.getMyDetails();
    this.my_information = this.userService.getFullyProcessedUserData(myInfo);
  }

  ngOnDestroy(): void {
    this.alertOutputSubs.unsubscribe()
  }
}
