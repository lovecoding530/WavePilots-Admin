import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCasinoComponent } from './new-casino.component';

describe('NewCasinoComponent', () => {
  let component: NewCasinoComponent;
  let fixture: ComponentFixture<NewCasinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCasinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
