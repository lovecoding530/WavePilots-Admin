import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinosListComponent } from './casinos-list.component';

describe('CasinosListComponent', () => {
  let component: CasinosListComponent;
  let fixture: ComponentFixture<CasinosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
