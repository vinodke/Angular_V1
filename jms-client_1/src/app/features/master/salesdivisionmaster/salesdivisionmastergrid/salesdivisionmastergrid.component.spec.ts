import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesdivisionmastergridComponent } from './salesdivisionmastergrid.component';

describe('SalesdivisionmastergridComponent', () => {
  let component: SalesdivisionmastergridComponent;
  let fixture: ComponentFixture<SalesdivisionmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesdivisionmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesdivisionmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
