import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentmethodgridComponent } from './paymentmethodgrid.component';

describe('PaymentmethodgridComponent', () => {
  let component: PaymentmethodgridComponent;
  let fixture: ComponentFixture<PaymentmethodgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentmethodgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentmethodgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
