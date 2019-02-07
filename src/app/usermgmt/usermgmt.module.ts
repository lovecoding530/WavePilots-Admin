import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsermgmtComponent } from './usermgmt.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DisplayMessageComponent } from './display-message/display-message.component';
import { UsermgmtRoutingModule } from './usermgmt.routing';

@NgModule({
  imports: [
    CommonModule,    
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UsermgmtRoutingModule
  ],
  declarations: [
    UsermgmtComponent,
    ResetPasswordComponent,
    DisplayMessageComponent,
  ],
  providers: [
  ],
  exports: [
    UsermgmtComponent
  ]
})
export class UsermgmtModule { }
