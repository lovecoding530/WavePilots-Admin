import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-display-message',
  templateUrl: './display-message.component.html',
  styleUrls: ['./display-message.component.css']
})
export class DisplayMessageComponent implements OnInit {

  title   : any;
  message   : any;
  loading    : boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { 
  }

  ngOnInit() {
    console.log(this.route.snapshot.params);
    let params = this.route.snapshot.params;

    this.title = params.title;
    this.message = params.message
  }

}
