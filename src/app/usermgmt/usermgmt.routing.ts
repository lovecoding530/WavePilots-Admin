import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { UsermgmtComponent } from './usermgmt.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DisplayMessageComponent } from './display-message/display-message.component';

const routes: Routes =[
  { 
    path: 'usermgmt', component: UsermgmtComponent,
    children: [
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'display-message', component: DisplayMessageComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  exports: [
    RouterModule
  ],
})
export class UsermgmtRoutingModule { }
