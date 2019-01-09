import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    $.getScript('../../assets/js/material-dashboard.js');
    this.router.navigate(['/home/pilots']);
  }

}
