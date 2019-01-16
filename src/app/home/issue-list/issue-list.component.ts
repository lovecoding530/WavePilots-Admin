import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issueList   : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allIssues.subscribe((res) => {
      this.issueList = res;
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
