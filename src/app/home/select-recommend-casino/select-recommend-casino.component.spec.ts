import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRecommendCasinoComponent } from './select-recommend-casino.component';

describe('SelectRecommendCasinoComponent', () => {
  let component: SelectRecommendCasinoComponent;
  let fixture: ComponentFixture<SelectRecommendCasinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRecommendCasinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRecommendCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
