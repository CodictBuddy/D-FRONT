import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LikesCommentsService } from 'src/app/services/likes-comments.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/utils/util.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  myInfo: any
  userFallbackImage = this.util.fallbackUserImage;
  commentText = ''
  postDetail: any;
  isSelfPost: Boolean = false
  contentId = this.route.snapshot.params['id'] || null
  commentsList = []
  totalCommentsCount: number = 0
  isModified = false
  commentPosition = null

  constructor(
    private user: UserService,
    private util: UtilService,
    private post: PostService,
    private route: ActivatedRoute,
    private likesComments: LikesCommentsService
  ) {
    // this._socket.on('updateMessage', (res) => {
    //   // if (res && this.myInfo['_id'] !== this.messagesList[res.position].senderUser._id) {
    //   this.messagesList[res.position].content = res.updated_mesasge?.content;
    //   this.messagesList[res.position].is_edited = res.updated_mesasge?.is_edited;
    //   this.messagesList[res.position].updated_at = res.updated_mesasge?.updated_at;

    //   // }
    // })

    // this._socket.on('deleteMessage', (res) => {
    //   if (res && this.roomId == res.room_id) {
    //     this.messagesList = this.util.arrayItemRemover(res.position, this.messagesList)
    //   }
    // })  for reference
  }

  ngOnInit() {

    this.getMyInfo()
    this.getPostDetail(this.contentId)
    this.comments(this.contentId)
  }


  getMyInfo() {
    const info = this.user.getMyDetails()
    this.myInfo = this.user.getFullyProcessedUserData(info)

  }

  async getPostDetail(value) {
    const data = await this.post.getPostDetail(value)
    if (data) {
      this.isSelfPost = data?.isSelfPost ?? false
      this.postDetail = data.post ?? data
      this.postDetail['created_by'] = this.user.getFullyProcessedUserData(this.postDetail?.['created_by']);

    }
  }


  async openActionSheet(i) {
    let hideOptions = [];
    const isToday = this.util.compareDateIso(
      new Date().toISOString(),
      this.commentsList[i].created_at
    );
    if (this.myInfo['_id'] == this.commentsList[i].created_by._id && isToday) {
      hideOptions = [];
    } else {
      hideOptions = [
        this.util.alert_options.comment_options[1].text,
        this.util.alert_options.comment_options[2].text,
      ];
    }

    const b = this.util.modifyActionSheetOptions(
      hideOptions,
      this.util.alert_options.comment_options
    );
    const { data } = await (
      await this.util.dynamicActionSheet({ buttons: b })
    ).onDidDismiss();
    if (data) {
      if (this.util.alert_options.comment_options[1].text == data) {
        // this.textMessageString = this.messagesList[i].content;
        // this.updateMessageInfo = {
        //   isEditClicked: true,
        //   position: i,
        //   messageId: this.messagesList[i]._id,
        //   content: this.textMessageString,
        //   createdAt: this.messagesList[i].created_at,
        // };

        this.commentText = this.commentsList[i].comment_data
        this.commentPosition = i
        this.isModified = true;
      } else if (this.util.alert_options.comment_options[2].text == data) {
        this.removeComment(
          this.commentsList[i]._id, i)

      }
    }
  }



  $openActionSheet(comment_id: string, position) {
    this.commentText = this.commentsList[position].comment_data
    this.commentPosition = position
    this.isModified = true;

  }

  async removeComment(comment_id: string, position) {
    const data = await this.likesComments.deleteComment(comment_id)
    if (data) {
      this.commentsList = this.util.arrayItemRemover(position, this.commentsList)
    }
  }

  async updateComment(comment_id: string, updatedData: string, position) {
    if (!comment_id || !updatedData) return

    const fv = {
      comment_data: updatedData
    }

    const data = await this.likesComments.updateComment(fv, comment_id)
    if (data) {
      this.commentsList[position].comment_data = updatedData
      this.isModified = false
      this.commentPosition = null
      this.commentText = ''
    }

  }

  async createComment(comment: string, user_info) {
    if (!comment) return

    if (this.isModified) {
      this.updateComment(this.commentsList[this.commentPosition]._id, comment, this.commentPosition)
    } else {
      const fv = {
        "content_id": this.contentId,
        "type": "content",
        "comment_data": comment,
        "user_id": this.postDetail['created_by']?._id,
        "notification_title": "New comment on your post",
        "navigation_url": `/post/${this.contentId}`,
        "notification_message": `${user_info.first_name} ${user_info.first_name} have commented on your post`
      }

      const commentData = await this.likesComments.createComment(fv)
      if (commentData) {
        this.commentText = ''
        this.comments(this.contentId)
      }
    }

  }

  async comments(contentId) {
    const commentsData = await this.likesComments.getCommentsList(contentId)
    this.commentsList = commentsData?.comments || []
    this.totalCommentsCount = commentsData?.totalComments || 0

    this.commentsList.forEach(async el => {
      el['created_by'] = this.user.getFullyProcessedUserData(el?.['created_by']);
    })

  }
}
