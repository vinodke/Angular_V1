import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditmastergridComponent } from './auditmastergrid.component';

describe('AuditmastergridComponent', () => {
  let component: AuditmastergridComponent;
  let fixture: ComponentFixture<AuditmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
