import { Component, OnInit } from '@angular/core';
import { 
  Router, 
  ActivatedRoute } from '@angular/router';
import { 
  FormGroup, 
  FormControl, 
  Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { TeamService } from './team.service';

@Component({
  selector: 'app-group-team',
  templateUrl: './group-team.component.html',
  styleUrls: ['./group-team.component.css']
})
export class GroupTeamComponent implements OnInit {
  form     : FormGroup;
  mode     : string;
  team     : any;
  userList : Array<any>;
  newUser  : any;

  constructor( 
    private location    : Location,
    private router      : Router,
    private route       : ActivatedRoute,
    private teamService : TeamService
  ) {
    this.form = new FormGroup({
      name        : new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
    });
    this.userList = [];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mode = params['mode'];

      if (params['id']) {
        this.teamService.getTeam(params['id'])
          .subscribe(team => this.team = team, (error)=> console.log(error) );
        
        this.teamService.getUsers(params['id'])
          .subscribe(users => this.userList = users, (error)=> console.log(error));
      }
    });
  }

  onSubmit(form: FormGroup) {
    this.teamService.addTeam(form.value)
      .then(_=> {
        this.location.back();
      }, (error) => {
        console.log(error);
      });
  }

  onAddUser() {
    this.newUser = {
      nickname  : '',
      email     : '',
      isCreated : true
    };
    this.userList.push(this.newUser);
  }

  onUserSelected(user, event) {
    if (this.isUserExist(event)) {
      alert('Already exists in this family!')
        return;
    }      

    this.newUser = event;
    user.nickname = event.nickname;
    user.email = event.email;
    user.isCreated = null;
    user.isUnsaved = true;
  }

  onSaveUser(user) {
    this.teamService.addUser(this.team.$key, this.newUser)
      .then(_=> { 
        this.newUser = null;
        console.log(user);
        user.isUnsaved = false;
      });
  }

  onRemoveUser(user: any) {
    if (user.isCreated || user.isUnsaved) {
      this.userList.pop();
      this.newUser = null;
      return;
    }

    if (confirm('Are you sure to remove "' + user.nickname + '" from this team?'))
      this.teamService.removeUser(this.team.$key, user);
  }

  isUserExist(user: any) {
    for (let i=0; i<this.userList.length; i++) {
      if (this.userList[i].$key == user.$key)
        return true;
    }
    return false;
  }
}
