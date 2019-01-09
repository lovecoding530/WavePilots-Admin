import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-select-recommend-casino',
  templateUrl: './select-recommend-casino.component.html',
  styleUrls: ['./select-recommend-casino.component.css']
})
export class SelectRecommendCasinoComponent implements OnInit {

  fieldNames = [
    { title: '-',                     width: 50 },
    { title: 'No',                    width: 15 },
    { title: 'Name',                  width: 350 },
    { title: 'Visited Count',         width: 50 },
    { title: 'Avatar',                width: 350 },
    { title: 'App Link',              width: 400 },
    { title: 'Software',              width: 300 },
    { title: 'Website',               width: 400 },
    { title: 'Withdrawal Methods',    width: 350 },
    { title: 'Deposit Methods',       width: 350 },
    { title: 'Currencies',            width: 350 },
    { title: 'Languages',             width: 350 },
    { title: 'Licenses',              width: 300 },
    { title: 'Withdrawal Limits',     width: 350 },
    { title: 'Restricted Countries',  width: 350 },
    { title: 'Casino Type',           width: 300 },
    { title: 'Return To Player',      width: 300 },
    { title: 'Allow Manual Flushing', width: 250 },
    { title: 'Live Chat',             width: 250 },
    { title: 'Established',           width: 250 },
    { title: 'Affiliate Program',     width: 250 },
    { title: 'Contacts',              width: 300 },
    { title: 'Owner',                 width: 200 },
    { title: 'Rate',                  width: 50 },
    { title: 'Launch Date',           width: 100 },
    // { title: 'Edit',                  width: 200 },
  ]

  casinoList : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allCasinos.map(list => list.map(casino => {
      // console.log(casino);
      let fullAppLink = casino.raw.AppLink;
      Object.keys(casino.raw).forEach((key) => {
        
        let value: string = casino.raw[key];
        if (value.length > 30 && key != 'ImageFullPath') {
          // console.log(value);
          casino.raw[key] = value.substring(0, 27) + "...";
        }
        // console.log(casino[key]);
      });
      casino.ShortAppLink = casino.raw.AppLink;
      casino.raw.AppLink = fullAppLink;
      return casino;
    })).subscribe((casinos) => {
      this.loading = false;
      this.casinoList = casinos.reverse();
      console.log('^^^^^^^  loaded casinos  ^^^^^^^^');
    });
    // this.sharedService.testQuery();
    
  }
}
