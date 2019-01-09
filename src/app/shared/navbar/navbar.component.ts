import { Component, OnInit } from '@angular/core';

import { menuItems } from '../../app.constants';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentPage: string = '';

  constructor( private authService: AuthService ) { }

  ngOnInit() {}

  onEditProfile() {

  }

  onSignOut() {
    this.authService.signOut()
                    .then(_=> {
                      location.reload();
                    });
  }

}
