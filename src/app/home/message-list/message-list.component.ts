import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../shared/shared.service';


@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messageList : Array<any>;
  
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.allMessages.subscribe(messages => {
      this.messageList = messages
    }, (error) => {
      console.log(error);
    });
  }

}
