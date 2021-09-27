import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColormastergridComponent } from './colormastergrid.component';

describe('ColormastergridComponent', () => {
  let component: ColormastergridComponent;
  let fixture: ComponentFixture<ColormastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColormastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColormastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
