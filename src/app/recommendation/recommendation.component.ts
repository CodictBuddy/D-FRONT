
import { ConnectionService } from './../services/connection.service';
import { Subscription } from 'rxjs';
import { UtilService } from '../utils/util.service';
import { UserService } from './../services/user.service';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})

export class RecommendationComponent implements OnInit, OnDestroy {
  @Input('reusable') reusable: Boolean = false;
  @Input('showCount') showCount: number = 10;
  @Output('list') list = new EventEmitter();

  suggestionList = [];
  custonSuggestionList = [];
  userFallbackImage = this.util.fallbackUserImage;
  connection_btns = this.util.connection_btns;
  alertOutputSubs: Subscription;
  constructor(
    private userService: UserService,
    private util: UtilService,
    private connectionService: ConnectionService
  ) {
    this.alertOutputSubs = this.util.actionSheetOutput.subscribe((r) => {
      if (this.connection_btns[2].includes(r.button)) {
        this.removeConnection(r.information._id, this.connection_btns[0]);
      }
    });
  }

  ngOnInit() {
    this.getSuggestions();
  }

  async getSuggestions() {
    const data = await this.userService.getUserSuggestions();

    this.suggestionList = this.structureRecords(data.user);
    this.custonSuggestionList = this.suggestionList.slice(0, this.showCount);
    if (this.suggestionList.length) {
      this.suggestionList.forEach((el) => {
        el.current_btn = this.connection_btns[0];
        el.showCheckMark = false;
        el.hide_border = false;
        el.disable = false;
      });
      this.list.emit({ list: this.suggestionList });
    }
  }
  structureRecords(data) {
    const processedDataList = [];
    if (!data.length) return;
    for (let i = 0; i < data.length; i++) {
      const partialProcessedData = this.userService.processData(
        data[i],
        this.util.default_language
      );
      processedDataList.push(
        this.userService.profilePatchingObject(partialProcessedData)
      );
    }
    return processedDataList;
  }

  viewProfile(uid) {
    if (!uid) return;
    this.util.routeNavigation('dashboard/' + uid);
  }

  connect(uid) {}

  cardClicked(event: Event) {
    this.util.routeNavigation(`dashboard/${event['dynamicId']}`);
    console.log('cardClicked', event);
  }
  closeClicked(event: Event) {
    console.log('closeClicked', event);
  }
  async mainBtnClicked(event: Event, user_id: string, user_data) {
    if (event?.['btnInfo'] === this.connection_btns[0]) {
      const connData = await this.createConnection(
        user_id,
        this.connection_btns[0]
      );
      if (connData) {
        user_data.showCheckMark = !!this.connection_btns[1];
        user_data.current_btn = this.connection_btns[1];
      }
    } else if (event?.['btnInfo'] === this.connection_btns[1]) {
      // this.showCheckMark = !!this.connection_btns[2];
      // this.current_btn = this.connection_btns[2];
      this.util.showAlert({
        ...this.util.alert_constants.withdraw_invitation,
        information: { _id: user_id },
      });
      // this.hide_border = !!this.connection_btns[2];
      // this.disable = !!this.connection_btns[2];
    }
    console.log('mainBtnClicked', event);
  }

  async createConnection(user_id, type) {
    const res = await this.connectionService.createConnection({
      user_id,
      type,
    });
    return res;
  }

  async removeConnection(user_id, connection_type) {
    this.connectionService
      .removeConnection({
        user_id,
        connection_type,
      })
      .then(() => {
        const i = this.suggestionList.findIndex((el) => el._id === user_id);
        this.suggestionList[i].hide_border = true;
        this.suggestionList[i].disable = true;
        this.suggestionList[i].showCheckMark = false;
        this.suggestionList[i].current_btn = this.connection_btns[2];
      });
  }

  ngOnDestroy() {
    this.alertOutputSubs.unsubscribe();
  }
}
