import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesdivisionmasterformComponent } from './salesdivisionmasterform.component';

describe('SalesdivisionmasterformComponent', () => {
  let component: SalesdivisionmasterformComponent;
  let fixture: ComponentFixture<SalesdivisionmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesdivisionmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesdivisionmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
