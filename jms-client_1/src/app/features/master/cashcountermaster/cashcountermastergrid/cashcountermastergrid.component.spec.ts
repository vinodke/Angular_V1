import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashcountermastergridComponent } from './cashcountermastergrid.component';

describe('CashcountermastergridComponent', () => {
  let component: CashcountermastergridComponent;
  let fixture: ComponentFixture<CashcountermastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashcountermastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashcountermastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
