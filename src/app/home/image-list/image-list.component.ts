import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../shared/shared.service';


@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {
  imageList : any;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.imageList = this.sharedService.allImages;
  }

}
