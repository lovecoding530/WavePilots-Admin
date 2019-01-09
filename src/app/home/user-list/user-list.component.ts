import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  userList   : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.userList = this.sharedService.allUsers;
    this.userList.subscribe((res) => {
      this.loading =false;
      console.log(res);
    });
    
  }

  onEnableUser(user) {
    this.loading = true;
    this.sharedService.changeUserState(user, false).then(_ => {
      this.loading = false;
    }).catch(_ => {
      this.loading = false;
    })
  }

  onDisableUser(user) {
    this.loading = true;
    this.sharedService.changeUserState(user, true).then(_ => {
      this.loading = false;
    }).catch(_ => {
      this.loading = false;
    })
  }
}
