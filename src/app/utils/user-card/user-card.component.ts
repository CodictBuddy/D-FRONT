import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input('showCheckMark') showCheckMark: boolean = false;
  @Input('hide_border') hide_border: boolean = false;
  @Input('disable') disable: boolean = false;

  @Input('main_text') main_text = '';
  @Input('description_text') description_text = '';
  @Input('dymanic_id') dymanic_id = '';
  @Input('img_url') img_url = '';
  @Input('btn_label') btn_label = '';
  @Input('fallback_img_url') fallback_img_url = '';
  @Output('cardClicked') cardClicked = new EventEmitter();
  @Output('closeClicked') closeClicked = new EventEmitter();
  @Output('mainBtnClicked') mainBtnClicked = new EventEmitter();
  constructor() {}
  ngOnInit() {}

  cardClick(dynamicId) {
    this.cardClicked.emit({ dynamicId });
  }

  closeClick() {
    this.closeClicked.emit(true);
  }

  mainButtonClick(btnInfo) {
    this.mainBtnClicked.emit({ btnInfo });
  }
}
