import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import {firebaseConfig} from '../app.constants';

declare var $: any;

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log("UsermgmtComponent", this.getParameterByName("mode", location.href));

    // Get the action to complete.
    var mode = this.getParameterByName('mode', location.href);
    // Get the one-time code from the query parameter.
    var actionCode = this.getParameterByName('oobCode', location.href);
    // (Optional) Get the API key from the query parameter.
    var apiKey = this.getParameterByName('apiKey', location.href);
    // (Optional) Get the continue URL from the query parameter if available.
    var continueUrl = this.getParameterByName('continueUrl', location.href);
    // (Optional) Get the language code if available.
    var lang = this.getParameterByName('lang', location.href) || 'en';

    // Configure the Firebase SDK.
    // This is the minimum configuration required for the API to be used.
    var config = {
      'apiKey': apiKey  // This key could also be copied from the web
                        // initialization snippet found in the Firebase console.
    };
    var app = firebase.initializeApp(firebaseConfig, 'usermgmt');
    var auth = app.auth();
      // Handle the user management action.
    switch (mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        this.handleResetPassword(auth, actionCode, continueUrl, lang);
        break;
      case 'recoverEmail':
        // Display email recovery handler and UI.
        this.handleRecoverEmail(auth, actionCode, lang);
        break;
      case 'verifyEmail':
        // Display email verification handler and UI.
        this.handleVerifyEmail(auth, actionCode, continueUrl, lang);
        break;
      default:
        // Error: invalid mode.
    }
  }

  getParameterByName(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
  }

  handleResetPassword(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then((email) => {

      // TODO: Show the reset screen with the user's email and ask the user for
      // the new password.
      this.router.navigate(['/usermgmt/reset-password', {email, actionCode}]);
    }).catch((error) => {
      // Invalid or expired action code. Ask user to try to reset the password
      // again.
      this.router.navigate(['/usermgmt/display-message', {title: "Try resetting your password again", message: error.message}]);
    });
  }

  handleRecoverEmail(auth, actionCode, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    var restoredEmail = null;
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then((info) => {
      // Get the restored email address.
      restoredEmail = info['data']['email'];
  
      // Revert to the old email.
      return auth.applyActionCode(actionCode);
    }).then(() => {
      // Account email reverted to restoredEmail
  
      // TODO: Display a confirmation message to the user.
  
      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      auth.sendPasswordResetEmail(restoredEmail).then(() => {
        // Password reset confirmation sent. Ask user to check their email.
      }).catch((error) => {
        // Error encountered while sending password reset code.
      });
    }).catch((error) => {
      // Invalid code.
    });
  }
  
  handleVerifyEmail(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.
    auth.applyActionCode(actionCode).then((resp) => {
      // Email address has been verified.

      // TODO: Display a confirmation message to the user.
      // You could also provide the user with a link back to the app.

      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
      this.router.navigate(['/usermgmt/display-message', {title: "Verified Email", message: "Your email has been verified.\nYou can contiune to use the app"}]);
    }).catch((error) => {
      // Code is invalid or expired. Ask the user to verify their email address
      // again.
      this.router.navigate(['/usermgmt/display-message', {title: "Invalid Request", message: error.message}]);
    });
  }

}
