import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';

export class TrainingModel {
  title      ?: string; //title
  description?: string; //description
  videoUrl   ?: string; //vidoe url
  thumbUrl   ?: string; //thumbnail url
  contentType?: string; //content type
  assignment ?: Array<string>; //assignment - team or users

}

@Injectable()
export class TrainingService {

  constructor(
    private af: AngularFire,
  ) {}

  
  /**
   * get all trainings
   */
  get allTrainings(): FirebaseListObservable<any> {
    return this.af.database.list('trainings/');
  }

  /**
   * add new training
   * 
   * @param training 
   */
  addTraining(training: TrainingModel) {    
    
    let assignment:{users?: Object, teams?: Object} = {};
    assignment.users = {};
    assignment.teams = {};

    for (let i=0; i<training.assignment.length; i++) {
      let assign = training.assignment[i].split('#');
      if (assign && assign[0] == 'user') {
        if (assign[1]) {
          assignment.users[assign[1]] = true;
        }
      }

      if (assign && assign[0] == 'team') {
        if (assign[1]) {
          assignment.teams[assign[1]] = true;
        }
      }
    }

    // this.http.get('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBLXXPduDETAmCTYETq0wBV6LMQd88skgs&part=snippet&id=aJIMoLgqU_o')
    //   .map(res=> res.json()).subscribe(result=> {
    //     console.log(result);
    //   });
    let videoId = training.videoUrl && training.videoUrl.split('=').pop();
    
    return this.af.database.list('trainings/').push({
      title: training.title,
      description: training.description,
      status: true,
      thumbnail: (videoId)? 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg' : null,
      url: training.videoUrl,
      type: training.contentType,
      assignment: {users: assignment.users, teams: assignment.teams},
      date: firebase.database['ServerValue']['TIMESTAMP'],
    });
  }
}
