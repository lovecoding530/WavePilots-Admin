import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form      : FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService
  ) { 
    this.form = new FormGroup({
      email       : new FormControl('', Validators.required),
      password    : new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.authService.getAuth().subscribe(state=> {
      if(state !== null) {
        this.location.back();
      }
    });
  }

  /**
   * sign in with facebook
   */
  onSignInWithFacebook() {
    this.authService.signInWithFacebook()
          .then((auth)=> {
            console.log(auth);
            this.router.navigate(['/home/carousels'], {relativeTo: this.route});            
          }, (error)=> {
            console.log(error);
          });
  }

  /**
   * sign in with google+
   */
  onSignInWithGoogleplus() {
    this.authService.signInWithGoogleplus()
          .then((auth)=> {
            this.router.navigate(['/home/carousels'], {relativeTo: this.route});
          }, (error)=> {
            console.log(error);
          });
  }

  /**
   * Sign with Email & Password
   */
  onSubmit(form: FormGroup) {
    this.loading = true;
    this.authService.signInWithEmail(form.value.email, form.value.password)
          .then((auth)=> {
            this.router.navigate(['/home/carousels'], {relativeTo: this.route});
            // this.loading = false;
          }, (error)=> {
            console.log(error);
            this.loading = false;
          });
  }

}
