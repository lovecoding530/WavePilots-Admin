import { Component, OnInit, ViewChild } from '@angular/core';

import { TrainingService, TrainingModel } from './training.service';
import { TeamService } from '../group-team/team.service';
import { UserService } from '../user/user.service';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  trainingList: any;
  assignments : Array<any>;
  training    : TrainingModel;
  contentTypes: Array<string> = ['Video', 'Note'];

  constructor(
    private trainingService: TrainingService,
    private teamService: TeamService,
    private userService: UserService,
  ) {
    this.assignments = [];
  }

  ngOnInit() {
    this.trainingList = this.trainingService.allTrainings;

    this.userService.allUsers.subscribe(users=> {
      for (let i=0; i<users.length; i++) {
        this.assignments.push({
          id: users[i].$key,
          name: users[i].nickname,
          type: 'user'
        });
      }
    });
    
    this.teamService.allTeams.subscribe(teams=> {
      for (let i=0; i<teams.length; i++) {
        this.assignments.push({
          id: teams[i].$key,
          name: teams[i].name,
          type: 'team'
        });
      }
    });

    this.training = new TrainingModel();
  }

  /**
   * new training
   */
  onSaveTraining() {
    this.trainingService.addTraining(this.training).then(()=> {
      this.modal.close();
    }, (error)=> {
      console.log(error);
    });
    
  }

  onModalClosed() {
    this.training = new TrainingModel();
  }
}
