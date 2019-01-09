import { Component, OnInit } from '@angular/core';
import { menuItems } from '../../app.constants';


declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: Array<any>;

  constructor() { }

  ngOnInit() {
    // $.getScript('../../assets/js/material-dashboard-angular.js');
    this.menuItems = menuItems;
  }

}
