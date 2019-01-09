import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-bonus-games-list',
  templateUrl: './bonus-games-list.component.html',
  styleUrls: ['./bonus-games-list.component.css']
})
export class BonusGamesListComponent implements OnInit {

  fieldNames = [
    { title: '-',                     width: 50 },
    { title: 'No',                    width: 15 },
    { title: 'Name',                  width: 250 },
    { title: 'Visited Count',         width: 50 },
    { title: 'Avatar',                width: 350 },
    { title: 'App Link',              width: 250 },
    { title: 'Type',                  width: 100 },
    { title: 'Bonus Value',           width: 100 },
    { title: 'Bonus Code',            width: 100 },
    { title: 'Featured',              width: 50 },
    { title: 'Free Spin',             width: 50 },
    { title: 'Match Bonus',           width: 50 },
    { title: 'Edit',                  width: 200 },
  ]

  bonusList  : any;
  loading    : boolean;
  // appLink    : string;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allBonusGames.map(list => list.map(bonus => {
      let fullAppLink = bonus.raw.AppLink;
      Object.keys(bonus.raw).forEach((key) => {
        let value: string = bonus.raw[key];
        if (value.length > 30 && key != 'ImageFullPath') {
          bonus.raw[key] = value.substring(0, 27) + "...";
        }
      });
      bonus.ShortAppLink = bonus.raw.AppLink;
      bonus.raw.AppLink = fullAppLink;
      return bonus;
    })).subscribe((bonuses) => {
      this.loading = false;
      this.bonusList = bonuses.reverse();
    });

  }

  onAddToCarousel(bonus) {
    this.loading = true;
    this.sharedService.addBonusToCarousel(bonus).then((res) => {
      console.log('^^^^^^  Added bonus to carousel ^^^^^^');
      this.loading = false;
      bonus.ref.isCarousel = true;
    }).catch((error) => {
      console.log('*****  Error  Adding bonus to carousel ^^^^^^');
      console.log(error);
      this.loading = false;
    })
  }
  
  onRemoveFromCarousel(bonus) {
    this.loading = true;
    this.sharedService.removeBonusFromCarousel(bonus).then((res) => {
      console.log('^^^^^^  removed bonus to carousel ^^^^^^');
      this.loading = false;
      bonus.ref.isCarousel = false;
    }).catch((error) => {
      console.log('*****  Error  Removing bonus to carousel ^^^^^^');
      console.log(error);
      this.loading = false;
    })

  }

  onAddToBannerAd(bonus) {
    this.loading = true
    this.sharedService
        .addBannerAd(bonus)
        .then(res => {
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
  }

  onRemoveFromBannerAd(bonus) {
    this.loading = true
    this.sharedService
        .removeBannerAd(bonus)
        .then(res => {
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
  }

  onPressOrderUp(item) {
    let index = this.bonusList.indexOf(item);
    let prevItem = this.bonusList[index - 1];

    let oneKey   = item.$key;
    let twoKey   = prevItem.$key;
    let oneOrder = item.ref.Order;
    let twoOrder = prevItem.ref.Order;

    this.loading = true;
    this.sharedService.updateBonusGameOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateBonusGameOrder(twoKey, oneOrder).then((res) => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }).catch((error) => {
      this.loading = false;
    })
  }

  onPressOrderDown(item) {
    let index = this.bonusList.indexOf(item);
    console.log('Index  ->', index);
    let nextItem = this.bonusList[index + 1];

    let oneKey   = item.$key;
    let twoKey   = nextItem.$key;
    let oneOrder = item.ref.Order;
    let twoOrder = nextItem.ref.Order;

    this.loading = true;
    this.sharedService.updateBonusGameOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateBonusGameOrder(twoKey, oneOrder).then((res) => {
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
    this.sharedService.deleteBonus(item).then(_ => {
      this.loading = false;
      // this.bonusList
    }).catch(_ => {
      this.loading = false;
    });
  }




}
