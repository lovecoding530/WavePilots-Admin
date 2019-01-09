import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-slots-list',
  templateUrl: './slots-list.component.html',
  styleUrls: ['./slots-list.component.css']
})
export class SlotsListComponent implements OnInit {

  fieldNames = [
    { title: '-',                     width: 50 },
    { title: 'No',                    width: 15 },
    { title: 'Name',                  width: 200 },
    { title: 'Visited Count',         width: 50 },
    { title: 'Avatar',                width: 100 },
    { title: 'App Link',              width: 250 },
    { title: 'Main Offer',            width: 200 },
    { title: 'Edit',                  width: 100 },
  ]

  slotsList : any;
  loading    : boolean;

  constructor(
    private sharedService: SharedService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.sharedService.allSlots.map(list => list.map(slot => {
      let fullAppLink = slot.raw.AppLink;
      Object.keys(slot.raw).forEach((key) => {
        let value: string = slot.raw[key];
        if (value.length > 30 && key != 'ImageFullPath') {
          slot.raw[key] = value.substring(0, 27) + "...";
        }
      });
      slot.ShortAppLink = slot.raw.AppLink;
      slot.raw.AppLink = fullAppLink;
      return slot;
    })).subscribe((slots) => {
      this.loading = false;
      this.slotsList = slots.reverse();
    });
  }

  onAddToCarousel(slot) {
    this.loading = true;
    this.sharedService.addSlotToCarousel(slot).then((res) => {
      console.log('^^^^^^  Added slot to carousel ^^^^^^');
      this.loading = false;
      slot.isCarousel = true;
    }).catch((error) => {
      console.log('*****  Error  Adding slot to carousel ^^^^^^');
      console.log(error);
      this.loading = false;
    })
  }
  
  onRemoveFromCarousel(slot) {
    this.loading = true;
    this.sharedService.removeSlotFromCarousel(slot).then((res) => {
      console.log('^^^^^^  removed slot to carousel ^^^^^^');
      this.loading = false;
      slot.isCarousel = false;
    }).catch((error) => {
      console.log('*****  Error  Removing slot to carousel ^^^^^^');
      console.log(error);
      this.loading = false;
    })

  }

  onPressOrderUp(item) {
    let index = this.slotsList.indexOf(item);
    let prevItem = this.slotsList[index - 1];

    let oneKey   = item.$key;
    let twoKey   = prevItem.$key;
    let oneOrder = item.ref.Order;
    let twoOrder = prevItem.ref.Order;

    this.loading = true;
    this.sharedService.updateSlotOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateSlotOrder(twoKey, oneOrder).then((res) => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
      })
    }).catch((error) => {
      this.loading = false;
    })
  }

  onPressOrderDown(item) {
    let index = this.slotsList.indexOf(item);
    console.log('Index  ->', index);
    let nextItem = this.slotsList[index + 1];

    let oneKey   = item.$key;
    let twoKey   = nextItem.$key;
    let oneOrder = item.ref.Order;
    let twoOrder = nextItem.ref.Order;

    this.loading = true;
    this.sharedService.updateSlotOrder(oneKey, twoOrder).then((res) => {
      this.sharedService.updateSlotOrder(twoKey, oneOrder).then((res) => {        
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
    this.sharedService.deleteSlot(item).then(_ => {
      this.loading = false;
      // this.newsList
    }).catch(_ => {
      this.loading = false;
    });
  }  
}
