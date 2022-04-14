import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  showMore: boolean;
  constructor() {}

  ngOnInit() {}

  trackListData(event) {
    this.showMore = event?.list && event?.list.length;
  }
}
