import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
hide:Boolean = false
  constructor() { }

  ngOnInit() {
  }

  toggleView(){
    this.hide =!this.hide
  }
}
