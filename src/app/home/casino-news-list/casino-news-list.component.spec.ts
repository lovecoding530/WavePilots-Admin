import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoNewsListComponent } from './casino-news-list.component';

describe('CasinoNewsListComponent', () => {
  let component: CasinoNewsListComponent;
  let fixture: ComponentFixture<CasinoNewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinoNewsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoNewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
