import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    CommonModule,    
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent, 
    RegisterComponent
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  exports: [
    AuthComponent
  ]
})
export class AuthModule { }
