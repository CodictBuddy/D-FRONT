import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { PostService } from './../../services/post.service';
import { Component, Input, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import Speech from 'speak-tts';
import { UtilService } from 'src/app/utils/util.service';

@Component({
  selector: 'post-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('detail') detail: Boolean = true;
  @Input('post_data') post_data: any = null;
  isLiked: Boolean = false;
  playSound: Boolean = false;
  isSelfPost: Boolean = false
  postDetail: any;
  speech: any;
  speechData: any;
  userFallbackImage = this.util.fallbackUserImage;
  constructor(private tts: TextToSpeech,
    private post: PostService,
    private user: UserService,
    private util: UtilService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id']

    this.getPostDetail(id,this.post_data);

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

  async getPostDetail(value, post_details?){
    const data = post_details ? post_details : value?await this.post.getPostDetail(value) :null
    console.log("res", data)
    if (data) {
      this.isSelfPost = data?.isSelfPost ?? false
      this.postDetail = data.post?? data
      this.postDetail['created_by'] = this.user.getFullyProcessedUserData(this.postDetail?.['created_by'])
    }
    console.log("postDetail", this.postDetail);
  }

}
