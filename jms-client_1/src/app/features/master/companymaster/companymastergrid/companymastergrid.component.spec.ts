import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanymastergridComponent } from './companymastergrid.component';

describe('CompanymastergridComponent', () => {
  let component: CompanymastergridComponent;
  let fixture: ComponentFixture<CompanymastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanymastergridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanymastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
