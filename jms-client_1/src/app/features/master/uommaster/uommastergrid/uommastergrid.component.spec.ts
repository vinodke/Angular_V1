import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UommastergridComponent } from './uommastergrid.component';

describe('UommastergridComponent', () => {
  let component: UommastergridComponent;
  let fixture: ComponentFixture<UommastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UommastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UommastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
