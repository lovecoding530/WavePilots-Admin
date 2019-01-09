import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselsListComponent } from './carousels-list.component';

describe('CarouselsListComponent', () => {
  let component: CarouselsListComponent;
  let fixture: ComponentFixture<CarouselsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
