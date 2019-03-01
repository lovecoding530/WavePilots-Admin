import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-wave-list',
  templateUrl: './wave-list.component.html',
  styleUrls: ['./wave-list.component.css']
})
export class WaveListComponent implements OnInit {
  waveList   : any;
  loading    : boolean;

  filterValues = {};
  filteredWaveList : any;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allWaves.subscribe((res) => {
      this.waveList = res;
      this.filteredWaveList = [...this.waveList];
      for (const wave of this.waveList) {
        wave.photo_download_url = "assets/img/new_logo.png"
        this.sharedService.downloadUrl(wave.photo_url).then(url=>wave.photo_download_url = url)
        let deal = "";
        for (const key in wave.services) {
          if (wave.services.hasOwnProperty(key)) {
            const service = wave.services[key];
            deal += `${service.name || "No name"} - $ ${service.commission_fee}\n`;
          }
        }
        wave.deal = `${deal}`;
      }
      this.loading =false;
      console.log(res);
    });
  }

  onFilter(event) {
    this.filterValues[event.target.name] = event.target.value;
    this.filteredWaveList = [...this.waveList];
    for (const key of Object.keys(this.filterValues)) {
      let filterVal = this.filterValues[key];
      this.filteredWaveList = this.filteredWaveList.filter((wave)=>wave[key].includes(filterVal));
    }
  }
}
