import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AuthService {

  constructor( private af: AngularFire ) {
  }

  /**
   * sign in with facebook
   */
  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }

  /**
   * sign in with google plus
   */
  signInWithGoogleplus(): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  signInWithEmail(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    return this.af.auth.login({ email : email, password : password },
                              { provider: AuthProviders.Password, method: AuthMethods.Password });
  }

  /**
   * get auth
   */
  getAuth() {
    return this.af.auth;
  }

  /**
   * sign out
   */
  signOut(): Promise<void> {
    return this.af.auth.logout();
  }

  /**
   * check user is admin, ...
   */
  isAdminUser(userId: string) {
    return Observable.create(observer => {
      this.af.database.object('roles/admin/' + userId).subscribe(res => {
        observer.next(res.$value);
      }, (error)=> observer.error(error));
    });
  }
}
