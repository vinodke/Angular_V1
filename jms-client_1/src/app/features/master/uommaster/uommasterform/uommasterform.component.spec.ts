import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UommasterformComponent } from './uommasterform.component';

describe('UommasterformComponent', () => {
  let component: UommasterformComponent;
  let fixture: ComponentFixture<UommasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UommasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UommasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
