import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { SharedService } from '../../shared/shared.service';
import { UserService } from './user.service';
import { TeamService } from '../group-team/team.service';
import { FamilyService } from '../group-family/family.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user      : any;
  form      : FormGroup;
  submitted : boolean;
  mode      : string;
  teamList  : Array<any>;
  familyList: Array<any>;
  pickedTeam: any;
  pickedFamily: any;

  constructor(
    private router        : Router,
    private route         : ActivatedRoute,
    private location      : Location,
    private sharedService : SharedService,
    private userService   : UserService,
    private teamService   : TeamService,
    private familyService : FamilyService,

  ) {
    this.form = new FormGroup({
      nickname    : new FormControl('', Validators.required),
      email       : new FormControl('', Validators.required),
      firstname   : new FormControl('', Validators.required),
      lastname    : new FormControl('', Validators.required),
      middlename  : new FormControl(null),
      cellphone   : new FormControl(null),
      handle      : new FormControl(null),
      title       : new FormControl(null),
      teamId      : new FormControl(null),
      familyId    : new FormControl(null),
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let uid = params['id'];
      this.mode = params['mode'];
      this.user = this.sharedService.getUser(uid);
      this.user.subscribe(user => {
      });
    });

    /**
     * load teams
     */
    this.teamService.allTeams.subscribe(teams=> {
      this.teamList = teams;
    }, (error)=> {
      console.log(error);
    });

    /**
     * load families
     */
    this.familyService.allFamilies.subscribe(families=> {
      this.familyList = families;
    }, (error)=> {
      console.log(error);
    })
  }

  onSubmit(form: FormGroup) {
    // this.submitted = true;
    // if (this.form.valid) {
    //   this.sharedService.updateProfile(form.value);
    // }
  }

  onAddUser(form: FormGroup) {
    form.value.teamId = this.pickedTeam && this.pickedTeam.$key;
    form.value.familyId = this.pickedFamily && this.pickedFamily.$key;
    
    this.userService.addUser(form.value).then(_=> {
      alert('A new user has been added successfully.');
      this.location.back();
    });
  }

}
