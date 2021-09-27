import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptgridComponent } from './receiptgrid.component';

describe('ReceiptgridComponent', () => {
  let component: ReceiptgridComponent;
  let fixture: ComponentFixture<ReceiptgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
