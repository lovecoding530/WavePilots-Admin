import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-carousels-list',
  templateUrl: './carousels-list.component.html',
  styleUrls: ['./carousels-list.component.css']
})
export class CarouselsListComponent implements OnInit {

  fieldNames = [
    { title: 'Order No', width: 15 },
    { title: 'Type',     width: 50 },
    { title: 'Name',     width: 250 },
    { title: 'Avatar',   width: 50 },
    { title: 'App Link', width: 500 },
    { title: 'Edit',     width: 50 },
  ]

  carouselsList: any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService,
    public router     : Router,
    public route      : ActivatedRoute,
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.getCarousels().subscribe((res) => {
      console.log('carousels');
      // console.log(res);
      this.carouselsList = res.map(carousel => {
        if (carousel.ref.Parent == 'casinos') {
          carousel.type = 'Casino';
        } else if (carousel.ref.Parent == 'slots') {
          carousel.type = 'Slot';
        } else if (carousel.ref.Parent == 'bonuses') {
          carousel.type = 'Bonus Game';
        } else if (carousel.ref.Parent == 'news') {
          carousel.type = 'Casino News';
        }
        return carousel;
      });
      this.loading = false;
    });
    // let that = this;
    // ref.on('child_added', function(snapshot) {
    //   console.log('^^^^^^ carousel  ordering   ^^^^^^');
    //   console.log(snapshot.key);
    //   that.carouselsList.push(snapshot.val());
    // })
    // ref.on('child_changed', function(snapshot) {
    //   console.log('^^^^^^ carousel  ordering   ^^^^^^');
    //   console.log(snapshot.key);
    // })

  }

  onClickItem(carousel) {
    console.log('clicked detail carousel');
    // console.log(carousel);
    let pageName: string;
    if (carousel.ref.Parent == 'casinos') {
      pageName = 'casino';
    } else if (carousel.ref.Parent == 'slots') {
      pageName = 'slot';
    } else if (carousel.ref.Parent == 'bonuses') {
      pageName = 'bonus';
    } else if (carousel.ref.Parent == 'news') {
      pageName = 'casinonews';
    }
    let path = `/home/${pageName}/detail/${carousel.$key}`;
    console.log(path);
    this.router.navigate([path], [{
      relativeTo: this.route,
      // queryParams: {
      //   'mode' : 'detail',
      //   pageName : carousel.$key,
      // }
    }]);

  }

  onPressOrderUp(item) {
    let index = this.carouselsList.indexOf(item);
    // console.log('carousel  ->', carousel);
    let prevItem = this.carouselsList[index - 1];

    let oneKey   = item.$key;
    let twoKey   = prevItem.$key;
    let oneOrder = item.ref.Order;
    let twoOrder = prevItem.ref.Order;
    
    this.loading = true;
    this.sharedService.updateCarouselOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateCarouselOrder(twoKey, oneOrder).then((res) => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }).catch((error) => {
      this.loading = false;
    })
  }

  onPressOrderDown(item) {
    let index = this.carouselsList.indexOf(item);
    console.log('Index  ->', index);
    let nextItem = this.carouselsList[index + 1];

    let oneKey   = item.$key;
    let twoKey   = nextItem.$key;
    let oneOrder = item.ref.Order;
    let twoOrder = nextItem.ref.Order;

    this.loading = true;
    this.sharedService.updateCarouselOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateCarouselOrder(twoKey, oneOrder).then((res) => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }).catch((error) => {
      this.loading = false;
    })
  }

  onPressDelete(carousel) {
    this.loading = true;
    let pageName: string;
    let promise: Promise<any>;
    let parent = carousel.ref.Parent
    if (parent == 'casinos') {
      promise = this.sharedService.removeCasinoFromCarousel(carousel);
    } else if (parent == 'slots') {
      promise = this.sharedService.removeSlotFromCarousel(carousel);
    } else if (parent == 'bonuses') {
      promise = this.sharedService.removeBonusFromCarousel(carousel);
    } else if (parent == 'news') {
      promise = this.sharedService.removeCasinoNewsFromCarousel(carousel);
    } else {
      return
    }
    promise.then((res) => {
      this.loading = false;
    }).catch((error) => {
      this.loading = false;
    })
  }

}
