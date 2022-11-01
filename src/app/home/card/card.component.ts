import { UserService } from './../../services/user.service';
import { PostService } from './../../services/post.service';
import { Component, Input, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import Speech from 'speak-tts';

@Component({
  selector: 'post-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('detail') detail: Boolean = true;
  isLiked: Boolean = false;
  playSound: Boolean = false;
  isSelfPost: Boolean = false
  postDetail: any;
  speech: any;
  speechData: any;
  constructor(private tts: TextToSpeech,
    private post: PostService,
    private user: UserService) { }

  ngOnInit() {
    console.log('value here', this.detail);
    this.getPostDetail('635e887154e233001682010a');
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  sound() {
    this.playSound = !this.playSound;

    if (!this.playSound) {
      // this.speech.pause();
      this.tts.stop();
    }
    if (this.playSound) {
      this.tts
        .speak({
          text: 'your text reading software is working now',
          locale: 'en-GB',
          rate: 0.75,
        })
        .then(() => {
          console.log('Success !');
        })
        .catch((e) => {
          console.error('An error occurred :', e);
        });
    }
  }

  setLanguage(i) {
    console.log(i);
    console.log(
      this.speechData.voices[i].lang + this.speechData.voices[i].name
    );
    this.speech.setLanguage(this.speechData.voices[i].lang);
    this.speech.setVoice(this.speechData.voices[i].name);
  }
  async getPostDetail(value) {
    const data = await this.post.getPostDetail(value)
    console.log("res", data)
    if (data) {
      this.isSelfPost = data.isSelfPost
      this.postDetail = data.post
      this.postDetail['created_by'] = this.user.getFullyProcessedUserData(this.postDetail?.['created_by'])
    }
    console.log("postDetail", this.postDetail);
  }
}
