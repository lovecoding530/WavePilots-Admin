import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBonusGameComponent } from './new-bonus-game.component';

describe('NewBonusGameComponent', () => {
  let component: NewBonusGameComponent;
  let fixture: ComponentFixture<NewBonusGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBonusGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBonusGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
