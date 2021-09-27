import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankmasterformComponent } from './bankmasterform.component';

describe('BankmasterformComponent', () => {
  let component: BankmasterformComponent;
  let fixture: ComponentFixture<BankmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
