import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentmethodformComponent } from './paymentmethodform.component';

describe('PaymentmethodformComponent', () => {
  let component: PaymentmethodformComponent;
  let fixture: ComponentFixture<PaymentmethodformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentmethodformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentmethodformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
