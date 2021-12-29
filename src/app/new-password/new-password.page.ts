import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  hide: boolean = false;
  constructor() {}

  ngOnInit() {}
  toggleView() {
    this.hide = !this.hide;
  }
}
