import { UtilService } from '../util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {
  constructor(private util: UtilService) {}
  multipleButtons = true;
  ngOnInit() {}

  async openActionSheet() {
    const b = this.util.alert_options;
    await this.util.dynamicActionSheet({ buttons: b });
  }
}
