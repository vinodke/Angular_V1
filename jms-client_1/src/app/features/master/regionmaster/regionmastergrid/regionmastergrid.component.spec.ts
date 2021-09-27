import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionmastergridComponent } from './regionmastergrid.component';

describe('RegionmastergridComponent', () => {
  let component: RegionmastergridComponent;
  let fixture: ComponentFixture<RegionmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
