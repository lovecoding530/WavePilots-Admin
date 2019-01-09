import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {

  constructor(
    private af : AngularFire
  ) {}

  /**
   * get all teams
   */
  get allTeams(): FirebaseListObservable<any> {
    return this.af.database.list('teams/');
  }

  /**
   * get team by id
   */
  getTeam(tid: string): FirebaseObjectObservable<any> {
    return this.af.database.object('teams/' + tid);
  }

  /**
   * create a new team
   */
  addTeam(team: any) {
    return this.af.database.list('teams/').push(team);
  }

  getUsers(teamId: string) {
    return this.af.database.list('users/').map(users => {
      return users.filter(user => user.relationship && user.relationship.teamId 
                                                    && user.relationship.teamId == teamId);
    });
  }


  addUser(teamId: string, user: any) {
    return this.af.database.object('users/' + user.$key + '/relationship/').update({teamId: teamId});
  }

  removeUser(teamId: string, user: any) {
    return this.af.database.list('users/' + user.$key + '/relationship').remove('teamId');
  }
}
