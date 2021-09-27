import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankmastergridComponent } from './bankmastergrid.component';

describe('BankmastergridComponent', () => {
  let component: BankmastergridComponent;
  let fixture: ComponentFixture<BankmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankmastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
