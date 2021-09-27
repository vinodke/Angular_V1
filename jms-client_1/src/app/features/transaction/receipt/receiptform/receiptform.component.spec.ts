import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptformComponent } from './receiptform.component';

describe('ReceiptformComponent', () => {
  let component: ReceiptformComponent;
  let fixture: ComponentFixture<ReceiptformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
