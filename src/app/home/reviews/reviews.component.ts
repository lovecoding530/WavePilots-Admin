import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  fieldNames = [
    { title: 'No',                    width: 15 },
    { title: 'Username',              width: 100 },
    { title: 'Item Title',            width: 200 },
    { title: 'Item Type',             width: 50 },
    { title: 'Like Reivew',           width: 400 },
    { title: 'Disike Reivew',         width: 400 },
    { title: 'Rate',                  width: 50 },
    { title: 'Enable/Disable',        width: 50 },
  ]

  reviewList : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allReviews.map(list => list.map(slot => {
      Object.keys(slot).forEach((key) => {
        let value: string = slot[key];
        if (value.length > 100) {
          slot[key] = value.substring(0, 97) + "...";
        }
      });
      return slot;
    })).subscribe((slots) => {
      this.loading = false;
      this.reviewList = slots.reverse();
    });
  }

  onPressEnable(review) {
    this.loading = true;
    this.sharedService.updateReviewState(review, true).then(_ => {
      this.loading = false;
      // this.newsList
    }).catch(_ => {
      this.loading = false;
    });
  }

  onPressDisable(review) {
    this.loading = true;
    this.sharedService.updateReviewState(review, false).then(_ => {
      this.loading = false;
      // this.newsList
    }).catch(_ => {
      this.loading = false;
    });
  }  

}
