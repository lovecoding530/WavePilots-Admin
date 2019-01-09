import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/map';


@Injectable()
export class FamilyService {

  constructor(
    private af : AngularFire
  ) {}

  /**
   * get all families
   */
  get allFamilies(): FirebaseListObservable<any> {
    return this.af.database.list('families/');
  }

  /**
   * get family by id
   */
  getFamily(fid: string): FirebaseObjectObservable<any> {
    return this.af.database.object('families/' + fid);
  }

  /**
   * create a new family
   */
  addFamily(family: any) {
    return this.af.database.list('families/').push(family);
  }

  getUsers(familyId: string) {
    return this.af.database.list('users/').map(users => {
      return users.filter(user => user.relationship && user.relationship.familyId 
                                                    && user.relationship.familyId == familyId);
    });
  }

  addUser(familyId: string, user: any) {
    return this.af.database.object('users/' + user.$key + '/relationship/').update({familyId: familyId});
  }

  removeUser(familyId: string, user: any) {
    return this.af.database.list('users/' + user.$key + '/relationship').remove('familyId');
  }

}
