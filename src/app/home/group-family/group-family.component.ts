import { Component, OnInit } from '@angular/core';
import { 
  Router, 
  ActivatedRoute } from '@angular/router';
import { 
  FormGroup, 
  FormControl, 
  Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { FamilyService } from './family.service';

@Component({
  selector: 'app-group-family',
  templateUrl: './group-family.component.html',
  styleUrls: ['./group-family.component.css']
})
export class GroupFamilyComponent implements OnInit {
  form     : FormGroup;
  mode     : string;
  family   : any;
  userList : Array<any>;
  newUser  : any;

  constructor( 
    private location      : Location,
    private router        : Router,
    private route         : ActivatedRoute,
    private familyService : FamilyService
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
        this.familyService.getFamily(params['id'])
          .subscribe(family => this.family = family, (error)=> console.log(error) );
        
        this.familyService.getUsers(params['id'])
          .subscribe(users => this.userList = users, (error)=> console.log(error));
      }
    });
  }

  onSubmit(form: FormGroup) {
    this.familyService.addFamily(form.value)
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
    this.familyService.addUser(this.family.$key, this.newUser)
      .then(_=> { 
        this.newUser = null;
        user.isUnsaved = false;
      });
  }

  onRemoveUser(user: any) {
    if (user.isCreated || user.isUnsaved) {
      this.userList.pop();
      this.newUser = null;
      return;
    }

    if (confirm('Are you sure to remove "' + user.nickname + '" from this family?')) {
      this.familyService.removeUser(this.family.$key, user);
    }
  }

  isUserExist(user: any) {
    for (let i=0; i<this.userList.length; i++) {
      if (this.userList[i].$key == user.$key)
        return true;
    }
    return false;
  }
}
