import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CKEditorModule } from 'ng2-ckeditor';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { PilotListComponent } from './pilot-list/pilot-list.component';
import { WaverListComponent } from './waver-list/waver-list.component';
import { WaveListComponent } from './wave-list/wave-list.component';
import { MoneyActivityListComponent } from './money-activity-list/money-activity-list.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupFamilyComponent } from './group-family/group-family.component';
import { GroupTeamComponent } from './group-team/group-team.component';
import { MessageListComponent } from './message-list/message-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { TrainingListComponent } from './training-list/training-list.component';

import { HomeRoutingModule } from './home.routing';
import { SharedModule } from '../shared/shared.module';

import { FamilyService } from './group-family/family.service';
import { TeamService } from './group-team/team.service';
import { UserService } from './user/user.service';
import { TrainingService } from './training-list/training.service';
import { CasinosListComponent } from './casinos-list/casinos-list.component';
import { NewCasinoComponent } from './new-casino/new-casino.component';
import { NewBonusGameComponent } from './new-bonus-game/new-bonus-game.component';
import { NewSlotComponent } from './new-slot/new-slot.component';
import { NewCasinoNewsComponent } from './new-casino-news/new-casino-news.component';
import { BonusGamesListComponent } from './bonus-games-list/bonus-games-list.component';
import { SlotsListComponent } from './slots-list/slots-list.component';
import { CasinoNewsListComponent } from './casino-news-list/casino-news-list.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { CarouselsListComponent } from './carousels-list/carousels-list.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { SelectRecommendCasinoComponent } from './select-recommend-casino/select-recommend-casino.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    CKEditorModule,

    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent, 
    UserComponent, 
    UserListComponent, 
    PilotListComponent,
    WaverListComponent,
    WaveListComponent,
    MoneyActivityListComponent,
    IssueListComponent,
    GroupListComponent,
    GroupFamilyComponent, 
    GroupTeamComponent, 
    MessageListComponent, 
    ImageListComponent, 
    TrainingListComponent, 
    CasinosListComponent, 
    NewCasinoComponent, 
    NewBonusGameComponent, 
    NewSlotComponent, 
    NewCasinoNewsComponent, 
    BonusGamesListComponent, 
    SlotsListComponent, 
    CasinoNewsListComponent, 
    ReviewsComponent, 
    CarouselsListComponent, 
    ReviewDetailComponent, 
    SelectRecommendCasinoComponent,
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    FamilyService,
    TeamService,
    UserService,
    TrainingService,
  ]
})
export class HomeModule { }
