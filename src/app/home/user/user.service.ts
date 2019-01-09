import { Injectable } from '@angular/core';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';


@Injectable()
export class UserService {

  constructor( private af: AngularFire ) { 

  }

  
  /**
   * get all users
   */
  get allUsers(): FirebaseListObservable<any> {
    return this.af.database.list('/users');
  }

  /**
   * add user
   */
  addUser(user: any) {
    user.CreatedAt = firebase.database['ServerValue']['TIMESTAMP'];
    
    return this.af.database.list('users_pending/').push(user);
  }
}
