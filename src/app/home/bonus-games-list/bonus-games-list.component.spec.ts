import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusGamesListComponent } from './bonus-games-list.component';

describe('BonusGamesListComponent', () => {
  let component: BonusGamesListComponent;
  let fixture: ComponentFixture<BonusGamesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusGamesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusGamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
