import { UserService } from './../../services/user.service';
import { UtilService } from './../../utils/util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  newMessage:Boolean = true
  my_information = {}
  userFallbackImage = this.util.fallbackUserImage;
  constructor(private util:UtilService, private userService:UserService) { }

  ngOnInit() {
    this.getMyDetails() 
  }

  getMyDetails() {
    let myInfo = this.userService.getMyDetails();
    this.my_information = this.userService.getFullyProcessedUserData(myInfo);
  }


}
