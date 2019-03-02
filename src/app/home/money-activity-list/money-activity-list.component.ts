import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import * as moment from 'moment';

@Component({
  selector: 'money-activity-list',
  templateUrl: './money-activity-list.component.html',
  styleUrls: ['./money-activity-list.component.css']
})
export class MoneyActivityListComponent implements OnInit {
  activityList   : any;
  loading    : boolean;

  filterValues = {};
  filteredActivityList : any;

  constructor(
    private router        : Router,
    private route         : ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      let uid = params['user-id'];
      this.sharedService.getMoneyActivities(uid).subscribe((res) => {
        this.activityList = res;
        this.filteredActivityList = [...this.activityList];
        for (const activity of this.activityList) {
          activity.timeStr = moment(activity.time * 1000).format("MM/DD/YYYY");
        }
        this.loading = false;
      });
    });
  }

  onFilter(event) {
    this.filterValues[event.target.name] = event.target.value;
    this.filteredActivityList = [...this.activityList];
    for (const key of Object.keys(this.filterValues)) {
      let filterVal = this.filterValues[key];
      this.filteredActivityList = this.filteredActivityList.filter((activity)=>activity[key].includes(filterVal));
    }
  }
}
