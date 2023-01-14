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

  constructor(
    private user: UserService,
    private util: UtilService,
    private post: PostService,
    private route: ActivatedRoute,
    private likesComments: LikesCommentsService
  ) { }

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


  async createComment(comment: string, user_info) {
    if (!comment) return
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

  async comments(contentId) {
    const commentsData = await this.likesComments.getCommentsList(contentId)
    this.commentsList = commentsData?.comments || []
    this.totalCommentsCount = commentsData?.totalComments || 0

    this.commentsList.forEach(async el => {
      el['created_by'] = this.user.getFullyProcessedUserData(el?.['created_by']);
    })

  }
}
