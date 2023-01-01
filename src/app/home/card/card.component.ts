import { LikesCommentsService } from './../../services/likes-comments.service';
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
  myInfo: any
  totalLikesCount: number = 0
  totalCommentsCount: number = 0
  userFallbackImage = this.util.fallbackUserImage;
  post_modification_options = this.util.alert_options.post_modification_options
  constructor(private tts: TextToSpeech,
    private post: PostService,
    private user: UserService,
    private util: UtilService,
    private route: ActivatedRoute,
    private likesComments: LikesCommentsService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']
    this.getPostDetail(id, this.post_data);
    this.getMyInfo();
  }
  ionViewWillEnter() {

  }

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  sound(content) {
    this.playSound = !this.playSound;

    if (!this.playSound) {
      // this.tts.stop();
      content = ""
    }

    this.tts
      .speak({
        text: content,
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

  setLanguage(i) {
    console.log(i);
    console.log(
      this.speechData.voices[i].lang + this.speechData.voices[i].name
    );
    this.speech.setLanguage(this.speechData.voices[i].lang);
    this.speech.setVoice(this.speechData.voices[i].name);
  }

  async getPostDetail(value, post_details?) {
    const data = post_details ? post_details : value ? await this.post.getPostDetail(value) : null
    if (data) {
      this.isSelfPost = data?.isSelfPost ?? false
      this.postDetail = data.post ?? data
      this.postDetail['created_by'] = this.user.getFullyProcessedUserData(this.postDetail?.['created_by']);
      this.getLikesList(this.postDetail?._id);
    }
  }

  getMyInfo() {
    const info = this.user.getMyDetails()
    this.myInfo = this.user.getFullyProcessedUserData(info)
  }

  async openActionSheet(post_id) {
    const b = [...this.post_modification_options]
    console.log('b', b);
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();

    if (data == this.post_modification_options[1].data && post_id) {
      await this.post.deletePost(
        post_id
      )
      this.util.toast('Talk Removed Succesfully', 3000);
      this.util.routeNavigation('/home');
    }
    else if (data == this.post_modification_options[0].data && post_id) {
      this.util.routeNavigation('/post', post_id);

    }
  }

  async createLikes(content_id, user_id) {
    if (!content_id || !user_id) return
    this.toggleLike()
    const payload = {
      content_id,
      type: "content",
      user_id,
      notification_title: "You got a new like",
      notification_message: `${this.myInfo?.['first_name']}has liked your post`,
      navigation_url: `/post/${content_id}`
    }

    const data = await this.likesComments.createLike(payload)
    if (data) {
      this.getLikesList(content_id)
    }

  }

  async deleteLike(content_id) {
    if (!content_id) return
    this.toggleLike()
    const data = await this.likesComments.deleteLikes(content_id)
    if (data) {
      this.getLikesList(content_id)
    }
  }

  async getLikesList(content_id) {
    const data = await this.likesComments.getLikesList(content_id)
    if (data) {
      this.isLiked = data.isLikedByMe;
      this.totalLikesCount = data.totalLikes;
    }
  }
}
