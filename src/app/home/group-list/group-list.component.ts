import { Component, OnInit } from '@angular/core';

import { FamilyService } from '../group-family/family.service';
import { TeamService } from '../group-team/team.service';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  familyList : any;
  teamList   : any;

  constructor(
    private familyService : FamilyService,
    private teamService   : TeamService,
  ) { }

  ngOnInit() {
    this.familyList = this.familyService.allFamilies;
    this.teamList   = this.teamService.allTeams;
  }

}
