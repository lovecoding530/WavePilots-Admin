import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-casino-news-list',
  templateUrl: './casino-news-list.component.html',
  styleUrls: ['./casino-news-list.component.css']
})
export class CasinoNewsListComponent implements OnInit {

  fieldNames = [
    { title: '-',                     width: 50 },
    { title: 'No',                    width: 15 },
    { title: 'Name',                  width: 250 },
    { title: 'Visited Count',         width: 50 },
    { title: 'Avatar',                width: 100 },
    { title: 'News Content',              width: 350 },
    { title: 'Edit',                  width: 200 },
  ]

  newsList  : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allCasinoNews.map(list => list.map(news => {
      let fullAppLink = news.raw.AppLink;
      Object.keys(news.raw).forEach((key) => {
        let value: string = news.raw[key];
        if (value.length > 150 && key != 'ImageFullPath') {
          news.raw[key] = value.substring(0, 147) + "...";
        }
      });
      news.ShortAppLink = news.raw.AppLink;
      news.raw.AppLink = fullAppLink;
      return news;
    })).subscribe((newses) => {
      this.loading = false;
      this.newsList = newses.reverse();
    });

  }

  onAddToCarousel(news) {
    this.loading = true;
    this.sharedService.addCasinoNewsToCarousel(news).then((res) => {
      console.log('^^^^^^  Added news to carousel ^^^^^^');
      this.loading = false;
      news.isCarousel = true;
    }).catch((error) => {
      console.log('*****  Error  Adding news to carousel ^^^^^^');
      console.log(error);
      this.loading = false;
    })
  }
  
  onRemoveFromCarousel(news) {
    this.loading = true;
    this.sharedService.removeCasinoNewsFromCarousel(news).then((res) => {
      console.log('^^^^^^  removed news to carousel ^^^^^^');
      this.loading = false;
      news.isCarousel = false;
    }).catch((error) => {
      console.log('*****  Error  Removing news to carousel ^^^^^^');
      console.log(error);
      this.loading = false;
    })

  }

  onPressOrderUp(item) {
    let index = this.newsList.indexOf(item);
    let prevItem = this.newsList[index - 1];

    let oneKey   = item.$key;
    let twoKey   = prevItem.$key;
    let oneOrder = item.Order;
    let twoOrder = prevItem.Order;

    this.loading = true;
    this.sharedService.updateCasinoNewsOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateCasinoNewsOrder(twoKey, oneOrder).then((res) => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }).catch((error) => {
      this.loading = false;
    })
  }

  onPressOrderDown(item) {
    let index = this.newsList.indexOf(item);
    console.log('Index  ->', index);
    let nextItem = this.newsList[index + 1];

    let oneKey   = item.$key;
    let twoKey   = nextItem.$key;
    let oneOrder = item.Order;
    let twoOrder = nextItem.Order;

    this.loading = true;
    this.sharedService.updateCasinoNewsOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateCasinoNewsOrder(twoKey, oneOrder).then((res) => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }).catch((error) => {
      this.loading = false;
    })
  }

  onPressDelete(item) {
    this.loading = true;
    this.sharedService.deleteCasinoNews(item).then(_ => {
      this.loading = false;
      // this.newsList
    }).catch(_ => {
      this.loading = false;
    });
  }  
}
