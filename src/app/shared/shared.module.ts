import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, 
         ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FooterComponent } from './footer/footer.component';
import { Ng2AutocompleterComponent } from './ng2-autocompleter/ng2-autocompleter.component';
import { Ng2MultipickerComponent, MultiSelectSearchFilter } from './ng2-multipicker/ng2-multipicker.component';
import { VideoPreviewComponent } from './video-preview/video-preview.component';

import { SharedService } from './shared.service';
import { AuthModule } from '../auth/auth.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    AuthModule
  ],
  declarations: [
    NavbarComponent, 
    FooterComponent, 
    SidebarComponent, 
    SpinnerComponent, 
    Ng2AutocompleterComponent, 
    Ng2MultipickerComponent,
    MultiSelectSearchFilter,
    VideoPreviewComponent,
  ],
  exports: [
    NavbarComponent, 
    FooterComponent, 
    SidebarComponent,
    SpinnerComponent,
    Ng2AutocompleterComponent,
    Ng2MultipickerComponent,
    VideoPreviewComponent,
  ],
  providers: [
    SharedService
  ]
})
export class SharedModule { }
