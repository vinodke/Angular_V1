import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashcountermasterformComponent } from './cashcountermasterform.component';

describe('CashcountermasterformComponent', () => {
  let component: CashcountermasterformComponent;
  let fixture: ComponentFixture<CashcountermasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashcountermasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashcountermasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
