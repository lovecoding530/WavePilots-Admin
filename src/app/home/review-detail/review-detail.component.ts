import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css']
})
export class ReviewDetailComponent implements OnInit {

  reviewInfo: any;
  userInfo: any;
  itemInfo: any;
  loading    : boolean;

  reviewKey: string;
  btnTitle: string = "Disable"

  constructor(
    private location     : Location,
    private sharedService: SharedService,
    private router        : Router,
    private route         : ActivatedRoute,
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.reviewKey = params['review'];
      this.loading = true
      this.sharedService.getReviewInfo(this.reviewKey).subscribe((res) => {
        this.reviewInfo = res;

        if (res.Enable) {
          this.btnTitle = "Disable"
        } else {
          this.btnTitle = "Enable"
        }

        this.loading = false;

        if (this.userInfo == null) {
          this.sharedService.getUser(res.UserId).first().subscribe((resUser) => {
            this.userInfo = resUser;
          })
        }
        if (this.itemInfo == null) {
          this.sharedService.getItemInfo(res.Parent, res.ItemKey).first().subscribe((resItem) => {
            this.itemInfo = resItem;
          })
        }

      })

    });


  }

  onClickItem() {
    let pageName: string;
    if (this.reviewInfo.Parent == 'casinos') {
      pageName = 'casino';
    } else if (this.reviewInfo.Parent == 'slots') {
      pageName = 'slot';
    } else if (this.reviewInfo.Parent == 'bonuses') {
      pageName = 'bonus';
    } else if (this.reviewInfo.Parent == 'news') {
      pageName = 'casinonews';
    }
    let path = `/home/${pageName}/detail/${this.reviewInfo.ItemKey}`;
    console.log(path);
    this.router.navigate([path], [{
      relativeTo: this.route,
      // queryParams: {
      //   'mode' : 'detail',
      //   pageName : carousel.$key,
      // }
    }]);

  }

  onChangeState() {
    this.loading = true;
    this.sharedService.updateReviewState(this.reviewInfo, !this.reviewInfo.Enable).then(_ => {
      this.loading = false;
      // this.newsList
    }).catch(_ => {
      this.loading = false;
    });
  }

  onCancel() {
    this.location.back();
  }


}
