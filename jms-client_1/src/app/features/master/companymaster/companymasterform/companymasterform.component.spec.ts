import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanymasterformComponent } from './companymasterform.component';

describe('CompanymasterformComponent', () => {
  let component: CompanymasterformComponent;
  let fixture: ComponentFixture<CompanymasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanymasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanymasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
