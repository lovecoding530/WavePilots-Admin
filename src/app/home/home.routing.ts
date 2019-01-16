import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { PilotListComponent } from './pilot-list/pilot-list.component';
import { WaverListComponent } from './waver-list/waver-list.component';
import { WaveListComponent } from './wave-list/wave-list.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupFamilyComponent } from './group-family/group-family.component';
import { GroupTeamComponent } from './group-team/group-team.component';
import { MessageListComponent } from './message-list/message-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { NewCasinoComponent } from "./new-casino/new-casino.component";
import { NewBonusGameComponent } from "./new-bonus-game/new-bonus-game.component";
import { NewSlotComponent } from "./new-slot/new-slot.component";
import { NewCasinoNewsComponent } from "./new-casino-news/new-casino-news.component";
import { CasinosListComponent } from "./casinos-list/casinos-list.component";
import { BonusGamesListComponent } from "./bonus-games-list/bonus-games-list.component";
import { SlotsListComponent } from "./slots-list/slots-list.component";
import { CasinoNewsListComponent } from "./casino-news-list/casino-news-list.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { ReviewDetailComponent } from "./review-detail/review-detail.component";
import { CarouselsListComponent } from './carousels-list/carousels-list.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes =[
  { 
    path: 'home', component: HomeComponent, canActivate: [ AuthGuard ],
    children: [
      // { path: 'dashboard',              component: DashboardComponent },
      { path: 'users',                  component: UserListComponent },
      { path: 'pilots',                  component: PilotListComponent },
      { path: 'wavers',                  component: WaverListComponent },
      { path: 'waves',                  component: WaveListComponent },
      { path: 'issues',                  component: IssueListComponent },
      { path: 'users/:group/:id',       component: UserListComponent },
      { path: 'user/:mode/:id',         component: UserComponent },
      { path: 'group-family/:mode/:id', component: GroupFamilyComponent },  /**mode: new/update/detail */
      { path: 'group-team/:mode/:id',   component: GroupTeamComponent },    /** " */
      { path: 'casinos',                component: CasinosListComponent },
      { path: 'casino/:mode/:casino',   component: NewCasinoComponent },
      { path: 'bonusgames',             component: BonusGamesListComponent },
      { path: 'bonus/:mode/:bonus',     component: NewBonusGameComponent },
      { path: 'slots',                  component: SlotsListComponent },
      { path: 'slot/:mode/:slot',       component: NewSlotComponent },
      { path: 'casinonews',             component: CasinoNewsListComponent },
      { path: 'casinonews/:mode/:casinonews', component: NewCasinoNewsComponent },
      { path: 'reviews',                component: ReviewsComponent },
      { path: 'review/:review',         component: ReviewDetailComponent },
      { path: 'carousels',              component: CarouselsListComponent },

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
export class HomeRoutingModule { }
