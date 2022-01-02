import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss'],
})
export class InvitationsComponent implements OnInit {
  @Input('reusable') reusable: Boolean = false;
  tab = 1;
  constructor() {}

  ngOnInit() {}

  segmentChanged(event) {
    this.tab = event.target.value;
  }
}
