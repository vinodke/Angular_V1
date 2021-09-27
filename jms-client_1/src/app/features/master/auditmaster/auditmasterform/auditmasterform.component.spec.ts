import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditmasterformComponent } from './auditmasterform.component';

describe('AuditmasterformComponent', () => {
  let component: AuditmasterformComponent;
  let fixture: ComponentFixture<AuditmasterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditmasterformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditmasterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
