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

  filterValues = {};
  filteredIssueList : any;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allIssues.subscribe((res) => {
      this.issueList = res;
      this.filteredIssueList = [...this.issueList];
      for (const issue of this.issueList) {
        issue.user_name = `${issue.last_name}`
      }
      this.loading =false;
      console.log(res);
    });
  }

  onFilter(event) {
    this.filterValues[event.target.name] = event.target.value;
    this.filteredIssueList = [...this.issueList];
    for (const key of Object.keys(this.filterValues)) {
      let filterVal = this.filterValues[key];
      this.filteredIssueList = this.filteredIssueList.filter((issue)=>issue[key].includes(filterVal));
    }
  }
}
