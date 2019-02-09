import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../shared/shared.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-waver-list',
  templateUrl: './waver-list.component.html',
  styleUrls: ['./waver-list.component.css']
})
export class WaverListComponent implements OnInit {
  userList   : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allUsers.subscribe((res) => {
      this.userList = res.filter(user=>user.type=="waver");
      for (const user of this.userList) {
        user.photo_download_url = "assets/img/new_logo.png"
        this.sharedService.downloadUrl(user.photo_url).then(url=>user.photo_download_url = url)
      }
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
