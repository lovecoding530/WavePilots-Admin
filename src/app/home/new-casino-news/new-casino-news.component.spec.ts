import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCasinoNewsComponent } from './new-casino-news.component';

describe('NewCasinoNewsComponent', () => {
  let component: NewCasinoNewsComponent;
  let fixture: ComponentFixture<NewCasinoNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCasinoNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCasinoNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
