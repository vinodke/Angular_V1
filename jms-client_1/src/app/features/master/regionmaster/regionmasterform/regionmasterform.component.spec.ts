import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionmasterformComponent } from './regionmasterform.component';

describe('RegionmasterformComponent', () => {
  let component: RegionmasterformComponent;
  let fixture: ComponentFixture<RegionmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
