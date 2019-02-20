import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form      : FormGroup;
  loading = false;
  email     : string;
  actionCode: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.form = new FormGroup({
      password    : new FormControl('', Validators.required),
      confirmPassword    : new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    let params = this.route.snapshot.params;

    this.email = params.email;
    this.actionCode = params.actionCode
  }

  /**
   * Reset password
   */
  onSubmit(form: FormGroup) {
    let password = form.value.password;
    let confirmPassword = form.value.confirmPassword;
    if (password != confirmPassword) {
      return;
    }

    this.loading = true;

    let auth = firebase.app('usermgmt').auth();

    // Save the new password.
    auth.confirmPasswordReset(this.actionCode, password).then((resp) => {
      // Password reset has been confirmed and new password updated.

      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);

      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
      this.router.navigate(['/usermgmt/display-message', 
        {
          title: "New Password Reset Successfully", 
          message: "Your New password is ready for you to Log in."
        }
      ]);
    }).catch((error) => {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
      this.router.navigate(['/usermgmt/display-message', 
        {
          title: "Try resetting your password", 
          message: error.message
        }
      ]);
    });
  }
}
